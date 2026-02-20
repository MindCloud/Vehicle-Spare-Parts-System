import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 – Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AutoParts Hub
              </h3>
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-xs">
              Your trusted local platform for genuine vehicle spare parts in
              Negombo and Western Province. Quality, transparency, and fast
              service — every time.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" /> About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shops"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" /> Find Shops
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" /> Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4" /> My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Support & Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Negombo, Western Province</p>
                  <p className="text-sm text-gray-500">Sri Lanka</p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>+94 77 123 4567</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span>support@autopartshub.lk</span>
              </li>
            </ul>
          </div>

          {/* Column 4 – Legal & Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund"
                    className="hover:text-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" /> Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Simple newsletter signup teaser */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Stay Updated
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Get the latest deals and new arrivals
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 px-5 rounded-r-lg transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/70 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {currentYear} AutoParts Hub. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              Made with love in Negombo
            </span>
            <span className="text-gray-600">|</span>
            <Link
              to="/privacy"
              className="hover:text-indigo-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-indigo-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
