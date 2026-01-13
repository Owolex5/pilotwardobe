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
              <a href="#" className="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition">
                <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.048 23.364c-.432 1.033-.945 2.117-1.541 3.254-.87 1.63-1.891 3.496-3.065 5.602-1.136 2.035-2.345 2.78-3.625 2.78-.825 0-1.822-.244-2.988-.73-1.166-.487-2.238-.73-3.217-.73-1.045 0-2.154.243-3.325.73-1.172.486-2.142.744-2.914.744-1.246 0-2.514-.806-3.804-2.417-1.248-1.553-2.386-3.462-3.414-5.73-1.097-2.416-1.646-4.757-1.646-7.024 0-2.568.682-4.786 2.045-6.655 1.266-1.742 2.945-2.613 5.037-2.613 1.095 0 2.267.347 3.515 1.043 1.248.696 2.094 1.043 2.537 1.043.359 0 1.275-.417 2.748-1.25 1.391-.779 2.565-1.095 3.52-.949.745.087 2.77.348 4.278 2.601-3.382 2.053-5.055 4.944-5.02 8.674.026 2.898 1.079 5.07 3.158 6.517.417.26.794.455 1.131.587-.09.26-.185.511-.283.753zM23.675.58c0 1.59-.58 3.074-1.741 4.456-1.399 1.634-3.091 2.578-4.926 2.427a4.97 4.97 0 01-.035-.587c0-1.526.666-3.159 1.85-4.477.592-.654 1.345-1.196 2.258-1.627.913-.43 1.778-.667 2.594-.71.026.104.04.208.04.311v.207z" fill="#fff"/>
                </svg>
                <div>
                  <span className="block text-xs">Download on the</span>
                  <p className="font-medium">App Store</p>
                </div>
              </a>

              <a href="#" className="inline-flex items-center gap-3 bg-blue hover:bg-blue-dark text-white py-3 px-6 rounded-lg transition">
                <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.632 1.998c.5-.615 1.202-.998 1.962-.998h26.812c.76 0 1.462.383 1.962.998.5.615.747 1.438.685 2.26l-2.026 26.125c-.124 1.592-1.41 2.865-3.002 2.865H5.975c-1.592 0-2.878-1.273-3.002-2.865L.947 4.258c-.062-.822.185-1.645.685-2.26zM18.445 7.99v16.158c0 .484.393.877.877.877h3.162c.484 0 .877-.393.877-.877V7.99c0-.484-.393-.877-.877-.877h-3.162c-.484 0-.877.393-.877.877zm-9.483 3.21v12.948c0 .484.393.877.877.877h3.162c.484 0 .877-.393.877-.877V11.2c0-.484-.393-.877-.877-.877H9.839c-.484 0-.877.393-.877.877z" fill="#fff"/>
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