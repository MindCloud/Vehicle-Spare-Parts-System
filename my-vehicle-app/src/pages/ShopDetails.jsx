import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ShoppingCart, MapPin } from "lucide-react";

export default function ShopDetails() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetchShop();
    fetchParts();
  }, []);

  const fetchShop = async () => {
    const snap = await getDoc(doc(db, "sellers", id));
    setShop(snap.data());
  };

  const fetchParts = async () => {
    const snapshot = await getDocs(collection(db, "spareParts"));
    setParts(
      snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.shopId === id),
    );
  };

  const addToCart = async (part) => {
    const user = auth.currentUser;
    if (!user) return alert("Login first");

    const cartRef = doc(db, "cart", user.uid); // 🔥 FIX HERE
    const snap = await getDoc(cartRef);

    let cart = snap.exists() ? snap.data().items : [];

    const existing = cart.find((i) => i.partId === part.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        partId: part.id,
        shopId: part.shopId,
        name: part.name,
        price: part.price,
        qty: 1,
        imageUrl: part.imageUrl,
      });
    }

    await setDoc(cartRef, {
      userId: user.uid,
      items: cart,
      updatedAt: new Date(),
    });

    alert("Added to cart");
  };

  if (!shop) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      {/* Shop Header */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-3xl font-bold">{shop.shopName}</h2>
        <p className="text-gray-600">{shop.shopDescription}</p>
        <div className="flex items-center gap-2 mt-2 text-sm">
          <MapPin size={16} />
          {shop.shopLocation}
        </div>
      </div>

      {/* Parts */}
      <h3 className="text-2xl font-bold mb-4">Available Spare Parts</h3>

      <div className="grid md:grid-cols-4 gap-6">
        {parts.map((p) => (
          <div key={p.id} className="bg-white shadow rounded-xl p-4">
            <img
              src={p.imageUrl}
              className="h-40 w-full object-cover rounded"
            />

            <h4 className="font-bold mt-2">{p.name}</h4>
            <p className="text-sm text-gray-600">{p.description}</p>

            <p className="text-sm mt-1">Stock: {p.stock}</p>
            <p className="font-bold text-blue-600">LKR {p.price}</p>

            <button
              onClick={() => addToCart(p)}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
