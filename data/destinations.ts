import { Destination } from "./types";

// Urooj International — Hajj | Umrah | Ziyaratein service packages.
// Repurposing the "Destination" shape from a geographic-trip model to
// a sacred-journey service model: each entry below is a core package
// or service pillar of the agency.
//
// IMPORTANT — image selection rule: only the four "clean" photographs
// (no baked-in text/logo) are used here, because every card/grid slot
// crops with object-fit: cover. The five Instagram poster graphics
// (which have headlines, logos, and caption text burned into the
// image itself) are never cropped — they're shown uncropped, full-
// frame, in the dedicated InstagramShowcase section instead.
export const destinations: Destination[] = [
  {
    slug: "hajj-package",
    name: "Hajj",
    region: "Makkah & Madinah",
    tagline: "Every document. Every detail. Handled with care.",
    description:
      "A fully managed Hajj journey — passport validity, vaccination records, Nusuk requirements, and itinerary readiness checked before your file ever moves. From airport pickup to Mina, Arafat, and Muzdalifah, every step is coordinated so you can focus on worship.",
    heroImage: {
      src: "/images/hajj/makkah.jpg",
      alt: "Pilgrims around the Kaaba at Masjid al-Haram, Makkah",
      width: 676,
      height: 1200,
      focalPoint: "50% 32%",
    },
    gridImage: {
      src: "/images/hajj/makkah.jpg",
      alt: "Pilgrims around the Kaaba at Masjid al-Haram, Makkah",
      width: 676,
      height: 1200,
      focalPoint: "50% 32%",
    },
    gallery: [
      {
        src: "/images/hajj/masjid-al-haram.jpg",
        alt: "Road sign pointing to Masjid al-Haram, with minarets behind",
        width: 736,
        height: 1307,
        focalPoint: "60% 30%",
      },
    ],
    priceFrom: null,
    currency: "INR",
    durationDays: 14,
    featured: true,
  },
  {
    slug: "umrah-package",
    name: "Umrah",
    region: "Makkah",
    tagline: "Better location. Better comfort. Better worship.",
    description:
      "Hotels chosen for proximity to the Haram — shorter walks, clearer meeting points, and realistic rest windows that make the sacred days easier. Thoughtful planning for a smoother journey, so you can focus on worship while we handle the rest.",
    heroImage: {
      src: "/images/hajj/masjid-al-haram.jpg",
      alt: "Road sign pointing to Masjid al-Haram, with minarets behind",
      width: 736,
      height: 1307,
      focalPoint: "60% 30%",
    },
    gridImage: {
      src: "/images/hajj/masjid-al-haram.jpg",
      alt: "Road sign pointing to Masjid al-Haram, with minarets behind",
      width: 736,
      height: 1307,
      focalPoint: "60% 30%",
    },
    gallery: [
      {
        src: "/images/hajj/private-care.jpg",
        alt: "Zamzam water and dates at the Haram during night prayers",
        width: 736,
        height: 1308,
        focalPoint: "50% 55%",
      },
    ],
    priceFrom: null,
    currency: "INR",
    durationDays: 10,
    featured: true,
  },
  {
    slug: "madinah-ziyarat",
    name: "Madinah Ziyarat",
    region: "Madinah",
    tagline: "Time for prayer and reflection.",
    description:
      "A guided pace for sacred visits to Masjid an-Nabawi and the historic sites of Madinah — designed with spacious reflection windows so the journey never feels rushed. Care at every step, for every member of the family.",
    heroImage: {
      src: "/images/hajj/masjid-nabawi.jpg",
      alt: "Courtyard canopies at Masjid an-Nabawi, Madinah",
      width: 675,
      height: 1200,
      focalPoint: "50% 50%",
    },
    gridImage: {
      src: "/images/hajj/masjid-nabawi.jpg",
      alt: "Courtyard canopies at Masjid an-Nabawi, Madinah",
      width: 675,
      height: 1200,
      focalPoint: "50% 50%",
    },
    gallery: [],
    priceFrom: null,
    currency: "INR",
    durationDays: 5,
    featured: true,
  },
  {
    slug: "logistics-transport",
    name: "Private Logistics",
    region: "Saudi Arabia",
    tagline: "You worship. We take care of the rest.",
    description:
      "Private transport through the busiest Hajj days — airport pickup, hotel movement, and group transfers coordinated clearly across Saudi Arabia. From arrival to departure, every journey is carefully managed with 24/7 support.",
    heroImage: {
      src: "/images/hajj/private-care.jpg",
      alt: "Zamzam water and dates at the Haram during night prayers",
      width: 736,
      height: 1308,
      focalPoint: "50% 55%",
    },
    gridImage: {
      src: "/images/hajj/private-care.jpg",
      alt: "Zamzam water and dates at the Haram during night prayers",
      width: 736,
      height: 1308,
      focalPoint: "50% 55%",
    },
    gallery: [],
    priceFrom: null,
    currency: "INR",
    durationDays: 0,
    featured: false,
  },
  {
    slug: "guided-pilgrimage-care",
    name: "Guided Pilgrimage Care",
    region: "Makkah & Madinah",
    tagline: "Documents, hotels, transfers, and rituals — all held together.",
    description:
      "End-to-end Hajj support: verified documents, hotel booking, private transfers, and a guided Umrah & Hajj ritual handbook so every rite is performed with confidence. One calm process from visa to return flight.",
    heroImage: {
      src: "/images/hajj/masjid-nabawi.jpg",
      alt: "Courtyard canopies at Masjid an-Nabawi, Madinah",
      width: 675,
      height: 1200,
      focalPoint: "50% 50%",
    },
    gridImage: {
      src: "/images/hajj/masjid-nabawi.jpg",
      alt: "Courtyard canopies at Masjid an-Nabawi, Madinah",
      width: 675,
      height: 1200,
      focalPoint: "50% 50%",
    },
    gallery: [],
    priceFrom: null,
    currency: "INR",
    durationDays: 0,
    featured: false,
  },
];

// The five Instagram poster graphics — each one is a finished creative
// with its own headline, logo, and caption baked in. These are shown
// uncropped (object-fit: contain inside a card frame) in the
// InstagramShowcase section, never force-cropped like the photos above.
export const instagramPosts = [
  {
    slug: "documents-checked",
    image: { src: "/images/hajj/haj-docs.jpg", alt: "Documents checked before your Hajj file moves", width: 919, height: 1024 },
    caption: "Documents checked before your Hajj file moves.",
  },
  {
    slug: "hotel-location",
    image: { src: "/images/hajj/haj-location.jpg", alt: "Why hotel location changes the pilgrimage rhythm", width: 1024, height: 878 },
    caption: "Why hotel location changes the pilgrimage rhythm.",
  },
  {
    slug: "we-manage-logistics",
    image: { src: "/images/hajj/haj-logistic.png", alt: "We manage logistics so you can focus on your pilgrimage", width: 1351, height: 1164 },
    caption: "We manage logistics, so you can focus on your pilgrimage.",
  },
  {
    slug: "madinah-ziyarat-time",
    image: { src: "/images/hajj/madinah-ziyarat.jpg", alt: "Madinah ziyarat with time for prayer and reflection", width: 919, height: 1024 },
    caption: "Madinah ziyarat with time for prayer and reflection.",
  },
  {
    slug: "guided-pilgrimage-care-graphic",
    image: { src: "/images/hajj/madinah-courtyard.jpg", alt: "Guided pilgrimage care — all held together", width: 775, height: 1024 },
    caption: "Guided pilgrimage care — all held together.",
  },
];
