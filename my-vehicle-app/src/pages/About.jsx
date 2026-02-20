// src/pages/About.jsx
import DefenderModel from "../components/Models/DefenderModel";
import BoxerEngineModel from "../components/Models/BoxerEngineModel";
import {
  ShieldCheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION - Defender Model focused */}
      <section className="relative bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
        {/* Background subtle texture/pattern */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600')",
          }}
        ></div>

        {/* Darker overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative container mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text + Stats */}
            <div className="space-y-10">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight drop-shadow-2xl leading-tight">
                  About <span className="text-indigo-400">AutoParts Hub</span>
                </h1>
                <p className="mt-6 text-xl sm:text-2xl lg:text-3xl font-medium text-indigo-200 drop-shadow-lg">
                  Your Trusted Local Source for Genuine Vehicle Spare Parts
                </p>
              </div>

              <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-3xl">
                We connect vehicle owners with verified local sellers offering
                high-quality, compatible spare parts at fair prices — making
                repairs, maintenance, and upgrades simple, fast, and reliable.
              </p>

              {/* Stats with icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                <div className="text-center">
                  <UserGroupIcon className="h-10 w-10 mx-auto text-indigo-400 mb-3" />
                  <p className="text-3xl font-bold">5,000+</p>
                  <p className="text-sm text-gray-300">Happy Customers</p>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon className="h-10 w-10 mx-auto text-indigo-400 mb-3" />
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm text-gray-300">Verified Sellers</p>
                </div>
                <div className="text-center">
                  <TruckIcon className="h-10 w-10 mx-auto text-indigo-400 mb-3" />
                  <p className="text-3xl font-bold">Negombo & Beyond</p>
                  <p className="text-sm text-gray-300">Local Delivery</p>
                </div>
                <div className="text-center">
                  <CurrencyDollarIcon className="h-10 w-10 mx-auto text-indigo-400 mb-3" />
                  <p className="text-3xl font-bold">Best Prices</p>
                  <p className="text-sm text-gray-300">Competitive Rates</p>
                </div>
              </div>
            </div>

            {/* Right: Defender Model */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-gray-900/60 backdrop-blur-md h-[500px] lg:h-[650px]">
              <DefenderModel />
              <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-5 py-3 rounded-full text-sm font-medium border border-indigo-500/40">
                Classic Reliability – Defender Style
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED ABOUT SECTION - Engine Model focused */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Quality Parts. Local Trust. Hassle-Free Experience.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At AutoParts Hub, we’re passionate about keeping vehicles on the
              road safely and affordably — with the right part, at the right
              time, from sellers you can trust.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Engine Model */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-orange-500/30 bg-gray-900/40 backdrop-blur-md h-[500px] lg:h-[620px] order-2 lg:order-1">
              <BoxerEngineModel />
            </div>

            {/* Right: Detailed content + icons */}
            <div className="space-y-10 order-1 lg:order-2">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                  <WrenchScrewdriverIcon className="h-10 w-10 text-orange-600" />
                  Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To simplify the spare parts journey by connecting drivers
                  directly with trusted local sellers — eliminating middlemen,
                  long waits, and uncertainty. We focus on genuine parts,
                  transparent pricing, accurate fitment info, and fast local
                  availability.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                  <ShieldCheckIcon className="h-10 w-10 text-orange-600" />
                  Our Core Values
                </h3>
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-start gap-4">
                    <ShieldCheckIcon className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
                    <span>
                      <strong>Quality First</strong> – Only verified,
                      high-standard parts from reputable sellers
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <TruckIcon className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
                    <span>
                      <strong>Local & Fast</strong> – Support nearby businesses
                      with quick pickup or delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CurrencyDollarIcon className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
                    <span>
                      <strong>Fair Pricing</strong> – No hidden fees,
                      competitive rates you can compare
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <UserGroupIcon className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
                    <span>
                      <strong>Trust & Transparency</strong> – Real photos,
                      seller ratings, and secure platform
                    </span>
                  </li>
                </ul>
              </div>

              {/* Contact teaser */}
              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <EnvelopeIcon className="h-8 w-8 text-indigo-600" />
                  Get in Touch
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <MapPinIcon className="h-7 w-7 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Negombo, Sri Lanka</p>
                      <p className="text-gray-600 text-sm">
                        Serving Western Province & surrounding areas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <PhoneIcon className="h-7 w-7 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Support Hotline</p>
                      <p className="text-gray-600 text-sm">
                        Available Mon–Sat, 9 AM – 6 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA / Closing */}
          <div className="mt-20 text-center">
            <blockquote className="text-2xl lg:text-3xl italic font-medium text-orange-700 max-w-4xl mx-auto drop-shadow-md">
              "Every bolt, every gasket, every drive — backed by parts and
              people you can count on."
            </blockquote>
            <p className="mt-10 text-xl text-gray-700">
              Join thousands of drivers who trust AutoParts Hub. Start browsing
              today.
            </p>
            <a
              href="/shop"
              className="mt-8 inline-flex items-center px-10 py-5 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Browse Spare Parts Now →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
