// src/components/SiteShell/index.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "../Header";   // ← Go up one level to src/components/Header
import Footer from "../Footer";   // ← Go up one level to src/components/Footer

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Header />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}