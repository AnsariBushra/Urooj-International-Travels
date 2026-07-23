"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";
import Magnetic from "@/components/animation/Magnetic";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGsap(sectionRef, (_ctx, el) => {
    const photoLayer = el.querySelector<HTMLElement>(".hero-photo-layer");
    const wash = el.querySelector<HTMLElement>(".hero-wash");
    const copy = el.querySelector<HTMLElement>(".hero-copy");
    const scrollHint = el.querySelector<HTMLElement>(".hero-scroll-hint");

    gsap.set(photoLayer, { scale: 1, filter: "brightness(1) saturate(1)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.to(photoLayer, { scale: 1.6, ease: "none", duration: 1 }, 0)
      .to(wash, { opacity: 1, ease: "none", duration: 1 }, 0.15)
      .to(copy, { y: -80, opacity: 0, ease: "power1.in", duration: 0.6 }, 0)
      .to(scrollHint, { opacity: 0, duration: 0.25 }, 0);

    return () => {
      tl.kill();
    };
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero"
    >
      <div
        className="hero-wash absolute inset-0 z-10 opacity-0"
        style={{
          background:
            "linear-gradient(160deg, var(--color-sky) 0%, var(--color-rose) 45%, var(--color-sand) 100%)",
        }}
        aria-hidden
      />

      <div className="hero-photo-layer absolute inset-0 will-change-transform">
        <Image
          src="/images/hajj/Masjid al haram.jpg"
          alt="Pilgrims around the Kaaba at Masjid al-Haram, Makkah"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 30%" }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(46,42,38,0.15) 0%, rgba(46,42,38,0.05) 35%, rgba(46,42,38,0.55) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute inset-4 z-30 rounded-2xl border border-cream/30 md:inset-4"
        aria-hidden
      />

      <div className="hero-frame-label pointer-events-none absolute left-6 top-24 z-20 hidden md:left-10 md:top-28 md:block">
        <span className="label-eyebrow-dark">Hajj · Umrah · Ziyaratein</span>
      </div>
      <div className="hero-frame-label pointer-events-none absolute right-6 top-24 z-20 hidden text-right md:right-10 md:top-28 md:block">
        <span className="label-eyebrow-dark">All India Services</span>
      </div>

      <div className="hero-copy relative z-30 flex h-full w-full items-center px-6 md:px-10">
        <div className="max-w-2xl pt-10 md:ml-[8%] md:pt-0">
          <span className="label-eyebrow-dark mb-6 block font-extrabold">
            Urooj International
          </span>
          <SplitTextReveal
            as="h1"
            lines={["A sacred journey,", "carefully guided."]}
            className="font-display text-[9.5vw] font-normal leading-[1.05] tracking-tight text-cream sm:text-[8vw] md:text-[5.2vw] md:leading-[0.95]"
            delay={0.3}
          />
          <p className="mt-8 max-w-md text-base leading-relaxed text-cream/85 md:text-lg font-extrabold">
            We manage every detail of your Hajj, Umrah and Ziyarat — documents,
            hotels near the Haram, and private transfers — so you can focus
            entirely on your worship.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic
              as="a"
              href="#destinations"
              data-cursor="view"
              className="group relative inline-flex items-center gap-3 rounded-full border border-cream/40 bg-cream/10 px-7 py-3.5 text-sm tracking-wide text-cream backdrop-blur-sm transition-colors hover:border-gold-bright hover:bg-cream/20"
            >
              <span>Explore Packages</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold-bright transition-transform group-hover:scale-150" />
            </Magnetic>
            <Magnetic
              as="a"
              href="tel:+919971337283"
              data-cursor="link"
              className="inline-flex items-center gap-2 text-sm tracking-wide bg-gold-bright rounded-full p-4 text-gray-900 underline-offset-4 hover:underline font-extrabold"
            >
              Book now: 9971337283
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center">
        <span className="label-eyebrow-dark">Scroll</span>
        <div className="mx-auto mt-2 h-8 w-px animate-pulse bg-cream/50" />
      </div>
    </section>
  );
}
