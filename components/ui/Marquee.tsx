"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import { useLenis } from "@/components/animation/LenisContext";

interface MarqueeProps {
  words: string[];
  /** Base speed, seconds for one full loop of a single track copy */
  duration?: number;
  className?: string;
  /** Use light text + gold dot for dark backgrounds (e.g. the footer) */
  dark?: boolean;
}

/**
 * Seamless infinite marquee: renders the word list twice back-to-back
 * inside a flex track, then animates the track from x:0% to x:-50% on
 * an infinite repeat. Because both halves are identical, the loop
 * point is invisible — at -50% the second copy is exactly where the
 * first one started.
 *
 * Speed is gently modulated by live Lenis scroll velocity (read each
 * frame via gsap.ticker) so the marquee feels physically connected to
 * the page's motion rather than running on a flat, disconnected timer.
 */
export default function Marquee({ words, duration = 22, className = "", dark = false }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGsap(trackRef, (_ctx, el) => {
    const tween = gsap.to(el, {
      xPercent: -50,
      duration,
      ease: "none",
      repeat: -1,
    });

    const tickerFn = () => {
      if (!lenis) return;
      // Lenis velocity is typically small (~0–3); map it to a gentle
      // timescale boost so fast scrolling speeds the loop up slightly.
      const velocity = Math.abs(lenis.velocity ?? 0);
      const targetTimescale = gsap.utils.clamp(0.8, 2.2, 1 + velocity * 0.06);
      tween.timeScale(gsap.utils.interpolate(tween.timeScale(), targetTimescale, 0.08));
    };

    gsap.ticker.add(tickerFn);

    return () => {
      gsap.ticker.remove(tickerFn);
      tween.kill();
    };
  });

  const renderTrack = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-10 pr-10">
      {words.map((word, i) => (
        <span key={`${key}-${i}`} className="flex items-center gap-10">
          <span
            className={`font-display text-[clamp(2.5rem,8vw,7rem)] font-normal leading-none tracking-tight ${
              dark ? "text-cream" : "text-bone"
            }`}
          >
            {word}
          </span>
          <span className="h-2 w-2 rounded-full bg-gold-bright" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {renderTrack("a")}
        {renderTrack("b")}
      </div>
    </div>
  );
}
