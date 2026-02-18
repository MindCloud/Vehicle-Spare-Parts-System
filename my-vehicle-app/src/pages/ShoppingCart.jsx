import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        fetchCart(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCart = async (uid) => {
    setLoading(true);
    const ref = doc(db, "cart", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setCart(snap.data().items || []);
    setLoading(false);
  };

  const updateCart = async (updatedCart) => {
    const user = auth.currentUser;
    if (!user) return;

    setCart(updatedCart);
    await setDoc(doc(db, "cart", user.uid), {
      userId: user.uid,
      items: updatedCart,
      updatedAt: new Date(),
    });
  };

  const increaseQty = (partId) => {
    const updated = cart.map((i) =>
      i.partId === partId ? { ...i, qty: i.qty + 1 } : i,
    );
    updateCart(updated);
  };

  const decreaseQty = (partId) => {
    const updated = cart
      .map((i) => (i.partId === partId ? { ...i, qty: i.qty - 1 } : i))
      .filter((i) => i.qty > 0); // remove if qty = 0
    updateCart(updated);
  };

  const removeItem = (partId) => {
    const updated = cart.filter((i) => i.partId !== partId);
    updateCart(updated);
  };

  const total = cart.reduce((t, i) => t + i.price * i.qty, 0);

  const placeOrder = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login first");
    if (cart.length === 0) return alert("Cart is empty");

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      userName: user.displayName || "Customer",
      userEmail: user.email,
      shopId: cart[0].shopId,
      items: cart,
      total,
      status: "pending",
      createdAt: new Date(),
    });

    // CLEAR CART (correct collection)
    await setDoc(doc(db, "cart", user.uid), {
      userId: user.uid,
      items: [],
      updatedAt: new Date(),
    });

    alert("Order placed!");
    navigate("/orders");
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!cart.length) return <p className="p-10">Your cart is empty</p>;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>

      {cart.map((i) => (
        <div
          key={i.partId}
          className="flex gap-4 mb-3 bg-white p-3 shadow rounded items-center"
        >
          <img src={i.imageUrl} className="h-16 w-16 rounded" />

          <div className="flex-1">
            <p className="font-bold">{i.name}</p>
            <p>LKR {i.price * i.qty}</p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => decreaseQty(i.partId)}
                className="bg-gray-200 px-2 rounded"
              >
                -
              </button>
              <span className="px-2">{i.qty}</span>
              <button
                onClick={() => increaseQty(i.partId)}
                className="bg-gray-200 px-2 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeItem(i.partId)}
                className="ml-4 bg-red-600 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <h3 className="text-xl font-bold mt-4">Total: LKR {total}</h3>

      <button
        onClick={placeOrder}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}
