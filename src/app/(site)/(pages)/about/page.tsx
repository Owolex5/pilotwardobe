import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PilotWardrobe | Trusted Marketplace for Pre-Owned Aviation Gear",
  description:
    "Founded by Captain Ayeni James, PilotWardrobe connects pilots worldwide to buy, sell, and swap premium aviation gear safely and affordably.",
  openGraph: {
    title: "About PilotWardrobe",
    description: "The trusted community marketplace for pilots' headsets, watches, flight bags, and more.",
    images: ["/images/about-og.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Modern Hero Section: Split Layout (Reduces image dominance) */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Content */}
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide uppercase mb-6 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                The Aviator's Marketplace
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-slate-900">
                Elevate Your Gear. <br />
                <span className="text-black bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Connect the Cockpit.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                PilotWardrobe is the trusted community where pilots buy, sell, and swap premium aviation gear. Safe, affordable, and built by pilots, for pilots.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="px-8 py-4 bg-blue-600 text-blue font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  Explore Marketplace
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link
                  href="/sell"
                  className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  Sell Your Gear
                </Link>
              </div>
            </div>

            {/* Visual Content - Reduced size compared to full screen */}
            <div className="lg:w-1/2 order-1 lg:order-2 relative">
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square max-h-[600px] w-full ml-auto">
                {/* Decorative background blotch */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] -z-10 blur-xl opacity-70"></div>
                
                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/images/pward/atxa.jpeg"
                    alt="Pilot using PilotWardrobe"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Floating Badge */}
                  <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-[200px] border border-white/50 hidden md:block animate-fade-in-up">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Savings</p>
                    <p className="text-2xl font-bold text-slate-900">$1.2M+</p>
                    <p className="text-xs text-slate-500">Saved by pilots globally</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators / Stats (New Content) */}
      <section className="py-12 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900">5k+</p>
              <p className="text-sm text-slate-500 font-medium">Verified Pilots</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">120+</p>
              <p className="text-sm text-slate-500 font-medium">Countries</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">98%</p>
              <p className="text-sm text-slate-500 font-medium">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">Verified</p>
              <p className="text-sm text-slate-500 font-medium">Secure Payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Founder Story - Clean "Letter" Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 border border-slate-100 relative overflow-hidden">
            {/* Background Icon */}
            <svg className="absolute top-10 right-10 w-64 h-64 text-slate-200/50 -rotate-12 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                From the Flight Deck
              </h2>
              
              <div className="prose prose-lg prose-slate text-slate-600 leading-relaxed">
                <p className="mb-6">
                  "I founded PilotWardrobe after 8 years in the cockpit, flying everything from regional turboprops to international wide-bodies. I noticed a recurring pattern among my colleagues: we all had premium gear sitting in our closets gathering dust."
                </p>
                <p className="mb-6">
                  "Pilots invest thousands in headsets, watches, and flight bags, only to upgrade later. I realized there had to be a better way to circulate this high-quality equipment within our community—safely and affordably."
                </p>
                <p>
                  "PilotWardrobe isn't just a store; it's a community solution. We verify users, ensure fair pricing, and help student pilots get the gear they need without breaking the bank. Welcome aboard."
                </p>
              </div>

              <div className="mt-12 flex items-center gap-6">
                {/* <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden relative">
                   <Image src="/images/founder-thumb.jpg" alt="Captain Ayeni" fill className="object-cover" />
                </div> */}
                <div>
                  <p className="font-bold text-slate-900 text-lg">Captain Ayeni James</p>
                  <p className="text-blue-600 font-medium">Founder & Commercial Pilot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (New Content) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg">Simple, secure, and designed for aviation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 relative group hover:-translate-y-2 transition duration-300">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">List Your Gear</h3>
              <p className="text-slate-500 leading-relaxed px-4">Upload photos and details of your pre-owned aviation equipment in minutes.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 relative group hover:-translate-y-2 transition duration-300">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Connect & Verify</h3>
              <p className="text-slate-500 leading-relaxed px-4">Chat directly with verified pilots. Ask questions and negotiate safely.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 relative group hover:-translate-y-2 transition duration-300">
                <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Fly with Confidence</h3>
              <p className="text-slate-500 leading-relaxed px-4">Ship the gear, get paid, and enjoy premium equipment at a fraction of the cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Values / Why Us - Clean Cards */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">
            Why Pilots Trust PilotWardrobe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Fair Pricing</h3>
              <p className="text-slate-600 leading-relaxed">Access premium pre-owned gear at 40-70% off retail prices without compromising on safety or quality.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Pilot Verified</h3>
              <p className="text-slate-600 leading-relaxed">Every seller is a real pilot. We prioritize community trust, so you know exactly who you're buying from.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100">
               <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 text-teal-600">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Community Focused</h3>
              <p className="text-slate-600 leading-relaxed">We are more than a marketplace. We are a network of aviation professionals supporting each other.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Compact Gear Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Equipping The Next Generation
          </h2>
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <Image
              src="/images/pward/bagss.jpg" 
              alt="Premium aviation gear"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
          </div>
        </div>
      </section>

      {/* 7. Modern CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-blue max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready for Takeoff?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Join thousands of pilots trading smarter. Whether you're upgrading or just starting out, your next piece of gear is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-10 py-5 bg-blue-600 text font-bold text-lg rounded-2xl hover:bg-blue-500 transition shadow-lg shadow-blue-900/50"
            >
              Start Shopping
            </Link>
            <Link
              href="/sell"
              className="px-10 py-5 bg-white/10 text-blue font-bold text-lg rounded-2xl border border-white/10 hover:bg-white/20 transition backdrop-blur-sm"
            >
              List Your Gear
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}