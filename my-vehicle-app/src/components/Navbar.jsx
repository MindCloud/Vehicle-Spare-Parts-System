import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false); // dropdown

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setCartCount(0);
        return;
      }

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) setUser(snap.data());

      const cartRef = doc(db, "cart", currentUser.uid);
      onSnapshot(cartRef, (cartSnap) => {
        if (cartSnap.exists()) {
          const items = cartSnap.data().items || [];
          const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
          setCartCount(totalQty);
        } else setCartCount(0);
      });
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    nav("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">AutoParts Hub</h1>

      <div className="flex items-center space-x-4 relative">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/shops">Shops</Link>
        <Link to="/contact">Contact</Link>

        {user?.role === "admin" && (
          <Link to="/dashboard" className="bg-yellow-600 px-3 py-1 rounded">
            Admin
          </Link>
        )}

        {/* Cart */}
        {user?.role === "customer" && (
          <button onClick={() => nav("/cart")} className="relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {!user && (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded">
            Login
          </Link>
        )}

        {/* Profile */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User size={16} />
                </div>
              )}
              <span className="text-sm">{user.username}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow">
                <button
                  onClick={() => {
                    nav("/orders");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  My Orders
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
