// src/app/faq/page.tsx
"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { ChevronDown, ChevronUp, MessageCircle, Shield, CreditCard, Truck, RefreshCw, UserCheck } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "Pilot Verification",
      icon: <UserCheck className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      questions: [
        {
          q: "What is pilot verification and why is it required?",
          a: "Pilot verification is a security process that confirms you are a licensed pilot. It's required to access premium features, sell items, and build trust within our community of aviation professionals."
        },
        {
          q: "How long does verification take?",
          a: "Typically 24-48 hours. Our team manually reviews each application. You'll receive an email notification once verified."
        },
        {
          q: "What documents do I need for verification?",
          a: "Valid pilot license, government-issued ID, and a clear facial photo. We accept licenses from ICAO member states."
        },
        {
          q: "Is my personal information secure?",
          a: "Yes. All documents are encrypted and stored securely. We comply with GDPR and only share verification status, not personal documents."
        }
      ]
    },
    {
      title: "Ordering & Payment",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept Visa, MasterCard, American Express, PayPal, and bank transfers for orders over $500."
        },
        {
          q: "Are prices shown in USD?",
          a: "Yes, all prices are in USD. You'll see local currency estimates at checkout based on current exchange rates."
        },
        {
          q: "Do you offer payment plans?",
          a: "Yes, we offer 3-6 month payment plans through Affirm for orders over $300."
        },
        {
          q: "Can I modify my order after placing it?",
          a: "You can modify your order within 1 hour of placement by contacting customer service."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: <Truck className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      questions: [
        {
          q: "How long does shipping take?",
          a: "USA: 3-7 days, International: 5-14 days. Express shipping options available."
        },
        {
          q: "Do you ship to APO/FPO addresses?",
          a: "Yes! We offer special rates for military personnel and support APO/FPO shipping worldwide."
        },
        {
          q: "Can I track my order?",
          a: "Yes, you'll receive tracking information via email once your order ships. You can also track from your account dashboard."
        },
        {
          q: "Do you offer international shipping?",
          a: "Yes, we ship to over 100 countries. Customs duties are the customer's responsibility."
        }
      ]
    },
    {
      title: "Returns & Warranty",
      icon: <RefreshCw className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      questions: [
        {
          q: "What's your return policy?",
          a: "30-day return policy for unused items in original condition. Custom items are final sale."
        },
        {
          q: "Are pre-owned items covered by warranty?",
          a: "Yes, all items come with a 90-day functionality warranty. Official PilotWardrobe items have 1-year extended warranty."
        },
        {
          q: "What if an item doesn't fit?",
          a: "We offer free exchanges for sizing issues within 30 days. Use our AI size recommender for best results."
        },
        {
          q: "How long do refunds take?",
          a: "Refunds process within 5-10 business days after we receive and inspect the return."
        }
      ]
    },
    {
      title: "Security & Trust",
      icon: <Shield className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      questions: [
        {
          q: "How do you verify sellers?",
          a: "All sellers undergo pilot verification. We also require proof of ownership and condition verification before listing."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use 256-bit SSL encryption and never store credit card information. Payments are processed via PCI-DSS compliant providers."
        },
        {
          q: "What if I receive a counterfeit item?",
          a: "We offer a 100% authenticity guarantee. Report suspected counterfeits within 7 days for a full refund and investigation."
        },
        {
          q: "How do you handle data privacy?",
          a: "We comply with GDPR, CCPA, and other privacy regulations. View our Privacy Policy for details."
        }
      ]
    },
    {
      title: "Community & Support",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      questions: [
        {
          q: "How can I sell my uniform?",
          a: "Once verified, you can list items in your dashboard. We handle authentication, photography, and shipping for a 15% commission."
        },
        {
          q: "Do you offer bulk discounts for flight schools?",
          a: "Yes, contact our enterprise team for custom quotes on bulk orders for flight schools and airlines."
        },
        {
          q: "Can I trade in my old uniform?",
          a: "Yes! Our trade-in program offers credit toward new purchases. Items must be in good condition."
        },
        {
          q: "How do I contact customer support?",
          a: "Email support@pilotwardrobe.com, call +234 907 793 7546, or use live chat during business hours."
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Breadcrumb title="Frequently Asked Questions" pages={["Home", "FAQ"]} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about PilotWardrobe, from verification to delivery.
              Can't find your answer? <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact our team</a>.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition shadow-sm"
                onChange={(e) => {
                  // Implement search functionality
                  console.log("Search:", e.target.value);
                }}
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Category Header */}
                <div className={`p-8 ${category.bgColor}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${category.bgColor} ${category.color}`}>
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                      <p className="text-gray-600 mt-1">
                        {category.questions.length} questions in this category
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-100">
                  {category.questions.map((faq, index) => (
                    <div key={index} className="p-8 hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => toggleFAQ(catIndex * 10 + index)}
                        className="flex items-center justify-between w-full text-left group"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors pr-8">
                          {faq.q}
                        </h3>
                        <div className="flex-shrink-0 ml-4">
                          {openIndex === catIndex * 10 + index ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                          )}
                        </div>
                      </button>
                      
                      <div 
                        className={`mt-4 text-gray-600 transition-all duration-300 overflow-hidden ${
                          openIndex === catIndex * 10 + index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p>{faq.a}</p>
                        
                        {/* Additional resources for some answers */}
                        {(catIndex === 0 && index === 0) && (
                          <div className="mt-4">
                            <a 
                              href="/pilot-verification" 
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Start verification process →
                            </a>
                          </div>
                        )}
                        
                        {(catIndex === 1 && index === 0) && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              Visa
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              MasterCard
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              American Express
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              PayPal
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Our pilot support team is available 24/7 to help with any questions about uniforms, verification, or orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-4 bg-blue-600 text-blue font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg"
                >
                  Contact Support
                </a>
                <a
                  href="tel:+15551234567"
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
                >
                  Call +234 907 793 7546
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;