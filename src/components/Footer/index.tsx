import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-dark text-white">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Footer Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 py-16 lg:py-20">
          {/* Column 1: Help & Support */}
          <div className="max-w-[330px]">
            <h2 className="mb-7.5 text-xl font-semibold">Help & Support</h2>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 text-blue">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="#3C50E0"/>
                </svg>
                <span className="text-gray-300">
                  Suite C8, Mediatrix Of All Graces Plaza, No. 79 Stadium road, Rumoumasi, Porthacourt, Rivers State<br />
                  Nigeria
                </span>
              </li>

              <li>
                <a href="tel:+2349077937546" className="flex items-center gap-4 hover:text-blue transition">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H7zm5 17a1 1 0 100-2 1 1 0 000 2z" fill="#3C50E0"/>
                  </svg>
                  +234 907 793 7546
                </a>
              </li>

              <li>
                <a href="mailto:support@pilotwardrobe.com" className="flex items-center gap-4 hover:text-blue transition">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue">
                    <path fillRule="evenodd" clipRule="evenodd" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#3C50E0"/>
                  </svg>
                  support@pilotwardrobe.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-5 mt-8">
              <a href="https://facebook.com/pilotwardrobe" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
              </a>
              <a href="https://twitter.com/pilotwardrobe" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-blue transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" fill="#1DA1F2"/>
                </svg>
              </a>
              <a href="https://instagram.com/pilotwardrobe" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-blue transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/pilotwardrobe" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Account */}
          <div>
            <h2 className="mb-7.5 text-xl font-semibold">My Account</h2>
            <ul className="space-y-3.5">
              <li><Link href="/dashboard" className="hover:text-blue transition">Dashboard</Link></li>
             <li><Link href="/shop" className="hover:text-blue transition">Marketplace</Link></li>
              
              <li><Link href="/sell" className="hover:text-blue transition">Sell Items</Link></li>
              <li><Link href="/wishlist" className="hover:text-blue transition">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-blue transition">Cart</Link></li>
              <li><Link href="/signin" className="hover:text-blue transition">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-blue transition">Register</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h2 className="mb-7.5 text-xl font-semibold">Legal</h2>
            <ul className="space-y-3">
              
              <li><Link href="/faq" className="hover:text-blue transition">FAQ</Link></li>
                    <li><Link href="/privacy-policy" className="text-gray-400 hover:text-blue transition">Privacy Policy</Link></li>
                <li><Link href="/terms-conditions" className="text-gray-400 hover:text-blue transition">Terms & Conditions</Link></li>
                <li><Link href="/return-policy" className="text-gray-400 hover:text-blue transition">Return Policy</Link></li>

                <li><Link href="/shipping-policy" className="text-gray-400 hover:text-blue transition">Shipping Policy</Link></li>
           
            
            </ul>

          </div>

          {/* Column 4: Download App */}
          <div>
            <h2 className="mb-7.5 text-xl font-semibold lg:text-right">Download App</h2>
            <p className="text-gray-300 lg:text-right mb-6">
              Coming soon — get notified when our pilot app launches!
            </p>

<div className="flex flex-col lg:items-end gap-4">
  {/* App Store Button */}
  <a 
    href="#" 
    className="w-48 inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-800"
  >
    <svg width="28" height="32" viewBox="0 0 384 512" fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
    <div className="leading-tight">
      <span className="block text-[10px] uppercase font-semibold">Download on the</span>
      <p className="text-xl font-bold tracking-tight">App Store</p>
    </div>
  </a>

  {/* Google Play Button */}
  <a 
    href="#" 
    className="w-48 inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-800"
  >
    <svg width="28" height="32" viewBox="0 0 512 512" fill="currentColor">
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
    </svg>
    <div className="leading-tight">
      <span className="block text-[10px] uppercase font-semibold">Get it on</span>
      <p className="text-xl font-bold tracking-tight">Google Play</p>
    </div>
  </a>
</div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex-1">
              <p className="text-gray-400 text-sm">
                © {year} PilotWardrobe. All rights reserved. Proudly serving the global pilot community.
              </p>
              {/* Legal links in footer bottom - optional additional placement */}
              <div className="flex flex-wrap gap-4 mt-3">
                <Link href="/privacy-policy" className="text-gray-500 hover:text-blue transition text-sm">Privacy Policy</Link>
                <span className="text-gray-600">•</span>
                <Link href="/terms-conditions" className="text-gray-500 hover:text-blue transition text-sm">Terms & Conditions</Link>
                <span className="text-gray-600">•</span>
                <Link href="/return-policy" className="text-gray-500 hover:text-blue transition text-sm">Return Policy</Link>
               
              </div>
            </div>


          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
