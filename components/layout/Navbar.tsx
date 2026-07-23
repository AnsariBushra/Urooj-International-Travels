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
  { label: "Plan a Trip", href: "#plan" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const lenis = useLenis();

  useGsap(navRef, (_ctx, el) => {
    gsap.from(el, {
      y: -24,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.25,
    });
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (menuOpen) {
      gsap.set(menu, {
        xPercent: 100,
        visibility: "visible",
      });

      gsap.to(menu, {
        xPercent: 0,
        duration: 0.55,
        ease: "power4.out",
      });
    } else {
      gsap.to(menu, {
        xPercent: 100,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(menu, {
            visibility: "hidden",
          });
        },
      });
    }
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);

    if (!lenis || !href.startsWith("#")) return;

    const target = document.querySelector(href);

    if (target) {
      lenis.scrollTo(target as HTMLElement, {
        offset: -80,
        duration: 1.5,
      });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 md:px-10 md:py-5 ${
          menuOpen
            ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            : scrolled
              ? "glass-panel border-b"
              : "bg-transparent"
        }`}
      >
        <div ref={logoRef}>
          <Magnetic as="a" href="/" data-cursor="link" className="block">
            <span
              style={
                scrolled
                  ? undefined
                  : {
                      filter: "drop-shadow(0 1px 12px rgba(0,0,0,.35))",
                    }
              }
            >
              <Logo variant={scrolled ? "dark" : "light"} />
            </span>
          </Magnetic>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Magnetic
              key={link.label}
              as="button"
              onClick={() => scrollTo(link.href)}
              data-cursor="link"
              className={`label-eyebrow transition-colors ${
                scrolled
                  ? "text-mute hover:text-bone"
                  : "text-cream hover:text-white"
              }`}
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
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.16em] transition-all ${
              scrolled
                ? "border-gold/50 text-gold hover:bg-gold/10"
                : "border-white/60 text-white hover:bg-white/10"
            }`}
          >
            Book Consultation
          </Magnetic>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-8 w-8 flex-col items-end justify-center gap-1.5 md:hidden"
          aria-label="Open Menu"
        >
          <span className={`h-px w-5 ${scrolled ? "bg-bone" : "bg-white"}`} />
          <span className={`h-px w-3 ${scrolled ? "bg-bone" : "bg-white"}`} />
          <span
            className={`h-0.5 w-6 rounded-full ${
              scrolled ? "bg-bone" : "bg-white"
            }`}
          />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 z-[60] invisible h-screen w-[85%] max-w-[340px] md:hidden"
        style={{
          background: "rgba(22,19,15,.96)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(217,164,65,.15)",
        }}
      >
        <div
          className="absolute left-1/2 top-28 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(217,164,65,.25), transparent 70%)",
          }}
        />

        <button
          onClick={() => setMenuOpen(false)}
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
        >
          ✕
        </button>

        <div className="relative flex h-full flex-col justify-center px-10">
          <div className="space-y-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="group block text-left"
              >
                <span className="font-display text-4xl tracking-wide text-[#f8f6f3] transition duration-300 group-hover:text-[#d9a441]">
                  {link.label}
                </span>

                <div className="mt-2 h-px w-0 bg-[#d9a441] transition-all duration-500 group-hover:w-20" />
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo("#plan")}
            className="mt-14 w-fit rounded-full border border-[#d9a441]/50 bg-[#d9a441]/10 px-7 py-3 text-sm uppercase tracking-[0.22em] text-[#d9a441] transition-all duration-300 hover:bg-[#d9a441] hover:text-[#1a1710]"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </>
  );
}
