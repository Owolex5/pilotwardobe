"use client";

import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";

import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

// ← ADD THIS IF YOU HAVE A THEME PROVIDER
// import { ThemeProvider } from "../context/ThemeContext";  // Adjust path as needed

// If you don't have a ThemeProvider yet, remove it or comment it out temporarily
// For now, I'll comment it out to prevent errors

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>

      <body>
        {/* Always render the full app structure */}
        {/* <ThemeProvider> ← Uncomment when you add the actual ThemeProvider */}
          <ReduxProvider>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <Header />
                  <main>{children}</main>
                  <Footer />

                  {/* Global components */}
                  <QuickViewModal />
                  <CartSidebarModal />
                  <PreviewSliderModal />
                  <ScrollToTop />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </ReduxProvider>
        {/* </ThemeProvider> */}

        {/* Preloader overlay - only visible while loading */}
        {loading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <PreLoader />
          </div>
        )}
      </body>
    </html>
  );
}