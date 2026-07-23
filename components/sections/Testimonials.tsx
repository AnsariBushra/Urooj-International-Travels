"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";
import GeometricPatternBackground from "@/components/three/GeometricPatternBackground";
import { testimonials } from "@/data/testimonials";
import { destinations } from "@/data/destinations";

function destinationNameFor(slug?: string) {
  if (!slug) return null;
  return destinations.find((d) => d.slug === slug)?.name ?? null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-xs ${i < rating ? "text-brass" : "text-line"}`} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate quote text on active change
  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );
  }, [active]);

  useGsap(sectionRef, (_ctx, el) => {
    gsap.from(el.querySelectorAll(".testimonial-fade"), {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  const current = testimonials[active];

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-28 md:px-10 md:py-40">
      {/* Islamic geometric star motif, in cooler tones than the planner's
          version, for subtle visual variety between the two sections */}
      <GeometricPatternBackground colors={[0x9bcdaf, 0xbfe3f0, 0xc6b8e8]} />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="label-eyebrow testimonial-fade mb-5 block">What travellers say</span>
        <SplitTextReveal
          as="h2"
          lines={["In their own words."]}
          className="font-display text-4xl font-normal leading-tight tracking-tight text-bone md:text-5xl"
        />
      </div>

      {/* Active quote */}
      <div className="testimonial-fade relative z-10 mx-auto mt-14 max-w-2xl text-center">
        <p
          ref={quoteRef}
          className="font-display text-xl font-normal italic leading-relaxed text-bone md:text-2xl"
        >
          &ldquo;{current.quote}&rdquo;
        </p>
        <div className="mt-6 flex flex-col items-center gap-2">
          <StarRating rating={current.rating} />
          <span className="text-sm text-bone">{current.name}</span>
          <span className="text-xs text-mute">{current.location}</span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="testimonial-fade relative z-10 mt-10 flex justify-center gap-2.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            data-cursor="link"
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i === active ? "w-6 bg-brass" : "w-1.5 bg-mute/40"
            }`}
          />
        ))}
      </div>

      {/* All cards stacked below — visible on wider screens as supporting context */}
      <div className="testimonial-fade relative z-10 mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(i)}
            data-cursor="link"
            className={`glass-panel rounded-sm p-6 text-left transition-all duration-400 ${
              i === active ? "border-brass/40" : "opacity-60 hover:opacity-80"
            }`}
          >
            <StarRating rating={t.rating} />
            <p className="mt-4 text-sm leading-relaxed text-bone/90 line-clamp-3">{t.quote}</p>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <span className="block text-sm text-bone">{t.name}</span>
                <span className="block text-xs text-mute">{t.location}</span>
              </div>
              {t.destinationSlug && (
                <span className="label-eyebrow">{destinationNameFor(t.destinationSlug)}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
