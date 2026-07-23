"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import { useLenis } from "@/components/animation/LenisContext";
import Magnetic from "@/components/animation/Magnetic";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Packages", href: "#destinations" },
  { label: "Guides", href: "#journal" },
  { label: "Plan a trip", href: "#plan" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  // Entrance animation on mount
  useGsap(navRef, (_ctx, el) => {
    gsap.from(el, {
      y: -20,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.3,
    });
  });

  // Glass background transitions in once user scrolls past 80px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu open/close animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (menuOpen) {
      gsap.fromTo(
        menu,
        { yPercent: -4, opacity: 0, pointerEvents: "none" },
        { yPercent: 0, opacity: 1, pointerEvents: "auto", duration: 0.45, ease: "power3.out" }
      );
    } else {
      gsap.to(menu, { opacity: 0, pointerEvents: "none", duration: 0.25, ease: "power2.in" });
    }
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (!lenis || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (target) lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.6 });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-10 md:py-5 ${
          scrolled ? "glass-panel border-b" : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        {/* Logo / wordmark — light variant at rest (over hero photo), dark once scrolled past it */}
        <div ref={logoRef}>
          <Magnetic as="a" href="/" data-cursor="link" className="block">
            <span style={scrolled ? undefined : { filter: "drop-shadow(0 1px 10px rgba(0,0,0,0.35))" }}>
              <Logo variant={scrolled ? "dark" : "light"} />
            </span>
          </Magnetic>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Magnetic
              key={link.label}
              as="button"
              onClick={() => scrollTo(link.href)}
              data-cursor="link"
              className={`label-eyebrow transition-colors ${
                scrolled ? "text-mute hover:text-bone" : "text-cream/95 hover:text-cream"
              }`}
              style={scrolled ? undefined : { textShadow: "0 1px 10px rgba(0,0,0,0.4)" }}
            >
              {link.label}
            </Magnetic>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Magnetic
            as="button"
            onClick={() => scrollTo("#plan")}
            data-cursor="link"
            className={`rounded-full border px-5 py-2 text-xs tracking-[0.14em] uppercase backdrop-blur-sm transition-colors ${
              scrolled
                ? "border-gold/50 text-gold hover:bg-gold/10"
                : "border-cream/60 bg-ink/10 text-cream hover:bg-cream/10"
            }`}
          >
            Book consultation
          </Magnetic>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="relative flex h-8 w-8 flex-col items-end justify-center gap-1.5 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className={`h-px transition-all duration-300 ${scrolled ? "bg-bone" : "bg-cream"} ${
              menuOpen ? "w-5 -translate-y-px rotate-45 translate-x-0" : "w-5"
            }`}
          />
          <span
            className={`h-px transition-all duration-300 ${scrolled ? "bg-bone" : "bg-cream"} ${
              menuOpen ? "w-5 translate-y-px -rotate-45" : "w-3"
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-x-0 top-[60px] z-40 border-b border-line px-6 py-8 opacity-0 backdrop-blur-2xl md:hidden"
        style={{ pointerEvents: "none", background: "rgba(255, 251, 245, 0.97)" }}
      >
        <div className="flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="text-left font-display text-2xl text-bone"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => scrollTo("#plan")}
            className="mt-4 w-fit rounded-full border border-gold/50 px-5 py-2.5 text-xs tracking-[0.14em] uppercase text-gold"
          >
            Book consultation
          </button>
        </div>
      </div>
    </>
  );
}
