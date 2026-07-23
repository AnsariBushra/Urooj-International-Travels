"use client";

import { useEffect, useRef, RefObject } from "react";
import { gsap, registerGsap } from "./gsap";

type ContextCallback = (context: gsap.Context, scope: HTMLElement) => void;

/**
 * Scopes a GSAP animation (and any ScrollTriggers it creates) to a DOM
 * node, and guarantees teardown on unmount. This is the pattern every
 * section component should use instead of calling gsap.* directly in
 * a bare useEffect — without scoping, ScrollTriggers leak across route
 * changes and Fast Refresh, which silently breaks pinning further down
 * the page.
 *
 * Usage:
 *   const scope = useRef<HTMLDivElement>(null);
 *   useGsap(scope, (ctx, el) => {
 *     gsap.from(el.querySelector(".title"), { y: 40, opacity: 0 });
 *   }, [dependency]);
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  scopeRef: RefObject<T | null>,
  callback: ContextCallback,
  deps: React.DependencyList = []
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    registerGsap();
    if (!scopeRef.current) return;

    ctxRef.current = gsap.context(() => {
      callback(ctxRef.current as gsap.Context, scopeRef.current as T);
    }, scopeRef.current);

    return () => {
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
