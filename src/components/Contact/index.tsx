import React from "react";
import Breadcrumb from "../Common/Breadcrumb";

const Contact = () => {
  return (
    <>
      <Breadcrumb title="Contact Us" pages={["Home", "Contact"]} />

      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-0">
          
          {/* Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold text-blue bg-blue/10 rounded-full">
              Pilot Support
            </span>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-dark mb-6 tracking-tight">
              Let’s Talk Aviation Gear
            </h1>

            <p className="text-lg lg:text-xl text-dark-4 max-w-3xl mx-auto leading-relaxed">
              Whether you’re buying, selling, or upgrading your pilot essentials,
              our team is ready to assist you.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid gap-8 lg:grid-cols-3 mb-20">
            {[
              {
                title: "Call Us",
                desc: "Mon–Fri · 9AM–6PM GST",
                value: "+965 7492 3477",
                href: "tel:+96574923477",
                icon: "📞",
              },
              {
                title: "Email Support",
                desc: "Response within 24 hours",
                value: "support@pilotwardrobe.com",
                href: "mailto:support@pilotwardrobe.com",
                icon: "✉️",
              },
              {
                title: "Our Base",
                desc: "Worldwide shipping",
                value: "Porthacourt, Nigeria",
                icon: "📍",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white/70 backdrop-blur rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition p-8 text-center"
              >
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-dark-4 mb-4">{item.desc}</p>

                {item.href ? (
                  <a
                    href={item.href}
                    className="font-semibold text-blue hover:underline break-all"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-semibold text-dark">{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark text-center mb-12">
              Send Us a Message
            </h2>

            <form className="grid gap-8 md:grid-cols-2">
              {[
                { label: "First Name", placeholder: "John", required: true },
                { label: "Last Name", placeholder: "Smith", required: true },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    {field.label}{" "}
                    {field.required && <span className="text-red">*</span>}
                  </label>
                  <input
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue/20 focus:border-blue transition"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Email Address <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="pilot@email.com"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue/20 focus:border-blue transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+965 1234 5678"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue/20 focus:border-blue transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Subject
                </label>
                <input
                  placeholder="Question about pilot trousers"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue/20 focus:border-blue transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-dark mb-2">
                  Message <span className="text-red">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tell us how we can help you…"
                  className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:ring-4 focus:ring-blue/20 focus:border-blue transition resize-none"
                />
              </div>

              <div className="md:col-span-2 text-center pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-14 py-5 bg-blue text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-dark hover:shadow-2xl transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
