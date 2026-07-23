"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A single cursor instance mounted once at the app root. Any element
 * anywhere can opt it into a morphed state by adding:
 *
 *   data-cursor="view"   → grows, shows "VIEW"
 *   data-cursor="drag"   → grows, shows "DRAG"
 *   data-cursor="link"   → small ring-only state for ordinary links
 *
 * The cursor itself stays generic — it just reads whatever string is
 * in data-cursor and renders it, so new hover states (e.g. "PLAY",
 * "EXPLORE") can be added in markup without touching this file.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const xTo = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power3.out" });
    const dotXTo = gsap.quickTo(dotRef.current, "x", { duration: 0.15, ease: "power3.out" });
    const dotYTo = gsap.quickTo(dotRef.current, "y", { duration: 0.15, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      if (!target) {
        setLabel(null);
        gsap.to(ringRef.current, { scale: 1, duration: 0.4, ease: "power3.out" });
        return;
      }
      const cursorType = target.dataset.cursor;
      setLabel(cursorType && cursorType !== "link" ? cursorType.toUpperCase() : null);
      gsap.to(ringRef.current, {
        scale: cursorType === "link" ? 1.4 : 2.6,
        duration: 0.45,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass mix-blend-difference"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[199] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/40 mix-blend-difference"
        aria-hidden
      >
        <span
          ref={labelRef}
          className="text-[0.55rem] font-sans font-medium tracking-[0.2em] text-bone opacity-0 transition-opacity duration-200"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
    </>
  );
}
