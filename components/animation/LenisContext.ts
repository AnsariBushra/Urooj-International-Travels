"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export interface LenisContextValue {
  lenis: Lenis | null;
}

export const LenisContext = createContext<LenisContextValue>({ lenis: null });

/**
 * Read the active Lenis instance from anywhere below SmoothScrollProvider.
 * Useful for e.g. scroll-to-section CTAs, or reading `lenis.velocity`
 * to drive velocity-reactive effects (skew on parallax layers, etc).
 */
export function useLenis() {
  return useContext(LenisContext).lenis;
}
