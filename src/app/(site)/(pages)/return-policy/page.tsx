// src/app/return-policy/page.tsx
"use client";

import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { RefreshCw, Shield, Clock, Package } from "lucide-react";

const ReturnPolicy = () => {
  return (
    <>
      <Breadcrumb title="Return Policy" pages={["Home", "Return Policy"]} />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                PilotWardrobe Return Policy
              </h1>
              <p className="text-gray-600 text-lg">
                We stand behind every uniform we sell with our 30-day satisfaction guarantee
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <RefreshCw className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">30 Days</div>
                <div className="text-gray-600">Return Window</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Full Refund</div>
                <div className="text-gray-600">or Exchange</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Clock className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">5-10 Days</div>
                <div className="text-gray-600">Refund Processing</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <Package className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">Free Returns</div>
                <div className="text-gray-600">On defective items</div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Policy Overview */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Return Promise</h2>
                <p className="text-gray-600 mb-4">
                  We want you to be completely satisfied with your PilotWardrobe purchase. If for any reason you're not happy with your order, we offer a <strong>30-day return policy</strong> from the date of delivery.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-blue-800 mb-2">Quick Return Process:</h3>
                  <ol className="list-decimal pl-5 text-blue-800 space-y-2">
                    <li>Contact us to request a return authorization</li>
                    <li>Ship items back with original packaging</li>
                    <li>We inspect and process your return</li>
                    <li>Receive refund or exchange within 5-10 days</li>
                  </ol>
                </div>
              </div>

              {/* Return Conditions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Conditions</h2>
                <p className="text-gray-600 mb-3">
                  To be eligible for a return, your item must be:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>In original, unused condition</li>
                  <li>With all original tags and labels attached</li>
                  <li>In the original packaging with all accessories</li>
                  <li>Accompanied by the original receipt or proof of purchase</li>
                  <li>Returned within 30 days of delivery</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-yellow-800 mb-2">Items That Cannot Be Returned:</h3>
                  <ul className="list-disc pl-5 text-yellow-800 space-y-1">
                    <li>Custom or personalized items</li>
                    <li>Items marked as "Final Sale" or "Clearance"</li>
                    <li>Opened hygiene products or undergarments</li>
                    <li>Items damaged due to misuse or improper care</li>
                  </ul>
                </div>
              </div>

              {/* Return Process */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return an Item</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Step 1: Request Return Authorization</h3>
                <p className="text-gray-600 mb-4">
                  Contact our customer service team within 30 days of delivery:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li><strong>Email:</strong> returns@pilotwardrobe.com</li>
                  <li><strong>Phone:</strong> +234 907 793 7546 (Option 3)</li>
                  <li><strong>Online:</strong> Through your account dashboard</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Step 2: Package Your Return</h3>
                <p className="text-gray-600 mb-3">
                  Securely pack the item(s) with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Original packaging and all accessories</li>
                  <li>Original tags and labels</li>
                  <li>Completed return form (provided by us)</li>
                  <li>Copy of your receipt or order confirmation</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Step 3: Ship Your Return</h3>
                <p className="text-gray-600 mb-3">
                  Use a trackable shipping service and insure the package. We recommend:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>UPS, FedEx, or DHL with tracking</li>
                  <li>Retain your shipping receipt and tracking number</li>
                  <li>Ship to our returns center: 456 Returns Ave, Wilmington, DE 19802</li>
                </ul>
              </div>

              {/* Refund Timeline */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Timeline & Methods</h2>
                
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 font-semibold text-gray-900">Stage</th>
                        <th className="py-3 px-4 font-semibold text-gray-900">Timeline</th>
                        <th className="py-3 px-4 font-semibold text-gray-900">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Return Received</td>
                        <td className="py-3 px-4">1-2 business days</td>
                        <td className="py-3 px-4">We confirm receipt and begin inspection</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Inspection</td>
                        <td className="py-3 px-4">1-3 business days</td>
                        <td className="py-3 px-4">Quality check by our pilot verification team</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Refund Processing</td>
                        <td className="py-3 px-4">1-2 business days</td>
                        <td className="py-3 px-4">Refund initiated to original payment method</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Refund Received</td>
                        <td className="py-3 px-4">2-5 business days</td>
                        <td className="py-3 px-4">Appears on your statement (varies by bank)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-gray-600">
                  <strong>Total Timeline:</strong> 5-10 business days from when we receive your return.
                </p>
              </div>

              {/* Exchanges */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
                <p className="text-gray-600 mb-3">
                  Need a different size or color? Exchanges are easy:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>Contact us to request an exchange</li>
                  <li>Return the original item following standard return procedure</li>
                  <li>Once received, we'll ship your replacement</li>
                  <li>We'll cover standard shipping for the replacement item</li>
                </ul>
                <p className="text-gray-600">
                  If the replacement item costs more, you'll only pay the difference. If it costs less, we'll refund the difference.
                </p>
              </div>

              {/* Defective Items */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Defective or Incorrect Items</h2>
                <p className="text-gray-600 mb-3">
                  If you receive a defective item or the wrong item:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>Contact us within 7 days of delivery</li>
                  <li>Provide photos of the issue</li>
                  <li>We'll provide a prepaid return shipping label</li>
                  <li>We cover all shipping costs for defective/wrong items</li>
                  <li>Receive a replacement or full refund</li>
                </ul>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <p className="text-green-800 font-semibold">
                    For defective items, we also offer a 10% discount on your next purchase as an apology for the inconvenience.
                  </p>
                </div>
              </div>

              {/* International Returns */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">International Returns</h2>
                <p className="text-gray-600 mb-3">
                  International customers follow the same return process, with some additional considerations:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                  <li>You are responsible for return shipping costs and customs fees</li>
                  <li>Mark the package as "Returned Goods" to avoid duties</li>
                  <li>Use a trackable international shipping service</li>
                  <li>Allow additional time for international shipping and customs</li>
                </ul>
                <p className="text-gray-600">
                  Refunds for international returns are issued in USD. Currency conversion fees may apply.
                </p>
              </div>

              {/* Restocking Fee */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Restocking Fee</h2>
                <p className="text-gray-600 mb-3">
                  A restocking fee may apply in certain situations:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>No restocking fee:</strong> Defective items, wrong items sent, size exchanges</li>
                  <li><strong>10% restocking fee:</strong> Returns after 15 days, items without original packaging</li>
                  <li><strong>15% restocking fee:</strong> Returns of multiple items from the same order</li>
                  <li><strong>No refund (store credit only):</strong> Returns after 30 days</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="border-t pt-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Questions?</h2>
                <p className="text-gray-600 mb-4">
                  Our returns team is here to help:
                </p>
                <ul className="list-none pl-0 text-gray-600 space-y-2">
                  <li><strong>Email:</strong> returns@pilotwardrobe.com</li>
                  <li><strong>Phone:</strong> +234 907 793 7546 (Option 3)</li>
                  <li><strong>Hours:</strong> Monday-Friday, 9:00 AM - 7:00 PM EST</li>
                  <li><strong>Online Returns Portal:</strong> Log in to your account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReturnPolicy;