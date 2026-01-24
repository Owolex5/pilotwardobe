"use client";

import { usePathname } from "next/navigation";

import { ModalProvider } from "./context/QuickViewModalContext";
import { CartModalProvider } from "./context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { PreviewSliderProvider } from "./context/PreviewSliderContext";

import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import SiteShell from "@/components/SiteShell";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where SiteShell / header/footer should be hidden
  const hiddenRoutes = [
    "/dashboard",
    "/admin",
    "/signin",
    "/signup",
  ];

  const useSiteShell = !hiddenRoutes.some(route =>
    pathname.startsWith(route)
  );

  return (
    <ReduxProvider>
      <CartModalProvider>
        <ModalProvider>
          <PreviewSliderProvider>
            {/* Layout wrapper */}
            {useSiteShell ? <SiteShell>{children}</SiteShell> : children}

            {/* Global modals & utilities */}
            <QuickViewModal />
            <CartSidebarModal />
            <PreviewSliderModal />
            <ScrollToTop />
          </PreviewSliderProvider>
        </ModalProvider>
      </CartModalProvider>
    </ReduxProvider>
  );
}
