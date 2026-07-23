"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";
import { instagramPosts } from "@/data/destinations";
import { brand } from "@/data/brand";

const ACCENTS = [
  "var(--color-sky)",
  "var(--color-rose)",
  "var(--color-sage)",
  "var(--color-lavender)",
  "var(--color-gold)",
];

export default function InstagramShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsap(sectionRef, (_ctx, el) => {
    const track = trackRef.current;
    if (!track) return;

    const setScroll = () => {
      const distance = track.scrollWidth - track.clientWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    };

    setScroll();
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 md:py-28"
    >
      <div className="mb-14 px-6 md:px-10">
        <span className="label-eyebrow mb-5 block">
          From @{brand.instagram.split("/").filter(Boolean).pop()}
        </span>
        <SplitTextReveal
          as="h2"
          lines={["Straight from our", "Instagram feed."]}
          className="font-display text-4xl font-normal leading-[1.15] tracking-tight text-bone md:text-5xl"
        />
      </div>

      <div
        ref={trackRef}
        className="flex gap-8 px-6 pb-10 will-change-transform md:px-10 "
      >
        {instagramPosts.map((post, i) => (
          <div
            key={post.slug}
            className="relative flex-none overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(217,164,65,0.18)]"
            style={{
              width: "min(78vw, 340px)",
              background: ACCENTS[i % ACCENTS.length],
              padding: "16px 16px 20px",
            }}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream ">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                sizes="(max-width: 768px) 80vw, 340px"
                className="object-contain p-2"
              />
            </div>
            <p className="px-1 pb-1 pt-4 text-sm leading-snug text-ink/80">
              {post.caption}
            </p>
          </div>
        ))}

        {/* Trailing CTA card, same track so it scrolls in as the last "post" */}
        <a
          href={brand.instagram}
          target="_blank"
          rel="noreferrer"
          data-cursor="link"
          className="group relative flex flex-none flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-gold/30 text-center shadow-[0_20px_50px_rgba(217,164,65,0.12)]"
          style={{ width: "min(78vw, 340px)", background: "var(--color-sand)" }}
        >
          <span className="font-display text-2xl text-bone">Follow along</span>
          <span className="text-sm text-mute">@uroojinternationall</span>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2 text-xs uppercase tracking-[0.14em] text-gold transition-colors group-hover:border-gold group-hover:bg-gold/10">
            Open Instagram
          </span>
        </a>
      </div>
    </section>
  );
}
