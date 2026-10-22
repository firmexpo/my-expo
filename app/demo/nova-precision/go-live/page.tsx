
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import ExhibitionNav from "../ExhibitionNav";
import ExhibitionFooter from "../ExhibitionFooter";
import styles from "./go-live.module.css";

const base = "/demo/nova-precision";

// Set this to your streaming provider's official embed URL.
// Leave empty to display the preview state.
const liveEmbedUrl = process.env.NEXT_PUBLIC_COMPANY_LIVE_EMBED_URL || "";

const contactEmail =
  process.env.NEXT_PUBLIC_COMPANY_ENQUIRY_EMAIL || "sales@example.com";

type RequestKind = "representative" | "enquiry";

function openEmailDraft(
  event: FormEvent<HTMLFormElement>,
  kind: RequestKind,
  setStatus: (message: string) => void,
) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const fields = Array.from(data.entries())
    .filter(([key]) => key !== "website")
    .map(([key, value]) => `${key}: ${String(value).trim()}`)
    .join("\n");

  // Honeypot field: silently reject basic automated form submissions.
  if (String(data.get("website") || "").trim()) {
    setStatus("Unable to process this request.");
    return;
  }

  const subject =
    kind === "representative"
      ? "Request to connect with a company representative"
      : "New company exhibition enquiry";

  const body = [
    `Request type: ${kind === "representative" ? "Connect with a representative" : "Exhibition enquiry"}`,
    "",
    fields,
    "",
    "Sent from the FirmExpo Go Live exhibition page.",
  ].join("\n");

  const mailto =
    `mailto:${contactEmail}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;

  setStatus(
    "Your email app should open with the request prepared. Review it and send to complete the request.",
  );
}

export default function GoLivePage() {
  const [connectOpen, setConnectOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [formStatus, setFormStatus] = useState("");

  return (
    <>
      <ExhibitionNav />
      <main className={styles.page}>
      <section className={styles.pageIntro}>
        <div>
          <div className={styles.breadcrumb}>
            <Link href={base}>Exhibition</Link>
            <span>/</span>
            <span>Go Live</span>
          </div>

          <p className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            LIVE FROM THE EXHIBITION FLOOR
          </p>

          <h1>
            See the work.
            <br />
            <em>Meet the people.</em>
          </h1>

          <p className={styles.introText}>
            Watch the company in action, ask questions and connect with a
            representative who can help you explore the right solution.
          </p>
        </div>

        <aside className={styles.sessionNote}>
          <span className={styles.noteNumber}>SESSION / 01</span>
          <div className={styles.noteRule} />
          <p>Product demonstrations</p>
          <p>Technical questions</p>
          <p>Business enquiries</p>
        </aside>
      </section>

      <section className={styles.broadcastSection}>
        <div className={styles.broadcastHeader}>
          <div>
            <p className={styles.sectionKicker}>THE BROADCAST</p>
            <h2>Inside the factory</h2>
          </div>

          <div
            className={`${styles.broadcastStatus} ${liveEmbedUrl ? styles.statusConfigured : styles.statusPreview
              }`}
          >
            <span />
            {liveEmbedUrl ? "STREAM CONFIGURED" : "STREAM PREVIEW"}
          </div>
        </div>

        <div className={styles.broadcastLayout}>
          <div className={styles.playerColumn}>
            <div className={styles.player}>
              {liveEmbedUrl ? (
                <iframe
                  className={styles.playerIframe}
                  src={liveEmbedUrl}
                  title="Company live broadcast"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className={styles.playerPlaceholder}>
                  <div className={styles.playerGrid} />

                  <div className={styles.previewStamp}>
                    <span className={styles.previewStampDot} />
                    LIVE STUDIO
                  </div>

                  <div className={styles.playerMessage}>
                    <span className={styles.playSymbol}>▶</span>
                    <p className={styles.playerOverline}>
                      YOUR LIVE EXHIBITION STARTS HERE
                    </p>
                    <h3>Bring your production floor to the world.</h3>
                    <p>
                      Connect your streaming provider to display the company
                      broadcast in this player.
                    </p>
                  </div>

                  <div className={styles.playerBottom}>
                    <span>NOVAPRECISION / FACTORY TOUR</span>
                    <span>FIRMEXPO LIVE</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.broadcastMeta}>
              <div>
                <p className={styles.metaLabel}>NOW PRESENTING</p>
                <h3>Factory tour & product demonstration</h3>
                <p>
                  A closer look at production equipment, processes and
                  engineering capabilities.
                </p>
              </div>

              <span className={styles.sessionBadge}>SESSION 01</span>
            </div>

            <div className={styles.broadcastDisclaimer}>
              {liveEmbedUrl
                ? "A stream URL is configured. Actual playback depends on the provider, broadcast status and embed permissions."
                : "Preview mode: no live broadcast is connected yet. The player will display your stream once configured."}
            </div>
          </div>

          <aside className={styles.connectPanel}>
            <div className={styles.connectPanelTop}>
              <span className={styles.panelEyebrow}>DIRECT CONNECTION</span>
              <span className={styles.personIllustration} aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="20" r="11" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M12 55C13.5 42.5 20.5 36 32 36C43.5 36 50.5 42.5 52 55"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M26 20H38M32 14V26"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <p className={styles.connectEyebrow}>HAVE A QUESTION?</p>
            <h3>Talk to a real person.</h3>
            <p className={styles.connectDescription}>
              Need a specification, pricing detail or help finding the right
              product? Send a request to connect with the company team.
            </p>

            <div className={styles.availability}>
              <span className={styles.availabilityDot} />
              <div>
                <strong>Representative availability</strong>
                <small>Availability is not connected yet</small>
              </div>
            </div>

            <button
              type="button"
              className={styles.connectButton}
              onClick={() => {
                setFormStatus("");
                setConnectOpen(true);
              }}
            >
              Request a connection <span>↗</span>
            </button>

            <p className={styles.connectFootnote}>
              A connection request is not a confirmed call. The company must
              respond to arrange a conversation.
            </p>

            <div className={styles.panelDivider} />

            <p className={styles.quickQuestionLabel}>OR ASK A QUICK QUESTION</p>
            <form
              className={styles.quickQuestionForm}
              onSubmit={(event) => {
                event.preventDefault();
                setFormStatus("");
                setConnectOpen(true);
              }}
            >
              <label htmlFor="quickQuestion">What would you like to know?</label>
              <textarea
                id="quickQuestion"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about specifications, delivery, pricing..."
                rows={3}
                required
              />
              <button
                type="submit"
                className={styles.quickQuestionButton}
              >
                Send question <span>→</span>
              </button>
            </form>
          </aside>
        </div>
      </section>

      <section className={styles.sessionDetails}>
        <div className={styles.detailsIntro}>
          <p className={styles.sectionKicker}>WHAT YOU CAN DISCOVER</p>
          <h2>
            A conversation
            <br />
            beyond the screen.
          </h2>
        </div>

        <div className={styles.detailItem}>
          <span>01</span>
          <div>
            <h3>Product knowledge</h3>
            <p>
              Ask about features, specifications, materials and applications.
            </p>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span>02</span>
          <div>
            <h3>Business opportunities</h3>
            <p>
              Discuss purchasing, distribution, partnerships and requirements.
            </p>
          </div>
        </div>

        <div className={styles.detailItem}>
          <span>03</span>
          <div>
            <h3>Technical support</h3>
            <p>
              Share your requirements and request guidance from the company
              team.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.enquirySection} id="enquiry">
        <div className={styles.enquiryIntro}>
          <p className={styles.sectionKicker}>LET'S TALK BUSINESS</p>
          <h2>
            Tell us what
            <br />
            <em>you need.</em>
          </h2>
          <p>
            Leave a detailed enquiry for the company. Include your requirements
            so the team can respond with relevant information.
          </p>

          <div className={styles.enquiryAside}>
            <span className={styles.asideMark}>F.</span>
            <p>
              Good conversations begin with the right question.
            </p>
          </div>
        </div>

        <form
          className={styles.enquiryForm}
          onSubmit={(event) =>
            openEmailDraft(event, "enquiry", setFormStatus)
          }
        >
          <div className={styles.formHeading}>
            <span>ENQUIRY FORM / 01</span>
            <span>Fields marked * are required</span>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="enquiryName">Full name *</label>
              <input
                id="enquiryName"
                name="Full name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="enquiryCompany">Company name</label>
              <input
                id="enquiryCompany"
                name="Company"
                autoComplete="organization"
                placeholder="Your company"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="enquiryEmail">Business email *</label>
              <input
                id="enquiryEmail"
                name="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="enquiryPhone">Phone number</label>
              <input
                id="enquiryPhone"
                name="Phone"
                type="tel"
                autoComplete="tel"
                placeholder="Include country code"
              />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor="enquiryType">Enquiry type *</label>
              <select id="enquiryType" name="Enquiry type" required defaultValue="">
                <option value="" disabled>
                  Choose a topic
                </option>
                <option>Product information</option>
                <option>Pricing and quotation</option>
                <option>Technical specifications</option>
                <option>Dealership or distribution</option>
                <option>Partnership opportunity</option>
                <option>Other business enquiry</option>
              </select>
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor="enquiryMessage">Your requirements *</label>
              <textarea
                id="enquiryMessage"
                name="Message"
                rows={5}
                placeholder="Tell us about the product, quantity, application, timeline or question..."
                required
              />
            </div>

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.formFooter}>
            <p>
              Your details will be included in an email draft for you to review.
            </p>
            <button type="submit" className={styles.submitButton}>
              Prepare enquiry <span>↗</span>
            </button>
          </div>

          {formStatus && (
            <p className={styles.formStatus} role="status">
              {formStatus}
            </p>
          )}
        </form>
      </section>

      {connectOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConnectOpen(false);
            }
          }}
        >
          <section
            className={styles.connectModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="connectModalTitle"
          >
            <button
              className={styles.modalClose}
              type="button"
              aria-label="Close connection request"
              onClick={() => setConnectOpen(false)}
            >
              ×
            </button>

            <p className={styles.sectionKicker}>CONNECT WITH THE COMPANY</p>
            <h2 id="connectModalTitle">
              Let's get your
              <br />
              question answered.
            </h2>
            <p className={styles.modalDescription}>
              Share your contact details and preferred way to connect. Your
              email application will open with a prepared request.
            </p>

            <form
              className={styles.modalForm}
              onSubmit={(event) =>
                openEmailDraft(event, "representative", setFormStatus)
              }
            >
              <label htmlFor="connectName">Your name *</label>
              <input
                id="connectName"
                name="Full name"
                autoComplete="name"
                placeholder="Full name"
                required
              />

              <label htmlFor="connectEmail">Email address *</label>
              <input
                id="connectEmail"
                name="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />

              <label htmlFor="connectMethod">Preferred contact method *</label>
              <select
                id="connectMethod"
                name="Preferred contact method"
                defaultValue="Email"
                required
              >
                <option>Email</option>
                <option>Phone call</option>
                <option>Video meeting</option>
              </select>

              <label htmlFor="connectQuestion">Your question</label>
              <textarea
                id="connectQuestion"
                name="Question"
                rows={3}
                defaultValue={question}
                placeholder="What would you like to discuss?"
              />

              <button type="submit" className={styles.submitButton}>
                Prepare connection request <span>↗</span>
              </button>

              {formStatus && (
                <p className={styles.formStatus} role="status">
                  {formStatus}
                </p>
              )}
            </form>
          </section>
        </div>
      )}
    </main>
      <ExhibitionFooter />
    </>
  );
}
