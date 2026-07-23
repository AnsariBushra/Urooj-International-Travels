"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";

interface SplitTextRevealProps {
  /** Each array item renders as its own masked line */
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Stagger between lines, seconds */
  stagger?: number;
  /** Delay before the whole group starts, seconds */
  delay?: number;
  /** Trigger once the element is this far into the viewport */
  start?: string;
}

/**
 * Renders each line inside an overflow-hidden mask, then animates the
 * inner span up from below the mask on scroll-into-view. This is the
 * "text-splitting layout reveal" interaction from the brief — done at
 * the line level (not per-character) for readability and performance;
 * swap the inner loop for per-word spans if a tighter, glyph-level
 * stagger is wanted later.
 */
export default function SplitTextReveal({
  lines,
  as = "h2",
  className = "",
  stagger = 0.09,
  delay = 0,
  start = "top 85%",
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const Tag = as;

  useGsap(
    containerRef,
    (_ctx, el) => {
      const targets = el.querySelectorAll<HTMLElement>(".split-line-inner");

      gsap.set(targets, { yPercent: 110 });

      gsap.to(targets, {
        yPercent: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    },
    [lines.join("|")]
  );

  return (
    <div ref={containerRef}>
      {lines.map((line, i) => (
        <Tag key={i} className={className}>
          <span className="line-mask">
            <span className="split-line-inner inline-block will-change-transform">{line}</span>
          </span>
        </Tag>
      ))}
    </div>
  );
}
