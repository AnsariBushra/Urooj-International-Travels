import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/animation/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import AmbientBackground from "@/components/three/AmbientBackground";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Urooj International — Hajj, Umrah & Ziyaratein Travel",
  description:
    "Urooj International is an All India Hajj, Umrah & Ziyaratein travel agency — managing documents, hotels near the Haram, and private transfers in Saudi Arabia so you can focus on your worship. Book now: 9971337283.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased bg-cream text-bone font-sans">
        <AmbientBackground />
        <SmoothScrollProvider>
          <div id="site-content">
            <CustomCursor />
            <Navbar />
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
