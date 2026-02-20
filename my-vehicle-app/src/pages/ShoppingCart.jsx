import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart as CartIcon,
  ArrowRight,
} from "lucide-react";
import CarEngineModel from "../components/Models/CarEngineModel";
import OffroadTiresModel from "../components/Models/OffroadTiresModel";

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await fetchCart(user.uid);
      } catch (err) {
        console.error("Auth/cart fetch error:", err);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCart = async (uid) => {
    const ref = doc(db, "carts", uid); // ← note: you used "carts" here (plural)
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      const items = Array.isArray(data?.items) ? data.items : [];
      setCart(items);
    } else {
      setCart([]);
    }
  };

  const updateCart = async (newItems) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(
        doc(db, "carts", user.uid),
        {
          userId: user.uid,
          items: newItems,
          updatedAt: new Date(),
        },
        { merge: true },
      );
      setCart(newItems);
    } catch (err) {
      console.error("Failed to update cart:", err);
      alert("Could not update cart. Please try again.");
    }
  };

  const increaseQty = (partId) => {
    const updated = cart.map((item) =>
      item.partId === partId ? { ...item, qty: item.qty + 1 } : item,
    );
    updateCart(updated);
  };

  const decreaseQty = (partId) => {
    const updated = cart
      .map((item) =>
        item.partId === partId ? { ...item, qty: item.qty - 1 } : item,
      )
      .filter((item) => item.qty > 0);
    updateCart(updated);
  };

  const removeItem = (partId) => {
    const updated = cart.filter((item) => item.partId !== partId);
    updateCart(updated);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0,
  );

  const placeOrder = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in to place an order");
    if (cart.length === 0) return alert("Your cart is empty");

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: user.displayName || "Customer",
        userEmail: user.email,
        shopId: cart[0]?.shopId,
        items: cart,
        subtotal,
        status: "pending",
        createdAt: new Date(),
      });

      await setDoc(
        doc(db, "carts", user.uid),
        { items: [], updatedAt: new Date() },
        { merge: true },
      );

      setCart([]);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <p className="text-red-600 text-xl font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header with Models */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white overflow-hidden pb-16 pt-12">
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            {/* Left: Engine Model */}
            <div className="hidden lg:block rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-gray-900/70 backdrop-blur-md h-[420px] xl:h-[480px]">
              <CarEngineModel />
            </div>

            {/* Center: Title & Subtitle */}
            <div className="text-center lg:col-span-1 space-y-6">
              <div className="inline-flex items-center justify-center gap-4 mb-4">
                <CartIcon className="h-12 w-12 text-indigo-400" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl">
                  Your Shopping Cart
                </h1>
              </div>
              <p className="text-xl text-indigo-200 max-w-3xl mx-auto drop-shadow-md">
                Review your selected spare parts, adjust quantities, and proceed
                to secure checkout.
              </p>

              {cart.length > 0 && (
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-indigo-400/40 shadow-lg mt-4">
                  <span className="font-semibold text-lg">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                  <span className="text-indigo-300">•</span>
                  <span className="font-bold text-xl text-orange-300">
                    LKR {subtotal.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Tires Model */}
            <div className="hidden lg:block rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-gray-900/70 backdrop-blur-md h-[420px] xl:h-[480px]">
              <OffroadTiresModel />
            </div>
          </div>
        </div>
      </section>

      {/* Main Cart Content */}
      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 lg:p-16 text-center border border-gray-200 max-w-4xl mx-auto">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Looks like you haven’t added any spare parts yet. Start
                  exploring our verified sellers!
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  Browse Spare Parts <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items - Left/Middle */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.partId}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
                      <img
                        src={
                          item.imageUrl ||
                          "https://via.placeholder.com/140?text=Part"
                        }
                        alt={item.name || "Spare Part"}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/140?text=No+Image";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 truncate">
                          {item.name || "Unnamed Part"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          From: {item.shopName || "Verified Seller"}
                        </p>
                        <p className="text-2xl font-bold text-indigo-700 mt-3">
                          LKR{" "}
                          {(
                            (item.price || 0) * (item.qty || 1)
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                          <button
                            onClick={() => decreaseQty(item.partId)}
                            className="px-5 py-3 hover:bg-gray-200 transition disabled:opacity-50"
                            disabled={item.qty <= 1}
                          >
                            <Minus className="h-5 w-5 text-gray-700" />
                          </button>
                          <span className="px-8 py-3 font-semibold text-xl min-w-[4rem] text-center">
                            {item.qty || 1}
                          </span>
                          <button
                            onClick={() => increaseQty(item.partId)}
                            className="px-5 py-3 hover:bg-gray-200 transition"
                          >
                            <Plus className="h-5 w-5 text-gray-700" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.partId)}
                          className="p-4 text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Remove from cart"
                        >
                          <Trash2 className="h-7 w-7" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary - Right Column */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CartIcon className="h-8 w-8 text-indigo-600" /> Order
                    Summary
                  </h2>

                  <div className="space-y-5 mb-8 text-gray-700 text-lg">
                    <div className="flex justify-between">
                      <span>
                        Subtotal ({cart.length}{" "}
                        {cart.length === 1 ? "item" : "items"})
                      </span>
                      <span className="font-semibold">
                        LKR {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="text-green-600 font-medium">
                        Calculated at checkout
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-5 mt-3">
                      <div className="flex justify-between text-2xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>LKR {subtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-5 rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 text-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={cart.length === 0}
                  >
                    Place Order <ArrowRight className="h-6 w-6" />
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-5">
                    Secure checkout • Fast local delivery in Negombo & Western
                    Province
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
