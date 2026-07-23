"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { LenisContext } from "./LenisContext";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Owns the single Lenis instance for the whole app and binds it to GSAP's
 * ticker so ScrollTrigger and Lenis share one synchronized clock.
 *
 * Architecture, in order:
 *  1. Register GSAP plugins once (lib/gsap.ts).
 *  2. Construct Lenis with the easing/duration tuned for a cinematic,
 *     slightly weighted scroll feel (not bouncy, not instant).
 *  3. On every Lenis `scroll` event, tell ScrollTrigger to recompute —
 *     this is what makes pinning/scrubbing track the *smoothed* scroll
 *     position rather than the raw (jumpy) native scrollTop.
 *  4. Drive Lenis's internal raf() from gsap.ticker instead of a second
 *     requestAnimationFrame loop, and turn off GSAP's lag smoothing
 *     (which fights Lenis's own smoothing during long scroll jumps).
 *  5. Tear everything down on unmount — important for fast refresh in
 *     dev and for any future route groups that might remount this.
 */
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    registerGsap();

    const lenisInstance = new Lenis({
      duration: 1.2, // higher = heavier, more cinematic momentum
      easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)), // expo-out, matches --ease-cinematic
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      syncTouch: false, // keep native touch feel on mobile; smoothing is desktop's signature
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // 3. Keep ScrollTrigger in sync with Lenis's smoothed scroll value.
    lenisInstance.on("scroll", ScrollTrigger.update);

    // 4. Single shared clock: GSAP ticker drives Lenis, not its own rAF.
    const tickerCallback = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once layout/fonts settle.
    const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      clearTimeout(refreshTimeout);
      gsap.ticker.remove(tickerCallback);
      lenisInstance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>;
}
