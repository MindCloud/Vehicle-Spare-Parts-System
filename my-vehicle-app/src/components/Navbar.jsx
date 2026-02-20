import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { ShoppingCart, User, LogOut, Package, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [hasPendingOrders, setHasPendingOrders] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setCartCount(0);
        setHasPendingOrders(false);
        return;
      }

      // User profile
      const userRef = doc(db, "users", currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setUser(snap.data());
        }
      });

      // Cart count
      const cartRef = doc(db, "carts", currentUser.uid);
      const unsubscribeCart = onSnapshot(cartRef, (snap) => {
        if (snap.exists()) {
          const items = snap.data().items || [];
          const total = items.reduce((sum, i) => sum + (i.qty || 0), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      });

      // Pending orders indicator (boolean — just existence)
      const pendingQuery = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        where("status", "==", "pending"),
      );

      const unsubscribePending = onSnapshot(pendingQuery, (snap) => {
        setHasPendingOrders(snap.size > 0);
      });

      return () => {
        unsubscribeUser();
        unsubscribeCart();
        unsubscribePending();
      };
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCartCount(0);
      setHasPendingOrders(false);
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-gray-950 to-black text-white shadow-lg backdrop-blur-md border-b border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all">
              AutoParts Hub
            </span>
          </Link>

          <div className="flex items-center gap-6 md:gap-8">
            {/* Main Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                to="/shops"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Shops
              </Link>
              <Link
                to="/contact"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Contact
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:from-yellow-500 hover:to-amber-500 transition-all shadow-md"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* Cart */}
            {user?.role === "customer" && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-5 flex items-center justify-center px-1.5 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Login (guest) */}
            {!user && (
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 rounded-lg text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md"
              >
                Login
              </Link>
            )}

            {/* User Profile with Pending Orders Indicator */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="relative flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                  aria-expanded={open}
                >
                  {/* Avatar */}
                  {user.photoURL ? (
                    <div className="relative">
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/50 shadow-sm"
                      />
                      {hasPendingOrders && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-gray-950 shadow-sm"></span>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center shadow-sm">
                      <User className="h-5 w-5 text-white" />
                      {hasPendingOrders && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-gray-950 shadow-sm"></span>
                      )}
                    </div>
                  )}

                  {/* Username + Chevron (hidden on mobile) */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="font-medium text-sm">
                      {user.username || "Account"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {open && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-gray-900 border border-gray-700/70 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md overflow-hidden z-50 transform transition-all duration-200 origin-top-right">
                    <div className="py-1">
                      <div className="px-5 py-4 border-b border-gray-800">
                        <p className="text-base font-semibold text-white truncate">
                          {user.username || "My Account"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user.email || "Signed in"}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/orders");
                          setOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-5 py-3.5 text-sm text-gray-200 hover:bg-indigo-900/50 hover:text-indigo-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5" />
                          <span>My Orders</span>
                        </div>
                        {hasPendingOrders && (
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        )}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3.5 text-sm text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors border-t border-gray-800"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
