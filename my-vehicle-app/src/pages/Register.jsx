import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  MapPin,
  Store,
  FileText,
  Globe,
  Loader2,
  User,
  ShieldCheck,
} from "lucide-react";
import JeepWrangler392Model from "../components/Models/JeepWrangler392Model";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    shopName: "",
    shopDescription: "",
    shopLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.role) {
      setError("Please fill all required fields (Email, Password, Role)");
      return;
    }

    if (form.role === "seller" && (!form.shopName || !form.shopLocation)) {
      setError("Shop Name and Location are required for sellers");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password,
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        username: form.username.trim() || form.email.split("@")[0],
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        role: form.role,
        createdAt: new Date(),
      });

      if (form.role === "seller") {
        await setDoc(doc(db, "sellers", uid), {
          shopName: form.shopName.trim(),
          shopDescription: form.shopDescription.trim(),
          shopLocation: form.shopLocation.trim(),
          contactNumber: form.phone.trim(),
          verified: false,
          ownerUid: uid,
          createdAt: new Date(),
        });
      }

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered"
          : err.code === "auth/weak-password"
            ? "Password should be at least 6 characters"
            : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* LEFT: 3D Model Section – hidden on mobile */}
        <div className="relative hidden lg:block overflow-hidden">
          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40 z-10"></div>

          {/* Full-height 3D model */}
          <div className="absolute inset-0">
            <JeepWrangler392Model />
          </div>

          {/* Brand overlay text on model */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-8">
            <div className="text-center max-w-xl">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white/90 drop-shadow-2xl tracking-tight opacity-85">
                AutoParts Hub
              </h1>
              <p className="mt-5 text-xl lg:text-2xl text-indigo-200/90 font-medium drop-shadow-lg">
                Connect • Buy • Sell • Drive with Confidence
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Registration Form Section */}
        <div className="relative z-10 flex items-center justify-center px-5 sm:px-8 lg:px-12 py-12 lg:py-0 bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
          <div className="w-full max-w-lg">
            {/* Mobile-only branding */}
            <div className="lg:hidden text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Join AutoParts Hub
              </h1>
              <p className="mt-3 text-lg text-indigo-200/90">
                Create your account today
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-8 lg:p-10 space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                  Create Your Account
                </h2>
                <p className="mt-2 text-gray-300">
                  Start your journey with quality spare parts today
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                {/* ── Personal Information ── */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                    <User className="h-5 w-5" /> Personal Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Username
                      </label>
                      <input
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                        placeholder="Your display name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Security ── */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" /> Account Security
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Password
                      </label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Contact & Address ── */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                    <Phone className="h-5 w-5" /> Contact & Location
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+94 77 123 4567"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Address
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="Street, City, Negombo"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Role Selection ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5">
                    Account Type
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  >
                    <option value="" className="bg-gray-900">
                      Choose your role
                    </option>
                    <option value="customer" className="bg-gray-900">
                      Customer – Buy spare parts
                    </option>
                    <option value="seller" className="bg-gray-900">
                      Seller – List & sell parts
                    </option>
                  </select>
                </div>

                {/* ── Seller Fields ── */}
                {form.role === "seller" && (
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                      <Store className="h-5 w-5" /> Shop Information
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                          <Store className="h-4 w-4" /> Shop Name
                        </label>
                        <input
                          value={form.shopName}
                          onChange={(e) =>
                            setForm({ ...form, shopName: e.target.value })
                          }
                          placeholder="e.g. AutoZone Negombo"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                          <Globe className="h-4 w-4" /> Shop Location
                        </label>
                        <input
                          value={form.shopLocation}
                          onChange={(e) =>
                            setForm({ ...form, shopLocation: e.target.value })
                          }
                          placeholder="e.g. Negombo, Katunayake"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Shop Description
                      </label>
                      <textarea
                        value={form.shopDescription}
                        onChange={(e) =>
                          setForm({ ...form, shopDescription: e.target.value })
                        }
                        placeholder="Tell customers about your shop, services, and specialties..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="text-center text-sm text-gray-300 pt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-10">
              © {new Date().getFullYear()} AutoParts Hub • Negombo, Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
