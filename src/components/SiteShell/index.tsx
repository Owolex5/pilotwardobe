"use client";

import { usePathname } from "next/navigation";
import Header from "../Header";
import Footer from "../Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header & footer on these routes
  const noLayoutRoutes = [
    "/dashboard",
    "/admin",
    "/signin",
    "/signup",
    "/request-item", // optional: clean request page
    "/sell",         // optional: clean sell form
  ];

  const shouldHideLayout = noLayoutRoutes.some(route => 
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}