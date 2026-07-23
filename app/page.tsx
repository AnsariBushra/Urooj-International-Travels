import Hero from "@/components/sections/Hero";
import DestinationsGrid from "@/components/sections/DestinationsGrid";
import ParallaxLayerSection from "@/components/sections/ParallaxLayerSection";
import InstagramShowcase from "@/components/sections/InstagramShowcase";
import Testimonials from "@/components/sections/Testimonials";
import HorizontalJournal from "@/components/sections/HorizontalJournal";
import TripPlanner from "@/components/sections/TripPlanner";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <DestinationsGrid />
      <ParallaxLayerSection
        eyebrow="Field Notes — 01"
        heading={["The detail is", "the devotion."]}
        body="From the first call to the last transfer home, every itinerary is built around your worship — verified documents, trusted hotels, and clear coordination at every step."
        imageSrc="/images/hajj/private-care.jpg"
        imageAlt="Zamzam water and dates at the Haram during night prayers"
        imagePosition="50% 50%"
        accent="rose"
        floatLabel="Care at every step"
      />
      <ParallaxLayerSection
        eyebrow="Field Notes — 02"
        heading={["Unhurried, by", "design."]}
        body="We build in spacious reflection windows on purpose. Ziyarat and prayer deserve room to breathe, not a rushed checklist."
        imageSrc="/images/hajj/masjid-nabawi.jpg"
        imageAlt="Courtyard canopies at Masjid an-Nabawi, Madinah"
        imagePosition="50% 45%"
        accent="sage"
        floatLabel="Madinah, unhurried"
        reverse
      />
      <InstagramShowcase />
      <Testimonials />
      <HorizontalJournal />
      <TripPlanner />
      <Footer />
    </main>
  );
}
