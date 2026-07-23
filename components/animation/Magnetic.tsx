"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** How strongly the element follows the cursor, 0–1 */
  strength?: number;
  as?: "button" | "div" | "a";
  href?: string;
  onClick?: () => void;
  /**
   * Arbitrary data-* attributes (most commonly data-cursor, read by
   * CustomCursor via closest("[data-cursor]")) and any other native
   * attribute the caller wants passed straight through to the
   * underlying element.
   */
  [dataAttr: `data-${string}`]: string | undefined;
}

/**
 * Wraps any CTA/link and applies the "magnet" hover effect: the element
 * translates toward the cursor within its own bounding box, then snaps
 * back with an elastic ease on mouse leave. Pairs naturally with
 * CustomCursor, which independently grows/labels itself on the same
 * hover target via the data-cursor attribute.
 */
export default function Magnetic({
  children,
  className = "",
  style,
  strength = 0.4,
  as = "button",
  href,
  onClick,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    gsap.to(el, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
  };

  // Magnetic needs *some* display value to size correctly for the
  // translate-toward-cursor effect, so it defaults to inline-block —
  // but only when the caller hasn't already specified their own
  // display utility (block, flex, grid, etc). Tailwind's generated
  // CSS gives every single-purpose utility class equal specificity,
  // so cascade order — not HTML class order — decides which display
  // wins; unconditionally prepending "inline-block" would silently
  // override a caller's "block" or "flex" regardless of where it
  // appears in the string. Detect and skip the default in that case.
  const hasOwnDisplay = /(?:^|\s)(block|inline-block|inline|flex|inline-flex|grid|inline-grid|contents|hidden)(?:\s|$)/.test(
    className
  );
  const sharedProps = {
    ref: ref as never,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `${hasOwnDisplay ? "" : "inline-block "}will-change-transform ${className}`,
    style,
    onClick,
    ...rest,
  };

  if (as === "a" && href) {
    return (
      <a href={href} {...sharedProps}>
        {children}
      </a>
    );
  }

  if (as === "div") {
    return <div {...sharedProps}>{children}</div>;
  }

  return <button {...sharedProps}>{children}</button>;
}
