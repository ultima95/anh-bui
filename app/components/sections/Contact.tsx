import type { JSX } from "react";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { ContactRow } from "@/app/types";

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Contact({ data }: { data: ContactRow | null }) {
  if (!data) return null;

  const socials = [
    data.githubUrl   && { href: data.githubUrl,   label: "GitHub",   Icon: GithubIcon },
    data.linkedinUrl && { href: data.linkedinUrl, label: "LinkedIn", Icon: LinkedinIcon },
    data.twitterUrl  && { href: data.twitterUrl,  label: "Twitter / X", Icon: TwitterIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: () => JSX.Element }[];

  return (
    <section id="contact" className="bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-6 py-32">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-12">
            <span className="font-display text-xs font-bold text-accent tracking-wider">05</span>
            <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
            <span className="text-xs tracking-[0.18em] uppercase text-white/40 font-medium">Contact</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={60}>
          <h2 className="font-display font-black text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight mb-10">
            Let&apos;s work<br />
            <span className="text-accent">together.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <a
            href={`mailto:${data.email}`}
            className="inline-flex items-center gap-3 text-lg sm:text-2xl font-semibold text-white/80 hover:text-white border-b border-white/20 hover:border-white/60 pb-1 transition-all duration-200 cursor-pointer"
          >
            {data.email}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 15L15 3M15 3H7M15 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
        </ScrollReveal>

        {socials.length > 0 && (
          <ScrollReveal delay={160}>
            <div className="flex flex-wrap items-center gap-6 mt-14">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Footer bar */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Anh Bui
          </p>
          <p className="text-xs text-white/25">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </section>
  );
}
