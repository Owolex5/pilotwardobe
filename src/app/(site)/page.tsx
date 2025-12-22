import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PilotWardrobe | Aviation Marketplace for Pilots",
  description:
    "PilotWardrobe is the ultimate online marketplace for pilots and aviation enthusiasts. Buy, sell, or exchange pilot uniforms, epaulettes, headsets, watches, sunglasses, flight bags, accessories, and certified aircraft parts with part numbers. Connect with the global aviation community for everything aviation-related.",
  keywords:
    "pilot uniforms, aviation marketplace, aircraft parts, pilot accessories, headsets, pilot watches, flight gear, buy sell aviation, pilot epaulettes, aviation apparel",
  // You can add more metadata like open graph for better social sharing
  openGraph: {
    title: "PilotWardrobe - Your Aviation Marketplace",
    description:
      "The go-to platform for pilots to buy, sell, and exchange uniforms, accessories, and aircraft parts worldwide.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}