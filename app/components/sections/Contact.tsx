import type { ContactRow } from "@/app/types";

function ContactLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
      className="group flex items-center gap-3 text-sm text-muted hover:text-foreground transition-colors"
    >
      <span className="w-9 h-9 rounded-xl bg-surface border border-black/[0.08] flex items-center justify-center group-hover:border-black/20 transition-colors">
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1 5.5l7 4.5 7-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Contact({ data }: { data: ContactRow | null }) {
  if (!data) return null;

  return (
    <section
      id="contact"
      className="py-24 px-6 max-w-5xl mx-auto border-t border-black/[0.06]"
    >
      <div className="max-w-lg">
        <h2 className="text-xs tracking-widest uppercase text-muted mb-4">
          Contact
        </h2>
        <p className="text-2xl font-semibold text-foreground mb-10 leading-snug">
          Let&apos;s work together.
        </p>

        <div className="flex flex-col gap-4">
          <ContactLink
            href={`mailto:${data.email}`}
            label={data.email}
            icon={<EmailIcon />}
          />
          {data.githubUrl && (
            <ContactLink
              href={data.githubUrl}
              label={data.githubUrl.replace("https://", "")}
              icon={<GithubIcon />}
            />
          )}
          {data.linkedinUrl && (
            <ContactLink
              href={data.linkedinUrl}
              label={data.linkedinUrl.replace("https://", "")}
              icon={<LinkedinIcon />}
            />
          )}
          {data.twitterUrl && (
            <ContactLink
              href={data.twitterUrl}
              label={data.twitterUrl.replace("https://", "")}
              icon={<TwitterIcon />}
            />
          )}
        </div>
      </div>

      <footer className="mt-24 pt-8 border-t border-black/[0.06]">
        <p className="text-xs text-muted/60">
          © {new Date().getFullYear()} Anh Bui. Built with Next.js and Tailwind CSS.
        </p>
      </footer>
    </section>
  );
}
