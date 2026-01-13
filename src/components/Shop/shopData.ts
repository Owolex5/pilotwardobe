// shopData.ts
import { Product } from "@/types/product";

const shopData: Product[] = [
  {
    id: 1,
    title: "Bose A30 Aviation Headset (Pre-owned - Excellent)",
    description: "Premium noise-cancelling aviation headset with next-generation TriPort technology. Features Bluetooth 5.3 connectivity, 40-hour battery life, and customizable audio. Lightweight design with premium comfort for long-haul flights. Comes with original carrying case, cables, and accessories. Certified refurbished with 1-year warranty.",
    reviews: 28,
    price: 1249.0,
    discountedPrice: 1050.0,
    isOfficial: true,
    category: "Headsets",
    sizes: ["Universal Fit"],
    tags: ["bose", "noise-cancelling", "bluetooth", "premium", "refurbished"],
    imgs: {
      thumbnails: [
        "/images/pward/Bose_A30_1.webp",
        "/images/pward/Bose_A30_1.webp",
      ],
      previews: [
        "/images/pward/Bose_A30_1.webp",
        "/images/pward/Bose_A30_1.webp",
      ],
    },
  },
  {
    id: 2,
    title: "Captain 4-Stripe Gold Epaulettes (New)",
    description: "Premium captain epaulettes with 4 gold stripes and silver wings insignia. Made from high-quality polyester with metal clips for secure attachment. Features precise embroidery and professional finish. Suitable for airline uniforms, ceremonies, and formal occasions. Available in multiple rank configurations.",
    reviews: 42,
    price: 120.0,
    discountedPrice: 85.0,
    isOfficial: true,
    category: "Epaulettes",
    sizes: [
      "Trainee / Cadet (0-1 stripe)",
      "Second / Junior Officer (1-2 stripes)",
      "First Officer (3 stripes)",
      "Captain (4 stripes)",
    ],
    tags: ["epaulettes", "captain", "uniform", "rank", "insignia", "gold"],
    imgs: {
      thumbnails: [
        "/images/pward/jwea.webp",
        "/images/pward/jwea.webp",
      ],
      previews: [
        "/images/pward/jwea.webp",
        "/images/pward/jwea.webp",
      ],
    },
  },
  {
    id: 3,
    title: "Lightspeed Zulu 3 ANR Headset",
    description: "Professional aviation headset with Active Noise Reduction (ANR) technology. Features Bluetooth audio/mic connectivity, 30-hour battery life, and premium comfort. Includes deluxe headset bag, cables, and accessories. Excellent condition with minimal signs of use. Perfect for commercial pilots and flight instructors.",
    reviews: 19,
    price: 450.0,
    discountedPrice: 250.0,
    isOfficial: false,
    category: "Headsets",
    sizes: ["Universal Fit"],
    tags: ["lightspeed", "zulu3", "anr", "bluetooth", "pre-owned"],
    imgs: {
      thumbnails: [
        "/images/pward/Lightspeed_Delta_Zulu_Headset.webp",
        "/images/pward/Lightspeed_Delta_Zulu_Headset.webp",
      ],
      previews: [
        "/images/pward/Lightspeed_Delta_Zulu_Headset.webp",
        "/images/pward/Lightspeed_Delta_Zulu_Headset.webp",
      ],
    },
  },
  {
    id: 4,
    title: "Lightspeed Duke Leather Flight Bag",
    description: "Premium full-grain leather flight bag with multiple compartments. Features iPad pocket, headset compartment, water bottle holder, and TSA-approved lock. Durable construction with brass hardware and reinforced stitching. Classic design that ages beautifully. Perfect for pilots who appreciate traditional craftsmanship.",
    reviews: 35,
    price: 499.0,
    discountedPrice: 420.0,
    isOfficial: true,
    category: "Flight Bags",
    sizes: ["Standard", "Large"],
    tags: ["flight-bag", "leather", "lightspeed", "duke", "premium"],
    imgs: {
      thumbnails: [
        "/images/pward/91Nd-tcfKwL._AC_SL1500_.jpg",
        "/images/pward/91Nd-tcfKwL._AC_SL1500_.jpg",
      ],
      previews: [
        "/images/pward/91Nd-tcfKwL._AC_SL1500_.jpg",
        "/images/pward/91Nd-tcfKwL._AC_SL1500_.jpg",
      ],
    },
  },
  {
    id: 6,
    title: "Garmin D2 Mach 1 Pro Pilot Watch",
    description: "Advanced pilot watch with aviation-specific features including direct-to navigation, airport information, and flight timer. Features AMOLED display, solar charging, and built-in fitness tracking. Includes heart rate monitor, pulse ox sensor, and multiple aviation apps. Brand new in box with full warranty.",
    reviews: 12,
    price: 2099.0,
    discountedPrice: 1850.0,
    isOfficial: true,
    category: "Watches",
    sizes: ["Standard (46mm)"],
    tags: ["garmin", "pilot-watch", "aviation", "smartwatch", "pro"],
    imgs: {
      thumbnails: [
        "/images/pward/D2_Mach_2_1.webp",
        "/images/pward/D2_Mach_2_1.webp",
      ],
      previews: [
        "/images/pward/D2_Mach_2_1.webp",
        "/images/pward/D2_Mach_2_1.webp",
      ],
    },
  },
  {
    id: 8,
    title: "iPad Mini Kneeboard & Mount (Universal)",
    description: "Universal kneeboard mount for iPad Mini (all generations). Features adjustable elastic strap, rotating tablet holder, and pen storage. Made from durable nylon with non-slip backing. Perfect for holding charts, approach plates, and checklists during flight. Lightweight and portable design.",
    reviews: 31,
    price: 89.0,
    discountedPrice: 69.0,
    isOfficial: false,
    category: "Flight Gear",
    sizes: ["iPad Mini (5th-7th Gen)", "iPad Mini (1st-4th Gen)"],
    tags: ["kneeboard", "ipad-mount", "cockpit", "flight-gear", "universal"],
    imgs: {
      thumbnails: [
        "/images/pward/Flight_Gear_Smart_Battery_Pack_Max.webp",
        "/images/pward/Flight_Gear_Smart_Battery_Pack_Max.webp",
      ],
      previews: [
        "/images/pward/Flight_Gear_Smart_Battery_Pack_Max.webp",
        "/images/pward/Flight_Gear_Smart_Battery_Pack_Max.webp",
      ],
    },
  },
];

export default shopData;