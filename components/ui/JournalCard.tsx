"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { JournalEntry } from "@/data/types";

interface JournalCardProps {
  entry: JournalEntry;
  /** Card width in px — varied per card to break uniform-grid rhythm */
  width: number;
  /** Vertical offset in px — creates the masonry stagger within the track */
  offset: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export default function JournalCard({ entry, width, offset }: JournalCardProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(imageRef.current, { scale: 1.08, duration: 0.8, ease: "power3.out" });
  };
  const handleLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.8, ease: "power3.out" });
  };

  return (
    <a
      href="#plan"
      data-cursor="view"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ width, marginTop: offset }}
      className="group block flex-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(217,164,65,0.1)]">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={entry.coverImage.src}
            alt={entry.coverImage.alt}
            fill
            sizes="(max-width: 768px) 80vw, 30vw"
            className="object-cover"
            style={{ objectPosition: entry.coverImage.focalPoint ?? "center" }}
          />
        </div>
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "linear-gradient(160deg, rgba(191,227,240,0.25), rgba(220,210,240,0.25))" }}
          aria-hidden
        />
        <div className="absolute inset-0 rounded-2xl border border-cream/40 transition-colors duration-500 group-hover:border-gold-bright/60" aria-hidden />
        <div className="absolute left-4 top-4">
          <span className="glass-panel rounded-full px-3 py-1.5 text-[0.65rem] tracking-[0.14em] uppercase text-ink/80">
            {entry.category}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-normal leading-snug text-bone md:text-2xl">{entry.title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-mute">{entry.excerpt}</p>
      <div className="mt-4 flex items-center gap-3 text-xs text-mute">
        <span>{formatDate(entry.publishedAt)}</span>
        <span aria-hidden>·</span>
        <span>{entry.readMinutes} min read</span>
      </div>
    </a>
  );
}
