// src/app/terms-conditions/page.tsx


import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";

const TermsConditions = () => {
  return (
    <>
      <Breadcrumb title="Terms & Conditions" pages={["Home", "Terms & Conditions"]} />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                PilotWardrobe Terms & Conditions
              </h1>
              <p className="text-gray-600 mb-8">
                <strong>Last Updated:</strong> January 1, 2024
              </p>

              <div className="space-y-8">
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 mb-3">
                    By accessing and using the PilotWardrobe website (the "Service"), operated by PilotWardrobe Inc. ("we", "us", or "our"), you accept and agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                  </p>
                  <p className="text-gray-600">
                    These Terms apply to all visitors, users, and others who access or use the Service. Additional terms may apply to specific features or services.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accounts and Registration</h2>
                  <p className="text-gray-600 mb-3">
                    When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Maintaining the confidentiality of your account and password</li>
                    <li>Restricting access to your computer or device</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring you logout from your account at the end of each session</li>
                  </ul>
                  <p className="text-gray-600">
                    We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products and Services</h2>
                  <p className="text-gray-600 mb-3">
                    PilotWardrobe specializes in pre-owned, pilot-verified aviation uniforms and accessories. All products are:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Thoroughly inspected by licensed pilots</li>
                    <li>Verified for authenticity and quality</li>
                    <li>Professional dry-cleaned before shipping</li>
                    <li>Subject to availability and pre-sale inspection</li>
                  </ul>
                  <p className="text-gray-600">
                    We reserve the right to modify or discontinue products without notice. Prices are subject to change without notice.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Order Processing and Payment</h2>
                  <p className="text-gray-600 mb-3">
                    Orders are processed within 1-3 business days. We accept the following payment methods:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Credit/Debit Cards (Visa, MasterCard, American Express)</li>
                    <li>PayPal</li>
                    <li>Bank Transfers (for orders over $500)</li>
                    <li>Cryptocurrency (Bitcoin, Ethereum for select items)</li>
                  </ul>
                  <p className="text-gray-600">
                    All transactions are secured with 256-bit SSL encryption. Your credit card information is never stored on our servers.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
                  <p className="text-gray-600 mb-3">
                    We ship worldwide using trusted carriers (DHL, FedEx, UPS). Shipping times vary:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>USA: 3-7 business days</li>
                    <li>Europe: 5-10 business days</li>
                    <li>Asia/Australia: 7-14 business days</li>
                    <li>Other regions: 10-21 business days</li>
                  </ul>
                  <p className="text-gray-600">
                    Customs duties and import taxes are the responsibility of the customer. We provide all necessary customs documentation.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
                  <p className="text-gray-600 mb-3">
                    We offer a 30-day return policy for unused items with original tags and packaging. Items must be in original condition.
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Return shipping is the customer's responsibility</li>
                    <li>Refunds are processed within 5-10 business days</li>
                    <li>Custom or personalized items cannot be returned</li>
                    <li>Sale items may have different return conditions</li>
                  </ul>
                  <p className="text-gray-600">
                    For defective items, contact us within 7 days of delivery for a replacement or full refund.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                  <p className="text-gray-600 mb-3">
                    The Service and its original content, features, and functionality are owned by PilotWardrobe and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-gray-600">
                    You may not:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Copy, modify, or create derivative works</li>
                    <li>Use our trademarks without permission</li>
                    <li>Reverse engineer any aspect of the Service</li>
                    <li>Remove any copyright or proprietary notices</li>
                  </ul>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Conduct</h2>
                  <p className="text-gray-600 mb-3">
                    As a user, you agree not to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Use the Service for any illegal purpose</li>
                    <li>Violate any laws in your jurisdiction</li>
                    <li>Infringe upon others' intellectual property rights</li>
                    <li>Upload viruses or malicious code</li>
                    <li>Interfere with the Service's security features</li>
                    <li>Attempt to gain unauthorized access</li>
                    <li>Harass, abuse, or harm others</li>
                  </ul>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                  <p className="text-gray-600 mb-3">
                    In no event shall PilotWardrobe, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-3">
                    <li>Any indirect, incidental, special, or consequential damages</li>
                    <li>Loss of profits, revenue, data, or use</li>
                    <li>Damages related to product use or misuse</li>
                    <li>Events beyond our reasonable control</li>
                  </ul>
                  <p className="text-gray-600">
                    Our total liability for any claim shall not exceed the amount paid by you for the product in question.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
                  <p className="text-gray-600">
                    These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of Delaware.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                  <p className="text-gray-600">
                    We reserve the right to modify these Terms at any time. We will notify users of any changes by posting the new Terms on this page. You are advised to review these Terms periodically for any changes.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                  <p className="text-gray-600 mb-3">
                    For any questions about these Terms, please contact us:
                  </p>
                  <ul className="list-none pl-0 text-gray-600 space-y-2">
                    <li><strong>Email:</strong> legal@pilotwardrobe.com</li>
                    <li><strong>Address:</strong> 123 Aviation Way, Suite 500, Wilmington, DE 19801, USA</li>
                    <li><strong>Phone:</strong> +234 907 793 7546</li>
                    <li><strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM EST</li>
                  </ul>
                </div>

                {/* Closing */}
                <div className="border-t pt-8 mt-8">
                  <p className="text-gray-600 text-sm">
                    By using PilotWardrobe, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsConditions;