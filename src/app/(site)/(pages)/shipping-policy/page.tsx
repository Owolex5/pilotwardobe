// src/app/shipping-policy/page.tsx
"use client";

import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Truck, Clock, Shield, Globe } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <>
      <Breadcrumb title="Shipping Policy" pages={["Home", "Shipping Policy"]} />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                PilotWardrobe Shipping Policy
              </h1>
              <p className="text-gray-600 text-lg">
                Fast, reliable, and secure shipping for aviation professionals worldwide
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Truck className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Free Shipping</div>
                <div className="text-gray-600">On orders over $500</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">1-3 Days</div>
                <div className="text-gray-600">Processing Time</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Shield className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Insured</div>
                <div className="text-gray-600">All Shipments</div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Globe className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">100+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Processing Time */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing</h2>
                <p className="text-gray-600 mb-3">
                  All orders are processed within <strong>1-3 business days</strong> (Monday-Friday, excluding holidays). Processing includes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Final quality inspection by licensed pilots</li>
                  <li>Professional dry cleaning and sanitization</li>
                  <li>Authentication verification</li>
                  <li>Customs documentation preparation</li>
                  <li>Secure packaging</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  You will receive a confirmation email with tracking information once your order ships.
                </p>
              </div>

              {/* Shipping Methods */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Methods & Carriers</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 font-semibold text-gray-900">Service</th>
                        <th className="py-3 px-4 font-semibold text-gray-900">Delivery Time</th>
                        <th className="py-3 px-4 font-semibold text-gray-900">Cost</th>
                        <th className="py-3 px-4 font-semibold text-gray-900">Features</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <strong>Standard Shipping</strong>
                          <div className="text-gray-600 text-sm">DHL / FedEx Ground</div>
                        </td>
                        <td className="py-3 px-4">3-7 business days</td>
                        <td className="py-3 px-4">$9.99</td>
                        <td className="py-3 px-4">Tracking, $100 insurance</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <strong>Express Shipping</strong>
                          <div className="text-gray-600 text-sm">DHL Express / FedEx 2Day</div>
                        </td>
                        <td className="py-3 px-4">2-3 business days</td>
                        <td className="py-3 px-4">$19.99</td>
                        <td className="py-3 px-4">Priority handling, $500 insurance</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <strong>Overnight Shipping</strong>
                          <div className="text-gray-600 text-sm">DHL Next Day / FedEx Overnight</div>
                        </td>
                        <td className="py-3 px-4">1 business day</td>
                        <td className="py-3 px-4">$39.99</td>
                        <td className="py-3 px-4">Saturday delivery available, $1000 insurance</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <strong>International Shipping</strong>
                          <div className="text-gray-600 text-sm">DHL Worldwide / FedEx International</div>
                        </td>
                        <td className="py-3 px-4">5-14 business days</td>
                        <td className="py-3 px-4">From $29.99</td>
                        <td className="py-3 px-4">Customs clearance, real-time tracking</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* International Shipping */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">International Shipping</h2>
                <p className="text-gray-600 mb-3">
                  We ship to over 100 countries worldwide. International orders may be subject to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>Customs duties and import taxes</li>
                  <li>Import restrictions and regulations</li>
                  <li>Additional processing time for customs clearance</li>
                  <li>Required documentation for certain countries</li>
                </ul>
                <p className="text-gray-600">
                  <strong>Note:</strong> Customers are responsible for all customs fees, taxes, and duties. We provide all necessary customs documentation.
                </p>
              </div>

              {/* Free Shipping */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Shipping</h2>
                <p className="text-gray-600 mb-3">
                  We offer free standard shipping on all orders over <strong>$500 USD</strong>. This applies to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Domestic orders within the USA</li>
                  <li>International orders (some restrictions apply)</li>
                  <li>All product categories</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Free shipping uses our standard shipping method (3-7 business days). Expedited shipping upgrades are available at checkout.
                </p>
              </div>

              {/* Tracking & Delivery */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking & Delivery</h2>
                <p className="text-gray-600 mb-3">
                  Once your order ships, you'll receive a tracking number via email. You can track your package:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>Through your PilotWardrobe account</li>
                  <li>Via the carrier's website using your tracking number</li>
                  <li>Through the link in your shipping confirmation email</li>
                </ul>
                <p className="text-gray-600">
                  If you're not available at the time of delivery, carriers will typically leave a notice with instructions for pickup or rescheduling.
                </p>
              </div>

              {/* Undeliverable Packages */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Undeliverable Packages</h2>
                <p className="text-gray-600 mb-3">
                  Packages may be returned to us if:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>The address is incorrect or incomplete</li>
                  <li>The package is refused by the recipient</li>
                  <li>Three delivery attempts have been made</li>
                  <li>Customs clearance is denied</li>
                </ul>
                <p className="text-gray-600">
                  If your package is returned, we will contact you to arrange reshipment. Additional shipping fees may apply.
                </p>
              </div>

              {/* Shipping Restrictions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Restrictions</h2>
                <p className="text-gray-600 mb-3">
                  Due to regulations, we cannot ship certain items to specific countries:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Military-style uniforms to restricted countries</li>
                  <li>Items containing specific materials (e.g., ivory, certain woods)</li>
                  <li>Products requiring special licenses or permits</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Contact us before ordering if you have questions about shipping restrictions to your country.
                </p>
              </div>

              {/* Contact */}
              <div className="border-t pt-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                  For shipping inquiries, contact our logistics team:
                </p>
                <ul className="list-none pl-0 text-gray-600 space-y-2">
                  <li><strong>Email:</strong> shipping@pilotwardrobe.com</li>
                  <li><strong>Phone:</strong> +234 907 793 7546 (Option 2)</li>
                  <li><strong>Hours:</strong> Monday-Friday, 8:00 AM - 8:00 PM EST</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Most shipping questions can be resolved within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingPolicy;