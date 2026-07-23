"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";
import JournalCard from "@/components/ui/JournalCard";
import { journal } from "@/data/testimonials";

/**
 * Per-card width/offset recipe — hand-tuned for masonry asymmetry rather
 * than a repeating pattern. If more journal entries are added later,
 * extend this array; it cycles via modulo so the section never breaks,
 * it just repeats the rhythm.
 */
const CARD_RECIPE = [
  { width: 440, offset: 28 },
  { width: 330, offset: 0 },
  { width: 460, offset: 46 },
  { width: 370, offset: 14 },
];

/**
 * Stacked layout, not overlapping: the heading block sits in normal
 * document flow at the top of the section (its own height, no absolute
 * positioning over the cards), and the horizontally-scrolling carousel
 * sits in its own row strictly below it. Only the carousel row is
 * pinned/scrubbed by ScrollTrigger — the heading is never inside the
 * pinned region, so it can never be covered by a card regardless of
 * viewport height or card height.
 */
export default function HorizontalJournal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsap(sectionRef, (_ctx, _el) => {
    const carousel = carouselRef.current;
    const track = trackRef.current;
    if (!carousel || !track) return;

    const getScrollDistance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: carousel,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });

  return (
    <section
      ref={sectionRef}
      id="journal"
      className="relative w-full overflow-hidden pt-24 md:pt-28"
      style={{ background: "linear-gradient(135deg, var(--color-lavender) 0%, var(--color-cream) 55%)" }}
    >
      {/* Heading — normal flow, fully above and outside the pinned carousel */}
      <div className="mb-14 px-6 md:px-10">
        <span className="label-eyebrow mb-4 block">Guides & Field Notes</span>
        <SplitTextReveal
          as="h2"
          lines={["Prepare for your journey,", "before you go."]}
          className="font-display text-3xl font-normal leading-[1.2] tracking-tight text-bone md:text-4xl"
        />
        <span className="label-eyebrow mt-4 hidden md:block">Scroll horizontally →</span>
      </div>

      {/* Carousel — its own pinned region, sized to the viewport so the
          ScrollTrigger pin has a fixed height to hold while scrubbing. */}
      <div ref={carouselRef} className="relative h-screen w-full">
        <div className="flex h-full items-center pl-[8%]">
          <div ref={trackRef} className="flex items-start gap-8 will-change-transform pr-[12vw]">
            {journal.map((entry, i) => {
              const recipe = CARD_RECIPE[i % CARD_RECIPE.length];
              return <JournalCard key={entry.slug} entry={entry} width={recipe.width} offset={recipe.offset} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
