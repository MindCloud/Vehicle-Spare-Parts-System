// src/pages/ShopDetails.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  ShoppingCart,
  MapPin,
  Phone,
  Star,
  Calendar,
  MessageSquare,
  Search,
  Wrench, // ← Added here
} from "lucide-react";
import LandCruiserModel from "../components/Models/LandCruiserModel";

export default function ShopDetails() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShop();
    fetchParts();
  }, [id]);

  const fetchShop = async () => {
    try {
      const snap = await getDoc(doc(db, "sellers", id));
      if (snap.exists()) {
        setShop(snap.data());
      } else {
        console.error("Shop not found");
      }
    } catch (error) {
      console.error("Error fetching shop:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "spareParts"));
      const partList = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.shopId === id);
      setParts(partList);
      setFilteredParts(partList);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  useEffect(() => {
    const results = parts.filter(
      (part) =>
        part.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredParts(results);
  }, [searchTerm, parts]);

  const addToCart = async (part) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first");

    try {
      const cartRef = doc(db, "carts", user.uid);
      const snap = await getDoc(cartRef);

      let cartItems = snap.exists() ? snap.data().items || [] : [];

      const existingIndex = cartItems.findIndex((i) => i.partId === part.id);

      if (existingIndex !== -1) {
        cartItems[existingIndex].qty += 1;
      } else {
        cartItems.push({
          partId: part.id,
          shopId: part.shopId,
          name: part.name,
          price: part.price,
          qty: 1,
          imageUrl: part.imageUrl,
        });
      }

      await setDoc(
        cartRef,
        {
          userId: user.uid,
          items: cartItems,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  if (loading || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mr-4"></div>
        Loading shop details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Shop Header */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl">
                {shop.shopName}
              </h1>
              <p className="text-xl lg:text-2xl text-indigo-200 drop-shadow-md">
                Your trusted source for genuine vehicle spare parts in Negombo &
                Western Province.
              </p>

              <div className="space-y-5 text-lg">
                <div className="flex items-center gap-4">
                  <MapPin className="h-8 w-8 text-indigo-400" />
                  <span>
                    {shop.shopLocation || "Negombo Area, Western Province"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-8 w-8 text-indigo-400" />
                  <span>{shop.contactNumber || "Contact via platform"}</span>
                </div>
                {shop.establishedYear && (
                  <div className="flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-indigo-400" />
                    <span>Established in {shop.establishedYear}</span>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Star className="h-8 w-8 text-amber-400 fill-current" />
                  <span>4.9 / 5 (Based on 120+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Model */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/40 bg-gray-900/70 backdrop-blur-md">
              <LandCruiserModel />
            </div>
          </div>
        </div>
      </section>

      {/* Shop Description + Parts */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          {/* Shop Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-5 flex items-center gap-4">
              <MessageSquare className="h-9 w-9 text-indigo-600" />
              About This Shop
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {shop.shopDescription ||
                "Specializing in high-quality spare parts for Toyota, Honda, Suzuki, Nissan, and more. We offer genuine OEM parts, trusted aftermarket options, and expert advice for all vehicle types — from sedans to SUVs, vans, and trucks. Fast local delivery and pickup available in Negombo area."}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full font-medium">
                Genuine & OEM Parts
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full font-medium">
                Fast Local Delivery
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full font-medium">
                Expert Fitment Advice
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-full font-medium">
                Competitive Pricing
              </span>
            </div>
          </div>

          {/* Parts Search + Grid */}
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Available Spare Parts
            </h3>
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search parts by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition pl-12 text-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
            </div>
          </div>

          {filteredParts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-md p-12 border border-gray-200">
              <Wrench className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h4 className="text-3xl font-semibold text-gray-800 mb-4">
                No parts found
              </h4>
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                No matching spare parts in this shop right now. Try a different
                search term or check back later — new inventory is added
                regularly.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredParts.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-400 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        p.imageUrl ||
                        "https://via.placeholder.com/400x300?text=Part+Image"
                      }
                      alt={p.name}
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
                      {p.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {p.description ||
                        "High-quality spare part engineered for optimal performance and durability."}
                    </p>

                    <div className="flex items-center justify-between mb-5 text-base">
                      <span className="text-gray-700 font-medium">
                        Stock: {p.stock || "Available"}
                      </span>
                      <span className="text-2xl font-bold text-indigo-700">
                        LKR {Number(p.price).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] text-base"
                      disabled={!auth.currentUser}
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {auth.currentUser ? "Add to Cart" : "Log in to Buy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
