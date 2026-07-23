import { Testimonial, JournalEntry } from "./types";

// Pilgrim testimonials for Urooj International (Hajj | Umrah | Ziyaratein).
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mohammad Imran",
    location: "Delhi",
    quote:
      "Every document was checked and verified before our file even moved. For Hajj, that peace of mind is everything.",
    destinationSlug: "hajj-package",
    rating: 5,
  },
  {
    id: "t2",
    name: "Rukhsana Begum",
    location: "Lucknow",
    quote:
      "Our hotel in Makkah was so close to the Haram that we never worried about timing. Urooj handled it all.",
    destinationSlug: "umrah-package",
    rating: 5,
  },
  {
    id: "t3",
    name: "Abdul Wahab",
    location: "Hyderabad",
    quote:
      "The Madinah ziyarat was guided at such a calm pace — time to actually pray and reflect, not just rush through.",
    destinationSlug: "madinah-ziyarat",
    rating: 5,
  },
];

// Guides & field notes for pilgrims preparing for Hajj, Umrah, or Ziyarat.
// Cover images are restricted to the agency's clean (text-free) photos,
// since JournalCard crops covers with object-fit: cover.
export const journal: JournalEntry[] = [
  {
    slug: "hajj-document-checklist",
    title: "The complete Hajj document checklist",
    excerpt: "Passport validity, vaccination records, Nusuk requirements, and itinerary readiness — explained.",
    coverImage: {
      src: "/images/hajj/makkah.jpg",
      alt: "Pilgrims around the Kaaba at Masjid al-Haram, Makkah",
      width: 676,
      height: 1200,
      focalPoint: "50% 30%",
    },
    category: "Guides",
    readMinutes: 6,
    publishedAt: "2026-04-12",
  },
  {
    slug: "choosing-makkah-hotel",
    title: "Why your hotel's distance from the Haram matters",
    excerpt: "Shorter walks, clearer meeting points, and realistic rest windows during the busiest Hajj days.",
    coverImage: {
      src: "/images/hajj/masjid-al-haram.jpg",
      alt: "Road sign pointing to Masjid al-Haram, with minarets behind",
      width: 736,
      height: 1307,
      focalPoint: "60% 25%",
    },
    category: "Guides",
    readMinutes: 5,
    publishedAt: "2026-03-03",
  },
  {
    slug: "madinah-ziyarat-guide",
    title: "A guide to Madinah ziyarat, without the rush",
    excerpt: "What to visit around Masjid an-Nabawi, and how to pace it for reflection rather than a checklist.",
    coverImage: {
      src: "/images/hajj/masjid-nabawi.jpg",
      alt: "Courtyard canopies at Masjid an-Nabawi, Madinah",
      width: 675,
      height: 1200,
      focalPoint: "50% 45%",
    },
    category: "Ziyarat",
    readMinutes: 7,
    publishedAt: "2026-01-20",
  },
  {
    slug: "hajj-logistics-explained",
    title: "How we coordinate every step of your Hajj journey",
    excerpt: "Airport arrival, hotel check-in, Makkah ziyarat, Mina, Arafat, Muzdalifah, and departure — mapped out.",
    coverImage: {
      src: "/images/hajj/private-care.jpg",
      alt: "Zamzam water and dates at the Haram during night prayers",
      width: 736,
      height: 1308,
      focalPoint: "50% 50%",
    },
    category: "Logistics",
    readMinutes: 8,
    publishedAt: "2025-12-11",
  },
];
