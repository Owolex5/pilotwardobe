// src/app/providers.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { PreviewSliderProvider } from "./context/PreviewSliderContext";

import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import SiteShell from "@/components/SiteShell";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Routes where SiteShell / header/footer should be hidden
  const hiddenRoutes = [
    "/dashboard",
    "/admin",
    "/signin",
    "/signup",
  ];

  const useSiteShell = !hiddenRoutes.some(route => pathname.startsWith(route));

  return (
    <ReduxProvider>
      <CartModalProvider>
        <ModalProvider>
          <PreviewSliderProvider>
            {/* Render SiteShell on all non-hidden routes */}
            {useSiteShell ? <SiteShell>{children}</SiteShell> : children}

            {/* Modals + scroll to top */}
            <QuickViewModal />
            <CartSidebarModal />
            <PreviewSliderModal />
            <ScrollToTop />

            {/* Preloader overlay */}
            {loading && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
                <PreLoader />
              </div>
            )}
          </PreviewSliderProvider>
        </ModalProvider>
      </CartModalProvider>
    </ReduxProvider>
  );
}
