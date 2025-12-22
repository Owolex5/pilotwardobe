import React from "react";
import Checkout from "@/components/Checkout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | PilotWardrobe",
  description:
    "Complete your purchase on PilotWardrobe. Securely buy pilot uniforms, aviation headsets, epaulettes, flight bags, watches, sunglasses, gadgets, and certified aircraft parts. Fast worldwide shipping for pilots and aviation professionals.",
  keywords:
    "pilot checkout, aviation checkout, secure payment pilots, buy pilot uniform, aviation gear payment, flight bag checkout, headset purchase",
  openGraph: {
    title: "Checkout - PilotWardrobe Aviation Marketplace",
    description:
      "Finalize your order for premium pilot gear: uniforms, headsets, accessories, and more. Secure checkout with global shipping.",
    url: "https://www.pilotwardrobe.com/checkout", // Update with your real domain
    type: "website",
    images: [
      {
        url: "/og-checkout.jpg", // Recommended: create a custom OG image (e.g., pilot at cockpit with gear + secure lock icon)
        width: 1200,
        height: 630,
        alt: "Secure Checkout at PilotWardrobe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout | PilotWardrobe",
    description:
      "Securely complete your purchase of pilot uniforms, headsets, and aviation accessories.",
  },
  robots: {
    index: false, // Checkout pages are user-specific and sensitive — never index
    follow: false,
  },
};

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;