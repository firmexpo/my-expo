const socials = [
  {
    href: "https://www.linkedin.com/company/firmexpo/",
    label: "LinkedIn",
    path: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
    filled: true,
  },
  {
    href: "https://www.instagram.com/firmexpo",
    label: "Instagram",
    path: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    href: "https://x.com/thefirmexpo",
    label: "X (Twitter)",
    path: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
    filled: true,
  },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="text-ink-faint transition-colors hover:text-signal"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill={s.filled ? "currentColor" : "none"}
            stroke={s.filled ? "none" : "currentColor"}
            strokeWidth={s.filled ? undefined : "1.6"}
          >
            {s.path}
          </svg>
        </a>
      ))}
    </div>
  );
}
