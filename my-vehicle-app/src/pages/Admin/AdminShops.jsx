// src/pages/AdminShops.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminShops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      const snapshot = await getDocs(collection(db, "sellers"));
      setShops(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchShops();
  }, []);

  const toggleVerify = async (shopId, currentStatus) => {
    const ref = doc(db, "sellers", shopId);
    await updateDoc(ref, {
      verified: !currentStatus,
    });

    setShops((prev) =>
      prev.map((shop) =>
        shop.id === shopId ? { ...shop, verified: !currentStatus } : shop,
      ),
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Shops</h2>

      {shops.length === 0 && (
        <p className="text-gray-500">No sellers registered yet.</p>
      )}

      {shops.map((shop) => (
        <div key={shop.id} className="p-4 bg-white rounded shadow mb-3">
          <h3 className="font-bold text-lg">{shop.shopName}</h3>
          <p>Description: {shop.shopDescription}</p>
          <p>Location: {shop.shopLocation}</p>
          <p>Contact: {shop.contactNumber}</p>

          <p className="mb-2">
            Status:{" "}
            <span className={shop.verified ? "text-green-600" : "text-red-600"}>
              {shop.verified ? "Verified" : "Pending"}
            </span>
          </p>

          <button
            onClick={() => toggleVerify(shop.id, shop.verified)}
            className={`px-3 py-1 rounded text-white ${
              shop.verified ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {shop.verified ? "Unverify" : "Verify"}
          </button>
        </div>
      ))}
    </div>
  );
}
