"use client";

interface LogoProps {
  /** "light" for use over photos (hero), "dark" for use over the cream theme */
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Urooj International's mark: a minimal dome-and-crescent silhouette
 * inside a circle, echoing the brand's Instagram icon (a stylised
 * mosque dome topped with a crescent) but redrawn as clean geometric
 * SVG paths so it scales crisply at any size instead of relying on a
 * raster screenshot. "Urooj" (عروج) means "ascension" — the upward
 * sweeping arc beneath the dome is a deliberate nod to that meaning,
 * not just decoration.
 *
 * Paired with a bolder wordmark + small tracked subtitle, replacing
 * the old plain-text logo that read as too light/low-weight in the
 * navbar.
 */
export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const ink = variant === "light" ? "#FFFBF5" : "#2E2A26";
  const gold = "#D9A441";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="flex-shrink-0"
      >
        <circle cx="20" cy="20" r="19" stroke={gold} strokeWidth="1.2" opacity="0.55" />
        {/* Dome */}
        <path
          d="M20 9C24.5 9 28 13.5 28 18.5H12C12 13.5 15.5 9 20 9Z"
          fill={gold}
        />
        {/* Minaret base / building line */}
        <rect x="12" y="18.5" width="16" height="2.4" fill={gold} />
        {/* Crescent atop the dome */}
        <path
          d="M20 3.6C21.6 3.6 23 4.95 23 6.6C23 8.25 21.6 9.6 20 9.6C19.7 9.6 19.4 9.55 19.15 9.47C20.05 9.05 20.65 8.05 20.65 6.9C20.65 5.55 19.85 4.4 18.75 4.0C19.15 3.75 19.55 3.6 20 3.6Z"
          fill={gold}
        />
        {/* Upward ascension arc — the "Urooj" (ascension) motif */}
        <path
          d="M10 29C13 24 17 22.5 20 22.5C23 22.5 27 24 30 29"
          stroke={ink}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path d="M9 32.5C12.5 27.5 16.7 25.8 20 25.8C23.3 25.8 27.5 27.5 31 32.5" stroke={ink} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.45" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className="font-display text-xl font-semibold tracking-tight md:text-2xl"
          style={{ color: ink }}
        >
          Urooj
        </span>
        <span
          className="mt-0.5 text-[0.55rem] font-medium tracking-[0.28em] uppercase"
          style={{ color: variant === "light" ? "rgba(255,251,245,0.75)" : "var(--color-clay)" }}
        >
          International
        </span>
      </span>
    </span>
  );
}
