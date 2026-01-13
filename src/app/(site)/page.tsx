// app/page.tsx
import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PilotWardrobe | Premium Aviation Gear Marketplace",
  description: "Shop professional pilot headsets, uniforms, watches, flight bags, and aviation equipment. Buy and sell pre-owned pilot gear with confidence.",
  keywords: "pilot gear, aviation equipment, pilot headsets, flight uniforms, pilot watches, aviation marketplace",
  openGraph: {
    title: "PilotWardrobe - Premium Aviation Gear",
    description: "The trusted marketplace for professional pilots to buy and sell gear",
    type: "website",
  },
};

export default function HomePage() {
  return <Home />;
}