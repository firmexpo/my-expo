'use strict';

import dns from 'node:dns/promises';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

/*
============================================================
 FIRMEXPO STRICT EMAIL VERIFIER (v2)
 Node.js 18+ / ESM

 Statuses:
   deliverable  - server accepted recipient, not catch-all, not gateway, not role
   review       - accepted but uncertain (catch-all / gateway / role address)
   unknown      - could not verify (port 25 blocked, timeout, greylist, policy block)
   invalid      - bad syntax, no domain/MX, disposable, or recipient rejected
   suppressed   - in your suppression list

 NOTE: This script never sends an email. It stops at RCPT TO and QUITs.
============================================================
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
    connectTimeout: 25000,     // TCP connect + greeting
    smtpTimeout: 8000,        // each SMTP command
    dnsTimeout: 6000,
    preflightTimeout: 5000,   // port 25 test

    // heloDomain: 'firmexpo.com',
    // fromEmail: 'info@firmexpo.com',
    heloDomain: 'localhost',
    fromEmail: 'info@localhost',

    catchAllTests: 2,
    maxMxTries: 2,            // only try first N MX hosts
    concurrency: 3,

    rejectRoleAddresses: false,

    disposableFile: path.join(__dirname, 'disposable-domains.txt'),
    suppressionFile: path.join(__dirname, 'suppressed.json'),
    outputFile: path.join(__dirname, 'verification-results.json')
};


// ============================================================
// STATIC LISTS
// ============================================================

const ROLE_PREFIXES = new Set([
    'admin', 'administrator', 'billing', 'contact',
    'customerservice', 'customer-service', 'enquiries', 'enquiry',
    'finance', 'hello', 'help', 'hr', 'info', 'information',
    'inquiries', 'inquiry', 'jobs', 'marketing', 'media', 'office',
    'orders', 'press', 'sales', 'service', 'support', 'team', 'webmaster'
]);

/*
 * Security gateways: they often accept every recipient (or hide
 * mailbox existence), so an "accepted" answer proves nothing.
 */
const GATEWAY_PATTERNS = [
    'antispameurope.com', 'hornetsecurity', 'mimecast', 'pphosted.com',
    'proofpoint', 'barracuda', 'messagelabs', 'iphmx.com', 'trendmicro',
    'mailcontrol.com', 'spamh.com', 'sophos.com', 'fireeyecloud.com'
];

/*
 * Text patterns that mean "this mailbox does not exist"
 * (as opposed to "we are blocked / rate limited / blacklisted").
 */
const RECIPIENT_REJECT_PATTERNS = [
    /user unknown/i,
    /unknown user/i,
    /no such user/i,
    /no such recipient/i,
    /recipient (address )?rejected/i,
    /recipient not found/i,
    /does not exist/i,
    /doesn'?t exist/i,
    /mailbox (unavailable|not found|does not exist|disabled)/i,
    /invalid (recipient|mailbox|address)/i,
    /unknown recipient/i,
    /address rejected/i,
    /account .*(disabled|does not exist)/i,
    /\b5\.1\.1\b/,
    /\b5\.1\.2\b/,
    /\b5\.1\.6\b/
];

/*
 * Text patterns that mean "we were blocked", NOT "mailbox is bad".
 */
const POLICY_BLOCK_PATTERNS = [
    /blocked/i,
    /blacklist/i,
    /black list/i,
    /spamhaus/i,
    /reputation/i,
    /\bPTR\b/i,
    /reverse dns/i,
    /rdns/i,
    /not allowed/i,
    /policy/i,
    /denied/i,
    /relay/i,
    /rate limit/i,
    /too many/i,
    /\b5\.7\.\d+\b/
];


// ============================================================
// LOAD FILES (ONCE)
// ============================================================

function loadDisposableDomains() {
    try {
        if (!fs.existsSync(CONFIG.disposableFile)) return new Set();

        const content = fs.readFileSync(CONFIG.disposableFile, 'utf8');

        return new Set(
            content
                .split(/\r?\n/)
                .map(x => x.trim().toLowerCase())
                .filter(x => x && !x.startsWith('#'))
        );
    } catch (error) {
        console.error('Disposable-domain file error:', error.message);
        return new Set();
    }
}

function loadSuppressed() {
    const map = new Map();

    try {
        if (!fs.existsSync(CONFIG.suppressionFile)) return map;

        const data = JSON.parse(
            fs.readFileSync(CONFIG.suppressionFile, 'utf8')
        );

        if (!Array.isArray(data)) return map;

        for (const item of data) {
            if (typeof item === 'string') {
                map.set(item.toLowerCase(), { reason: 'previously_suppressed' });
            } else if (item?.email) {
                map.set(item.email.toLowerCase(), item);
            }
        }
    } catch (error) {
        console.error('Suppression file error:', error.message);
    }

    return map;
}

const disposableDomains = loadDisposableDomains();
const suppressed = loadSuppressed();


// ============================================================
// HELPERS
// ============================================================

function validateSyntax(email) {
    if (typeof email !== 'string' || !email.trim()) return false;

    email = email.trim();

    const regex =
        /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i;

    if (!regex.test(email)) return false;
    if (email.length > 254 || email.includes('..')) return false;

    const [local] = email.split('@');
    if (local.length > 64 || local.startsWith('.') || local.endsWith('.')) {
        return false;
    }

    return true;
}

function splitEmail(email) {
    const parts = email.trim().toLowerCase().split('@');
    if (parts.length !== 2) return { local: null, domain: null };
    return { local: parts[0], domain: parts[1] };
}

function withTimeout(promise, ms, label) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(
            () => reject(new Error(`${label} timeout`)),
            ms
        );
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function isGateway(mxRecords) {
    return mxRecords.some(mx =>
        GATEWAY_PATTERNS.some(p => mx.exchange.toLowerCase().includes(p))
    );
}

function isRecipientRejection(text) {
    return RECIPIENT_REJECT_PATTERNS.some(r => r.test(text || ''));
}

function isPolicyBlock(text) {
    return POLICY_BLOCK_PATTERNS.some(r => r.test(text || ''));
}


// ============================================================
// PORT 25 PREFLIGHT (cached)
// ============================================================

let port25Cache = null;

async function isPort25Open() {
    if (port25Cache !== null) return port25Cache;

    port25Cache = await new Promise(resolve => {
        const s = net.createConnection({
            host: 'gmail-smtp-in.l.google.com',
            port: 25
        });

        const t = setTimeout(() => {
            s.destroy();
            resolve(false);
        }, CONFIG.preflightTimeout);

        s.once('connect', () => {
            clearTimeout(t);
            s.destroy();
            resolve(true);
        });

        s.once('error', () => {
            clearTimeout(t);
            resolve(false);
        });
    });

    return port25Cache;
}


// ============================================================
// DNS
// ============================================================

async function checkDNS(domain) {
    const result = { exists: false, A: [], AAAA: [], MX: [], errors: [] };

    const t = CONFIG.dnsTimeout;

    const results = await Promise.allSettled([
        withTimeout(dns.resolve4(domain), t, 'A'),
        withTimeout(dns.resolve6(domain), t, 'AAAA'),
        withTimeout(dns.resolveMx(domain), t, 'MX')
    ]);

    const names = ['A', 'AAAA', 'MX'];

    results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
            result[names[i]] = r.value;
        } else {
            result.errors.push(
                `${names[i]}: ${r.reason?.code || r.reason?.message}`
            );
        }
    });

    result.MX.sort((a, b) => a.priority - b.priority);

    result.exists =
        result.A.length > 0 ||
        result.AAAA.length > 0 ||
        result.MX.length > 0;

    return result;
}


// ============================================================
// SMTP LOW LEVEL
// ============================================================

function parseSMTPResponse(buffer) {
    const lines = buffer.split(/\r?\n/).filter(Boolean);

    if (!lines.length) return { complete: false };

    const last = lines[lines.length - 1];
    const match = last.match(/^(\d{3})([ -])(.*)$/);

    if (!match) return { complete: false };

    // "250-..." means more lines follow
    if (match[2] === '-') return { complete: false };

    return {
        complete: true,
        code: Number(match[1]),
        text: buffer.trim()
    };
}

function connectSMTP(host) {
    return new Promise((resolve, reject) => {
        const socket = net.createConnection({ host, port: 25 });

        let buffer = '';
        let done = false;

        const finish = (fn, value) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            socket.removeListener('data', onData);
            fn(value);
        };

        const timer = setTimeout(() => {
            socket.destroy();
            finish(reject, new Error('SMTP connection timeout'));
        }, CONFIG.connectTimeout);

        const onData = data => {
            buffer += data;
            const r = parseSMTPResponse(buffer);
            if (r.complete) {
                finish(resolve, { socket, code: r.code, response: r.text });
            }
        };

        socket.setEncoding('utf8');
        socket.on('data', onData);
        socket.on('error', err => finish(reject, err));
        socket.on('close', () =>
            finish(reject, new Error('SMTP connection closed'))
        );
    });
}

function smtpCommand(socket, command) {
    return new Promise((resolve, reject) => {
        let buffer = '';
        let done = false;

        const cleanup = () => {
            clearTimeout(timer);
            socket.removeListener('data', onData);
            socket.removeListener('error', onError);
            socket.removeListener('close', onClose);
        };

        const finish = (fn, value) => {
            if (done) return;
            done = true;
            cleanup();
            fn(value);
        };

        const timer = setTimeout(
            () => finish(reject, new Error('SMTP command timeout')),
            CONFIG.smtpTimeout
        );

        const onData = data => {
            buffer += data;
            const r = parseSMTPResponse(buffer);
            if (r.complete) {
                finish(resolve, { code: r.code, response: r.text });
            }
        };

        const onError = err => finish(reject, err);
        const onClose = () =>
            finish(reject, new Error('SMTP connection closed'));

        socket.on('data', onData);
        socket.on('error', onError);
        socket.on('close', onClose);

        socket.write(`${command}\r\n`);
    });
}


// ============================================================
// SMTP VERIFY (one address)
//
// Returns status:
//   accepted      - 2xx on RCPT TO
//   rejected      - 5xx that clearly says mailbox does not exist
//   policy_block  - 5xx that looks like IP/policy block (NOT proof)
//   temporary     - 4xx (greylist etc.)
//   unreachable   - could not connect / timeouts
// ============================================================

async function smtpVerify(email, mxRecords) {
    if (!Array.isArray(mxRecords) || mxRecords.length === 0) {
        return { status: 'no_mx', code: null, server: null, response: null };
    }

    let lastError = null;

    for (const mx of mxRecords.slice(0, CONFIG.maxMxTries)) {
        const host = mx.exchange;
        let connection = null;

        try {
            connection = await connectSMTP(host);
            const socket = connection.socket;

            if (connection.code >= 400) {
                socket.destroy();
                lastError = `SMTP greeting ${connection.code}: ${connection.response}`;
                continue; // next MX
            }

            let response = await smtpCommand(
                socket,
                `EHLO ${CONFIG.heloDomain}`
            );

            if (response.code >= 400) {
                socket.destroy();
                lastError = `EHLO ${response.code}: ${response.response}`;
                continue;
            }

            response = await smtpCommand(
                socket,
                `MAIL FROM:<${CONFIG.fromEmail}>`
            );

            if (response.code >= 400) {
                socket.destroy();
                lastError = `MAIL FROM ${response.code}: ${response.response}`;
                continue;
            }

            response = await smtpCommand(socket, `RCPT TO:<${email}>`);

            try {
                await smtpCommand(socket, 'QUIT');
            } catch {}

            socket.destroy();

            const base = {
                code: response.code,
                server: host,
                response: response.response
            };

            if (response.code >= 200 && response.code < 300) {
                return { status: 'accepted', ...base };
            }

            if (response.code >= 500 && response.code < 600) {
                // Only trust it as "mailbox missing" if the text says so
                if (isRecipientRejection(response.response) &&
                    !isPolicyBlock(response.response)) {
                    return { status: 'rejected', ...base };
                }
                return { status: 'policy_block', ...base };
            }

            if (response.code >= 400 && response.code < 500) {
                return { status: 'temporary', ...base };
            }

            return { status: 'unknown', ...base };

        } catch (error) {
            lastError = error.message;
            if (connection?.socket) connection.socket.destroy();
            // move on to next MX (no retry on same host)
        }
    }

    return {
        status: 'unreachable',
        code: null,
        server: null,
        response: lastError
    };
}


// ============================================================
// CATCH-ALL DETECTION
// ============================================================

async function checkCatchAll(domain, mxRecords) {
    if (!mxRecords?.length) {
        return { detected: null, status: 'no_mx', tested: 0, accepted: 0 };
    }

    let accepted = 0;
    let rejected = 0;
    let tested = 0;
    let failed = 0;

    for (let i = 0; i < CONFIG.catchAllTests; i++) {
        const randomEmail =
            `zz${crypto.randomBytes(10).toString('hex')}@${domain}`;

        const r = await smtpVerify(randomEmail, mxRecords);
        tested++;

        if (r.status === 'accepted') {
            accepted++;
        } else if (r.status === 'rejected') {
            rejected++;
            // A clear rejection of a random address = not catch-all
            return {
                detected: false,
                status: 'not_catch_all',
                tested,
                accepted,
                rejected
            };
        } else {
            failed++;
            // Unreachable / blocked: stop wasting time
            if (r.status === 'unreachable') break;
        }
    }

    if (accepted === tested && tested > 0) {
        return { detected: true, status: 'catch_all', tested, accepted, rejected };
    }

    // Nothing accepted but also nothing clearly rejected = we don't know
    return {
        detected: null,
        status: 'inconclusive',
        tested,
        accepted,
        rejected,
        failed
    };
}


// ============================================================
// VERIFY ONE EMAIL
// ============================================================

async function verifyEmail(inputEmail) {
    const email = String(inputEmail).trim().toLowerCase();

    const result = {
        email,
        timestamp: new Date().toISOString(),
        checks: {
            syntax: false,
            domain_exists: false,
            dns: { A: [], AAAA: [], MX: [] },
            disposable: false,
            known_invalid: false,
            role_based: false,
            previously_risky: false,
            gateway: false,
            catch_all: { detected: null, status: 'not_checked' },
            mail_server: {
                status: 'not_checked',
                code: null,
                server: null,
                response: null
            }
        },
        status: 'unknown',
        reasons: []
    };

    // 1. Syntax
    if (!validateSyntax(email)) {
        result.status = 'invalid';
        result.reasons.push('invalid_email_syntax');
        return result;
    }
    result.checks.syntax = true;

    const { local, domain } = splitEmail(email);

    if (!domain) {
        result.status = 'invalid';
        result.reasons.push('domain_missing');
        return result;
    }

    // 2. DNS / MX
    let dnsResult;
    try {
        dnsResult = await checkDNS(domain);
    } catch (error) {
        result.status = 'unknown';
        result.reasons.push('dns_lookup_failed');
        return result;
    }

    result.checks.domain_exists = dnsResult.exists;
    result.checks.dns = {
        A: dnsResult.A,
        AAAA: dnsResult.AAAA,
        MX: dnsResult.MX
    };

    if (!dnsResult.exists) {
        result.status = 'invalid';
        result.reasons.push('domain_does_not_exist');
        return result;
    }

    if (dnsResult.MX.length === 0) {
        result.status = 'invalid';
        result.reasons.push('no_mx_record');
        return result;
    }

    // 3. Disposable
    result.checks.disposable = disposableDomains.has(domain);

    if (result.checks.disposable) {
        result.status = 'invalid';
        result.reasons.push('disposable_email_domain');
        return result;
    }

    // 4. Suppression list
    const suppressedEntry = suppressed.get(email);

    if (suppressedEntry) {
        result.checks.known_invalid = true;
        result.checks.previously_risky = true;
        result.status = 'suppressed';
        result.reasons.push(suppressedEntry.reason || 'previously_suppressed');
        return result;
    }

    // 5. Role-based
    result.checks.role_based = ROLE_PREFIXES.has(local);

    if (result.checks.role_based && CONFIG.rejectRoleAddresses) {
        result.status = 'review';
        result.reasons.push('role_based_address');
        return result;
    }

    // 6. Port 25 preflight (fast fail)
    if (!(await isPort25Open())) {
        result.status = 'unknown';
        result.reasons.push('outbound_port_25_blocked');
        return result;
    }

    // 7. Gateway detection
    result.checks.gateway = isGateway(dnsResult.MX);
    if (result.checks.gateway) result.reasons.push('mx_is_security_gateway');

    // 8. SMTP check FIRST
    result.checks.mail_server = await smtpVerify(email, dnsResult.MX);
    const smtpStatus = result.checks.mail_server.status;

    if (smtpStatus === 'rejected') {
        result.status = 'invalid';
        result.reasons.push('mail_server_rejected_recipient');
        return result;
    }

    if (smtpStatus === 'accepted') {
        // Only test catch-all when it is actually needed
        result.checks.catch_all = await checkCatchAll(domain, dnsResult.MX);

        const ca = result.checks.catch_all;

        if (ca.detected === true) {
            result.reasons.push('catch_all_domain');
            result.status = 'review';
        } else if (ca.detected === null) {
            result.reasons.push('catch_all_test_inconclusive');
            result.status = 'review';
        } else if (result.checks.gateway) {
            result.status = 'review'; // gateway acceptance proves nothing
        } else {
            result.status = 'deliverable';
        }

        if (result.checks.role_based) {
            result.status = 'review';
            result.reasons.push('role_based_address');
        }

        return result;
    }

    if (smtpStatus === 'policy_block') {
        result.status = 'unknown';
        result.reasons.push('server_blocked_or_policy_rejection');
        return result;
    }

    if (smtpStatus === 'temporary') {
        result.status = 'unknown';
        result.reasons.push('temporary_smtp_response');
        return result;
    }

    result.status = 'unknown';
    result.reasons.push('mailbox_could_not_be_definitively_verified');
    return result;
}


// ============================================================
// BULK VERIFY
// ============================================================

async function verifyMany(emails, concurrency = CONFIG.concurrency) {
    const results = new Array(emails.length);
    let nextIndex = 0;

    async function worker() {
        while (true) {
            const index = nextIndex++;
            if (index >= emails.length) return;

            const email = emails[index];
            console.log(`[${index + 1}/${emails.length}] Checking ${email}`);

            try {
                results[index] = await verifyEmail(email);
            } catch (error) {
                results[index] = {
                    email,
                    status: 'error',
                    error: error.message
                };
            }
        }
    }

    await Promise.all(
        Array.from(
            { length: Math.min(concurrency, emails.length) },
            () => worker()
        )
    );

    return results;
}

function saveResults(results) {
    fs.writeFileSync(
        CONFIG.outputFile,
        JSON.stringify(results, null, 2),
        'utf8'
    );
    console.log(`\nResults saved to: ${CONFIG.outputFile}`);
}


// ============================================================
// CLI
//
//   node emailVerifier.js a@b.com
//   node emailVerifier.js a@b.com c@d.com
//   node emailVerifier.js --file emails.txt
// ============================================================

async function main() {
    const args = process.argv.slice(2);

    if (!args.length) {
        console.log(`
Usage:

  node emailVerifier.js email@example.com
  node emailVerifier.js a@x.com b@y.com
  node emailVerifier.js --file emails.txt     (one email per line)
`);
        process.exit(1);
    }

    let emails = [];

    if (args[0] === '--file') {
        const file = args[1];
        if (!file || !fs.existsSync(file)) {
            console.error('File not found:', file);
            process.exit(1);
        }
        emails = fs
            .readFileSync(file, 'utf8')
            .split(/\r?\n/)
            .map(x => x.trim())
            .filter(Boolean);
    } else {
        emails = args;
    }

    if (emails.length === 1) {
        console.log(`\nChecking: ${emails[0]}\n`);
        const result = await verifyEmail(emails[0]);
        console.log(JSON.stringify(result, null, 2));
        return;
    }

    const results = await verifyMany(emails);
    saveResults(results);

    const summary = {};
    for (const r of results) {
        summary[r.status] = (summary[r.status] || 0) + 1;
    }
    console.log('\nSummary:', summary);
}

const isMain =
    process.argv[1] &&
    path.resolve(process.argv[1]) === __filename;

if (isMain) {
    main().catch(error => {
        console.error('\nFatal error:', error);
        process.exit(1);
    });
}

export { verifyEmail, verifyMany };