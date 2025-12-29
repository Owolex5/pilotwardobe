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
                  <path fillRule="evenodd" clipRule="evenodd" d="M..." fill="#3C50E0"/> {/* Your location icon */}
                </svg>
                <span className="text-gray-300">
235 east west road, Porthacourt,<br />
                  Nigeria
                </span>
              </li>

              <li>
                <a href="tel:+16822402356" className="flex items-center gap-4 hover:text-blue transition">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue">
                    <path fillRule="evenodd" clipRule="evenodd" d="M..." fill="#3C50E0"/> {/* Phone icon */}
                  </svg>
                  +1 (682) 240-2356
                </a>
              </li>

              <li>
                <a href="mailto:support@pilotwardrobe.com" className="flex items-center gap-4 hover:text-blue transition">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue">
                    <path fillRule="evenodd" clipRule="evenodd" d="M..." fill="#3C50E0"/> {/* Email icon */}
                  </svg>
                  support@pilotwardrobe.com
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-5 mt-8">
              <a href="https://facebook.com/pilotwardrobe" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-blue transition">
                {/* Facebook SVG */}
              </a>
              <a href="https://twitter.com/pilotwardrobe" target="_blank" rel="noopener" aria-label="X (Twitter)" className="hover:text-blue transition">
                {/* X SVG */}
              </a>
              <a href="https://instagram.com/pilotwardrobe" target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-blue transition">
                {/* Instagram SVG */}
              </a>
              <a href="https://linkedin.com/company/pilotwardrobe" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-blue transition">
                {/* LinkedIn SVG */}
              </a>
            </div>
          </div>

          {/* Column 2: Account */}
          <div>
            <h2 className="mb-7.5 text-xl font-semibold">My Account</h2>
            <ul className="space-y-3.5">
          
              {/* <li><Link href="/dashboard/orders" className="hover:text-blue transition">My Listings</Link></li> */}
              <li><Link href="/wishlist" className="hover:text-blue transition">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-blue transition">Cart</Link></li>
              <li><Link href="/signin" className="hover:text-blue transition">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-blue transition">Register</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h2 className="mb-7.5 text-xl font-semibold">Quick Links</h2>
            <ul className="space-y-3">
              <li><Link href="/shop-without-sidebar" className="hover:text-blue transition">Shop All</Link></li>
           
            
              <li><Link href="/contact" className="hover:text-blue transition">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-blue transition">About Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Download App */}
          <div>
            <h2 className="mb-7.5 text-xl font-semibold lg:text-right">Download App</h2>
            <p className="text-gray-300 lg:text-right mb-6">
              Coming soon — get notified when our pilot app launches!
            </p>

            <div className="flex flex-col lg:items-end gap-4">
              <a href="#" className="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition">
                <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Apple SVG */}
                </svg>
                <div>
                  <span className="block text-xs">Download on the</span>
                  <p className="font-medium">App Store</p>
                </div>
              </a>

              <a href="#" className="inline-flex items-center gap-3 bg-blue hover:bg-blue-dark text-white py-3 px-6 rounded-lg transition">
                <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Google Play SVG */}
                </svg>
                <div>
                  <span className="block text-xs">Get it on</span>
                  <p className="font-medium">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {year} PilotWardrobe. All rights reserved. Proudly serving the global pilot community.
            </p>

            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm">Secure Payments:</span>
              <div className="flex gap-5">
                <Image src="/images/payment/payment-01.svg" alt="Visa" width={50} height={30} />
                <Image src="/images/payment/payment-03.svg" alt="Mastercard" width={50} height={30} />
                <Image src="/images/payment/payment-04.svg" alt="Apple Pay" width={50} height={30} />
                <Image src="/images/payment/payment-05.svg" alt="Google Pay" width={50} height={30} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;