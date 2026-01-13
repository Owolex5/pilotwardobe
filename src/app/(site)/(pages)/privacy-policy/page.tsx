// src/app/privacy-policy/page.tsx


import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";

const PrivacyPolicy = () => {
  return (
    <>
      <Breadcrumb title="Privacy Policy" pages={["Home", "Privacy Policy"]} />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                PilotWardrobe Privacy Policy
              </h1>
              <p className="text-gray-600 mb-8">
                <strong>Last Updated:</strong> January 4, 2026
              </p>

              <div className="space-y-8">
                {/* Introduction */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                  <p className="text-gray-600">
                    At PilotWardrobe, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully.
                  </p>
                </div>

                {/* Information We Collect */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                    <li><strong>Contact Information:</strong> Name, email address, phone number, shipping/billing address</li>
                    <li><strong>Account Information:</strong> Username, password, profile preferences</li>
                    <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely via third-party payment processors)</li>
                    <li><strong>Order Information:</strong> Purchase history, product preferences, sizing information</li>
                    <li><strong>Communications:</strong> Customer service inquiries, feedback, survey responses</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                    <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                    <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
                    <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                    <li><strong>Cookies and Tracking:</strong> See our <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a></li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Information from Third Parties</h3>
                  <p className="text-gray-600">
                    We may receive information from social media platforms, payment processors, and analytics providers when you interact with our services through them.
                  </p>
                </div>

                {/* How We Use Your Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send order confirmations, shipping updates, and invoices</li>
                    <li>Personalize your shopping experience</li>
                    <li>Improve our website, products, and services</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Prevent fraud and enhance security</li>
                    <li>Comply with legal obligations</li>
                    <li>Conduct market research and analysis</li>
                  </ul>
                </div>

                {/* Legal Basis for Processing */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Basis for Processing (GDPR)</h2>
                  <p className="text-gray-600 mb-3">
                    For users in the European Economic Area (EEA), we process your personal information based on:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><strong>Contract:</strong> To fulfill our contractual obligations to you</li>
                    <li><strong>Consent:</strong> Where you have given clear consent</li>
                    <li><strong>Legitimate Interests:</strong> For business purposes that don't override your rights</li>
                    <li><strong>Legal Obligations:</strong> To comply with legal requirements</li>
                  </ul>
                </div>

                {/* Data Sharing */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
                  <p className="text-gray-600 mb-3">
                    We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><strong>Service Providers:</strong> Payment processors, shipping carriers, IT services</li>
                    <li><strong>Business Partners:</strong> For co-branded offerings or promotions</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    We never sell your personal information to third parties.
                  </p>
                </div>

                {/* Data Security */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                  <p className="text-gray-600 mb-3">
                    We implement appropriate technical and organizational security measures to protect your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>256-bit SSL encryption for all data transmissions</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Access controls and authentication procedures</li>
                    <li>Secure data centers with 24/7 monitoring</li>
                    <li>Regular security training for our staff</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    While we strive to protect your information, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                {/* Data Retention */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
                  <p className="text-gray-600">
                    We retain your personal information only for as long as necessary to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                    <li>Fulfill the purposes outlined in this policy</li>
                    <li>Comply with legal obligations (e.g., tax records: 7 years)</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Maintain business records</li>
                  </ul>
                </div>

                {/* Your Rights */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                  <p className="text-gray-600 mb-3">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><strong>Access:</strong> Request copies of your personal information</li>
                    <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                    <li><strong>Restriction:</strong> Request restriction of processing</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another organization</li>
                    <li><strong>Objection:</strong> Object to processing of your personal information</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    To exercise these rights, contact us at privacy@pilotwardrobe.com.
                  </p>
                </div>

                {/* International Transfers */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                  <p className="text-gray-600">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                    <li>EU Standard Contractual Clauses</li>
                    <li>Privacy Shield certification (where applicable)</li>
                    <li>Binding Corporate Rules</li>
                  </ul>
                </div>

                {/* Children's Privacy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                  <p className="text-gray-600">
                    Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                  </p>
                </div>

                {/* Changes to Policy */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                  <p className="text-gray-600">
                    We may update this Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. You are advised to review this policy periodically.
                  </p>
                </div>

                {/* Contact */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-600 mb-3">
                    If you have questions about this Privacy Policy, please contact our Data Protection Officer:
                  </p>
                  <ul className="list-none pl-0 text-gray-600 space-y-2">
                    <li><strong>Email:</strong> privacy@pilotwardrobe.com</li>
                    <li><strong>Address:</strong> 123 Aviation Way, Suite 500, Wilmington, DE 19801, USA</li>
                    <li><strong>Phone:</strong> +234 907 793 7546</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    You also have the right to lodge a complaint with your local data protection authority.
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

export default PrivacyPolicy;