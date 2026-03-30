import Image from "next/image";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import type { AboutRow } from "@/app/types";

export default function About({ data }: { data: AboutRow | null }) {
  if (!data) return null;

  return (
    <section id="about" className="py-28 px-6 max-w-5xl mx-auto overflow-hidden relative">
      {/* Ghost numeral */}
      <div
        className="absolute right-[-2%] top-1/4 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-display font-black text-[clamp(10rem,22vw,20rem)] leading-none text-foreground opacity-[0.03] block">
          01
        </span>
      </div>

      <ScrollReveal>
        {/* Section label */}
        <div className="flex items-center gap-3 mb-14">
          <span className="font-display text-xs font-bold text-accent tracking-wider">01</span>
          <span className="h-px w-8 bg-accent/40" aria-hidden="true" />
          <h2 className="text-xs tracking-[0.18em] uppercase text-muted font-medium">About</h2>
        </div>
        {/* Drawn accent rule */}
        <div
          className="w-12 h-px bg-accent/30 origin-left mt-3"
          aria-hidden="true"
          style={{ animation: "drawLine 0.5s ease 0.14s both" }}
        />
      </ScrollReveal>

      <div className="grid md:grid-cols-[1fr_200px] gap-12 md:gap-16 items-start">
        <ScrollReveal delay={60}>
          <div className="space-y-5">
            {data.bio.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-base sm:text-[1.125rem] leading-[1.8] text-foreground/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>

        {data.avatarUrl && (
          <ScrollReveal delay={120} className="mx-auto md:mx-0">
            <div className="relative w-48 h-48 md:w-full md:h-auto md:aspect-square rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/[0.07]">
              <Image
                src={data.avatarUrl}
                alt="Anh Bui"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
