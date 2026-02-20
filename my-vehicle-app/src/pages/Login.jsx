import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import JeepWranglerRubiconModel from "../components/Models/JeepWranglerRubiconModel";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User profile not found. Please contact support.");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // Role-based redirect
      if (userData.role === "admin") {
        navigate("/dashboard");
      } else if (userData.role === "seller") {
        navigate("/seller-dashboard"); // optional
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.code === "auth/wrong-password"
          ? "Incorrect password"
          : err.code === "auth/user-not-found"
            ? "No account found with this email"
            : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* LEFT: 3D Model Section */}
        <div className="relative hidden lg:block overflow-hidden">
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40 z-10"></div>

          {/* 3D Model – full height */}
          <div className="absolute inset-0">
            <JeepWranglerRubiconModel />
          </div>

          {/* Optional brand overlay on model */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="text-center px-8">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white/90 drop-shadow-2xl tracking-tight opacity-80">
                AutoParts Hub
              </h1>
              <p className="mt-4 text-xl text-indigo-200/80 font-medium drop-shadow-lg">
                Quality Spare Parts • Trusted Local Sellers
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Login Form Section */}
        <div className="relative z-10 flex items-center justify-center px-5 sm:px-8 lg:px-12 py-12 lg:py-0 bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Mobile-only logo */}
            <div className="lg:hidden text-center mb-10">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AutoParts Hub
              </h1>
              <p className="mt-2 text-lg text-indigo-200/90">
                Sign in to your account
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-8 lg:p-10 space-y-7">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="mt-2 text-gray-300">
                  Enter your credentials to access your account
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Sign In <LogIn className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="text-center space-y-4 text-sm pt-2">
                <Link
                  to="/forgot-password"
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block"
                >
                  Forgot your password?
                </Link>

                <p className="text-gray-300">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-10">
              © {new Date().getFullYear()} AutoParts Hub • Negombo, Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
