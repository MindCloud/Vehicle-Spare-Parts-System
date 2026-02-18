import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { MapPin, Phone, Store } from "lucide-react";

export default function Shops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      const snapshot = await getDocs(collection(db, "sellers"));
      setShops(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((s) => s.verified === true),
      );
    };
    fetchShops();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-6">Verified Seller Shops</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            to={`/shops/${shop.id}`}
            className="bg-white shadow rounded-xl p-5 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <Store className="text-blue-600" />
              <h3 className="text-xl font-bold">{shop.shopName}</h3>
            </div>

            <p className="text-gray-600 mb-3">{shop.shopDescription}</p>

            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} />
              {shop.shopLocation}
            </div>

            <div className="flex items-center gap-2 text-sm mt-1">
              <Phone size={16} />
              {shop.contactNumber}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
