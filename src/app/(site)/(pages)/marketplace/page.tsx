import { Metadata } from "next";
import Marketplace from "@/components/Marketplace";

export const metadata: Metadata = {
  title: "PilotWardrobe | Aviation Marketplace",
};

export default function MarketplacePage() {
  return <Marketplace />;
}
