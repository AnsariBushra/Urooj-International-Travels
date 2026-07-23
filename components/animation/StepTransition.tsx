"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { gsap } from "@/lib/gsap";

interface StepTransitionProps {
  /** Changing this key triggers the transition (typically the step index) */
  stepKey: number;
  /** 1 = forward (next), -1 = backward (back button) */
  direction: 1 | -1;
  children: React.ReactNode;
}

/**
 * Cross-fades + slides between step content without unmounting the
 * outgoing step mid-transition (which would otherwise cause a harsh
 * cut). On stepKey change: the previous content slides out and fades,
 * then the new content is rendered and slides in from the opposite
 * side — direction-aware so "Back" visually reverses "Next" rather
 * than reusing the same animation for both.
 *
 * IMPORTANT: children must stay live between transitions. An earlier
 * version snapshotted `children` into state only on stepKey change,
 * which froze whatever was rendered at mount time — any interaction
 * inside the step (selecting a package, typing in a field) updated
 * the real form state but never re-rendered visibly, because this
 * wrapper kept showing the stale snapshot. Fix: render `children`
 * directly while idle; only swap to the transient snapshot+animate
 * dance during the actual step-change window.
 */
export default function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [frozenChildren, setFrozenChildren] = useState<React.ReactNode>(null);
  const prevStepKey = useRef(stepKey);

  useLayoutEffect(() => {
    if (prevStepKey.current === stepKey) return;
    prevStepKey.current = stepKey;

    const el = containerRef.current;
    if (!el) return;

    const exitX = direction === 1 ? -32 : 32;
    const enterX = direction === 1 ? 32 : -32;

    // Freeze the OUTGOING step's content for the exit animation only —
    // this is the one moment a snapshot is correct, since we're
    // intentionally showing what's leaving, not what's current.
    setFrozenChildren(children);
    setIsTransitioning(true);

    gsap.to(el, {
      x: exitX,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        // Hand control back to live children for the enter animation
        // and beyond, so any in-step interaction immediately reflects.
        setIsTransitioning(false);
        gsap.fromTo(
          el,
          { x: enterX, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  return <div ref={containerRef}>{isTransitioning ? frozenChildren : children}</div>;
}
