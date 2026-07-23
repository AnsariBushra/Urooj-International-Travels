"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";

interface ParallaxLayerSectionProps {
  eyebrow: string;
  heading: string[];
  body: string;
  imageSrc: string;
  imageAlt: string;
  /** CSS object-position for the image crop, e.g. "50% 30%" */
  imagePosition?: string;
  /** Flip the asymmetric layout: image left/text right vs reverse */
  reverse?: boolean;
  /** Text shown in the floating foreground accent badge */
  floatLabel?: string;
  /** Pastel accent used for the floating badge + ambient glow per-section */
  accent?: "sky" | "rose" | "sage" | "lavender";
}

const ACCENT_VARS: Record<
  NonNullable<ParallaxLayerSectionProps["accent"]>,
  string
> = {
  sky: "var(--color-sky)",
  rose: "var(--color-rose)",
  sage: "var(--color-sage)",
  lavender: "var(--color-lavender)",
};

/**
 * Three independent layers, each bound to scroll progress at a
 * different rate via ScrollTrigger's `scrub`:
 *
 *   - .parallax-bg     moves slowest  (y: -8%)  → distant depth
 *   - .parallax-image  moves at base  (y: -18%) → the "subject"
 *   - .parallax-float  moves fastest  (y: -34%) → foreground accent,
 *                                                  appears closest to camera
 *
 * Because all three tweens share one ScrollTrigger with scrub:true,
 * they stay locked to scroll position/velocity rather than running on
 * independent timers — stop scrolling, and everything stops instantly.
 */
export default function ParallaxLayerSection({
  eyebrow,
  heading,
  body,
  imageSrc,
  imageAlt,
  imagePosition = "center",
  reverse = false,
  floatLabel,
  accent = "sky",
}: ParallaxLayerSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const accentColor = ACCENT_VARS[accent];

  useGsap(sectionRef, (_ctx, el) => {
    const bg = el.querySelector<HTMLElement>(".parallax-bg");
    const image = el.querySelector<HTMLElement>(".parallax-image");
    const floatEl = el.querySelector<HTMLElement>(".parallax-float");

    const trigger = {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    };

    gsap.fromTo(
      bg,
      { yPercent: 8 },
      { yPercent: -8, ease: "none", scrollTrigger: trigger },
    );
    gsap.fromTo(
      image,
      { yPercent: 14 },
      { yPercent: -14, ease: "none", scrollTrigger: trigger },
    );
    gsap.fromTo(
      floatEl,
      { yPercent: 26 },
      { yPercent: -26, ease: "none", scrollTrigger: trigger },
    );
  });

  return (
    <section
      ref={sectionRef}
      className="relative grid min-h-[120vh] grid-cols-1 items-center gap-8 overflow-hidden px-6 py-20 md:grid-cols-12 md:gap-12 md:px-10 md:py-32"
    >
      {/* Ambient background layer — slowest moving, gives depth, tinted per-section */}
      <div
        className="parallax-bg pointer-events-none absolute inset-x-0 -top-1/4 h-[150%] opacity-50 will-change-transform"
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accentColor} 0%, transparent 60%)`,
          }}
        />
      </div>

      <div
        className={`relative z-10 col-span-12 md:col-span-5 ${
          reverse ? "md:order-2 md:col-start-8" : "md:col-start-2"
        }`}
      >
        <span className="label-eyebrow mb-5 block">{eyebrow}</span>
        <SplitTextReveal
          as="h2"
          lines={heading}
          className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-bone md:text-5xl"
        />
        <p className="mt-6 max-w-md text-base leading-relaxed text-mute">
          {body}
        </p>
      </div>

      <div
        className={`parallax-image relative z-10 col-span-12 mx-auto w-[80%] max-w-[320px] aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(217,164,65,0.15)] will-change-transform md:col-span-5 md:w-full md:max-w-none ${
          reverse ? "md:order-1 md:col-start-2" : "md:col-start-7"
        }`}
      >
        <div className="absolute inset-0 scale-110">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-cream/40"
          aria-hidden
        />
      </div>

      {/* Floating foreground accent — fastest layer, reads as nearest to camera */}
      <div
        className={`parallax-float pointer-events-none absolute z-20 hidden will-change-transform md:block ${
          reverse ? "bottom-10 left-[6%]" : "bottom-10 right-[6%]"
        }`}
        aria-hidden
      >
        <div className="glass-panel flex items-center gap-2 rounded-full px-5 py-2.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: accentColor }}
          />
          <span className="label-eyebrow">{floatLabel ?? eyebrow}</span>
        </div>
      </div>
    </section>
  );
}
