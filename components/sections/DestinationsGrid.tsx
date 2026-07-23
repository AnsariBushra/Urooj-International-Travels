"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";
import DestinationCard from "@/components/ui/DestinationCard";
import { destinations } from "@/data/destinations";

/**
 * Layout logic for the irregular editorial grid:
 *
 * Desktop (12-col):
 *   col 1–2   empty margin   (asymmetry — grid doesn't start flush left)
 *   col 3–6   Hajj, tall, offset down 40px
 *   col 7–9   Umrah, medium, flush top
 *   col 10–12 Madinah Ziyarat, short, offset down 90px
 *   ── second row ──
 *   col 1–2   empty margin continues
 *   col 3–5   Private Logistics, medium
 *   col 6–9   Guided Pilgrimage Care, tall (wider span, reads as the row's anchor)
 *
 * The offsets and span widths are hand-set per item rather than a
 * repeating pattern — that's what keeps it from reading as a
 * templated 3-up grid with alternating card heights.
 */
export default function DestinationsGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hajj, umrah, madinahZiyarat, logistics, guidedCare] = destinations;

  useGsap(sectionRef, (_ctx, el) => {
    const cards = el.querySelectorAll<HTMLElement>(".destination-card-wrap");
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });
  });

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="relative px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7 md:col-start-3">
          <span className="label-eyebrow mb-5 block">Our Services</span>
          <SplitTextReveal
            as="h2"
            lines={["Guided pilgrimage care,", "all held together."]}
            className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-bone md:text-5xl"
          />
        </div>
        <div className="md:col-span-3 md:col-start-10">
          <p className="text-sm leading-relaxed text-mute">
            Documents, hotels, transfers, and rituals — every part of your Hajj
            and Umrah journey, managed end-to-end by our team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12">
        <div className="destination-card-wrap md:col-span-4 md:col-start-3">
          <DestinationCard destination={hajj} size="tall" offset={40} />
        </div>
        <div className="destination-card-wrap md:col-span-3 md:col-start-7">
          <DestinationCard destination={umrah} size="medium" />
        </div>
        <div className="destination-card-wrap md:col-span-3 md:col-start-10">
          <DestinationCard
            destination={madinahZiyarat}
            size="short"
            offset={90}
          />
        </div>

        <div className="destination-card-wrap md:col-span-3 md:col-start-3 ">
          <DestinationCard destination={logistics} size="medium" offset={20} />
        </div>
        <div className="destination-card-wrap md:col-span-4 md:col-start-6">
          <DestinationCard destination={guidedCare} size="tall" />
        </div>
      </div>
    </section>
  );
}
