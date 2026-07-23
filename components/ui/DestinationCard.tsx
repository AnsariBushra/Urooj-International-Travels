"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import { Destination } from "@/data/types";

interface DestinationCardProps {
  destination: Destination;
  /** Controls the card's height in the asymmetric grid rhythm */
  size: "tall" | "medium" | "short";
  /** Optional vertical offset (px) applied via style, for the irregular stagger */
  offset?: number;
}

const sizeToAspect: Record<DestinationCardProps["size"], string> = {
  tall: "aspect-[3/4.4]",
  medium: "aspect-[3/3.6]",
  short: "aspect-[3/2.6]",
};

function formatPrice(destination: Destination) {
  if (destination.priceFrom === null) return "Price on request";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: destination.currency,
    maximumFractionDigits: 0,
  });
  return `From ${formatter.format(destination.priceFrom)}`;
}

export default function DestinationCard({ destination, size, offset = 0 }: DestinationCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Gentle scroll-linked parallax: the image inside the card drifts
  // a little slower than the page scroll, independent of the hover
  // scale tween below (GSAP handles both on the same element fine
  // since one animates `y` and the other `scale`).
  useGsap(cardRef, (_ctx, el) => {
    const img = el.querySelector<HTMLElement>(".card-img");
    gsap.fromTo(
      img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  const handleEnter = () => {
    gsap.to(imageRef.current, { scale: 1.1, duration: 0.9, ease: "power3.out" });
    // On hover, everything except the always-visible price chip fades
    // and lifts slightly out — leaving just the photo, as requested.
    gsap.to(fadeRef.current, { opacity: 0, y: 8, duration: 0.4, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.9, ease: "power3.out" });
    gsap.to(fadeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <a
      href="#plan"
      ref={cardRef}
      data-cursor="view"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ marginTop: offset }}
      className={`group relative block overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(217,164,65,0.12)] ${sizeToAspect[size]}`}
    >
      <div ref={imageRef} className="card-img absolute inset-0 will-change-transform">
        <Image
          src={destination.gridImage.src}
          alt={destination.gridImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
          style={{ objectPosition: destination.gridImage.focalPoint ?? "center" }}
        />
      </div>

      {/* Everything that hides on hover: gradient, region/name, tagline.
          Grouped in one wrapper so a single tween fades the lot. */}
      <div ref={fadeRef} className="absolute inset-0">
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="label-eyebrow-dark mb-1.5 block">{destination.region}</span>
          <h3 className="font-display text-2xl font-normal text-cream md:text-3xl">{destination.name}</h3>
        </div>
      </div>

      {/* Price chip — always visible, never fades, sits above the image
          at all times (including on hover) per the brief. */}
      <div className="absolute right-5 top-5 z-10">
        <span className="glass-panel inline-block rounded-full px-3.5 py-1.5 text-xs text-ink/85 shadow-sm">
          {formatPrice(destination)}
        </span>
      </div>
      {destination.durationDays > 0 && (
        <div className="absolute bottom-5 right-5 z-10">
          <span className="text-xs text-cream/80 drop-shadow">{destination.durationDays} days</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cream/0 transition-colors duration-500 group-hover:border-cream/30" aria-hidden />
    </a>
  );
}
