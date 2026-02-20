import { useState } from "react";
import BmwM3E30Model from "../components/Models/BmwM3E30Model";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app: send to backend / email service (e.g. EmailJS, Firebase)
    setSubmitted(true);
    setTimeout(() => {
      setForm({ name: "", email: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with 3D Model */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl">
                Get in <span className="text-orange-400">Touch</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Questions about parts, orders, or partnerships? Our team in
                Negombo is here to help. Drop us a message — we usually reply
                within 24 hours.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 pt-6">
                <div className="flex items-center gap-4">
                  <MapPinIcon className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="font-medium">Negombo, Sri Lanka</p>
                    <p className="text-sm text-gray-400">Western Province</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <PhoneIcon className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="font-medium">Hotline</p>
                    <p className="text-sm text-gray-400">Mon–Sat 9AM–6PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <EnvelopeIcon className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-400">
                      support@autopartshub.lk
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3D Model */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-orange-500/40 bg-gray-900/70 backdrop-blur-md">
              <BmwM3E30Model />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Send Us a Message
            </h2>
            <p className="text-gray-600 text-center mb-10">
              Whether it's a part inquiry, feedback, or seller question — we're
              ready to assist.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <PaperAirplaneIcon className="h-16 w-16 mx-auto text-green-600 mb-4 animate-bounce" />
                <h3 className="text-2xl font-semibold text-green-700">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mt-2">
                  We'll get back to you very soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
