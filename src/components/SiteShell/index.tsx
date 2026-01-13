// components/SiteShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "../Header";
import Footer from "../Footer";
import PilotWardrobeNav from "../PilotWardrobeNav"; // Import the new nav

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header & footer on these routes
  const noLayoutRoutes = [
    "/dashboard",
    "/admin",
    "/signin",
    "/signup",
    "/request-item",
    "/sell",
  ];

  // Check if we're on homepage
  const isHomepage = pathname === "/";
  
  // Check if we should hide layout
  const shouldHideLayout = noLayoutRoutes.some(route => 
    pathname.startsWith(route)
  );

  return (
    <>
      {/* Show PilotWardrobeNav only on homepage, Header on other pages */}
      {!shouldHideLayout && (
        <>
          {isHomepage ? <PilotWardrobeNav /> : <Header />}
        </>
      )}
      
      <main>{children}</main>
      
      {/* Show footer only if not on hidden routes */}
      {!shouldHideLayout && <Footer />}
    </>
  );
}