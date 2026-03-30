import Image from "next/image";
import type { AboutRow } from "@/app/types";

export default function About({ data }: { data: AboutRow | null }) {
  if (!data) return null;

  return (
    <section
      id="about"
      className="py-24 px-6 max-w-5xl mx-auto border-t border-black/[0.06]"
    >
      <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
        <div>
          <h2 className="text-xs tracking-widest uppercase text-muted mb-8">
            About
          </h2>
          <div className="space-y-5">
            {data.bio.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-base sm:text-lg leading-relaxed text-foreground/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {data.avatarUrl && (
          <div className="w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden border border-black/[0.08] mx-auto md:mx-0">
            <Image
              src={data.avatarUrl}
              alt="Anh Bui"
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
