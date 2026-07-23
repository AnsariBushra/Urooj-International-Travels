// ────────────────────────────────────────────────────────────
// Content schema
//
// Every section on the site reads from these shapes instead of
// hardcoding strings or image paths. To go live with real brand
// content (Urooj International's actual destinations, packages,
// photography, testimonials), only the files in /data need to
// change — no component should need editing.
// ────────────────────────────────────────────────────────────

export interface MediaAsset {
  /** Path relative to /public, or a remote URL once a CMS/CDN is wired up */
  src: string;
  alt: string;
  /** Used to size <Image> correctly and avoid layout shift */
  width: number;
  height: number;
  /** Optional low-res base64 blur placeholder */
  blurDataURL?: string;
  /**
   * CSS object-position value (e.g. "50% 20%") used whenever this asset
   * is cropped into a fixed-aspect box (cards, thumbnails, parallax
   * panels). Defaults to "center" when omitted — set this per-image
   * whenever the subject (a dome, minaret, or face) sits off-centre so
   * `object-fit: cover` crops never cut off the meaningful part.
   */
  focalPoint?: string;
}

export interface Destination {
  slug: string;
  name: string;
  /** Country / region shown as a small label */
  region: string;
  /** One-line editorial hook, e.g. "Where the desert meets silence" */
  tagline: string;
  /** Longer copy for the destination's own page */
  description: string;
  heroImage: MediaAsset;
  gridImage: MediaAsset;
  /** Used for masonry / horizontal scroll thumbnails */
  gallery: MediaAsset[];
  /** Starting price, shown on cards. Null if "on request" */
  priceFrom: number | null;
  currency: "INR" | "USD" | "AED";
  durationDays: number;
  /** Featured destinations get priority placement in the grid */
  featured: boolean;
}

export interface Package {
  slug: string;
  destinationSlug: string;
  title: string;
  summary: string;
  priceFrom: number;
  currency: "INR" | "USD" | "AED";
  durationDays: number;
  inclusions: string[];
  coverImage: MediaAsset;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  destinationSlug?: string;
  avatar?: MediaAsset;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: MediaAsset;
  category: string;
  readMinutes: number;
  publishedAt: string; // ISO date
}

export interface BrandSettings {
  name: string;
  shortName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  socials: { label: string; href: string }[];
  /** Footer marquee phrases, looped */
  marqueeWords: string[];
}
