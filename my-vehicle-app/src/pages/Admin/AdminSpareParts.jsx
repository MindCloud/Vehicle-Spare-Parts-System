// src/pages/AdminSpareParts.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminSpareParts() {
  const [shops, setShops] = useState([]);
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    shopId: "",
    name: "",
    description: "",
    stock: 0,
    location: "",
    imageUrl: "",
    price: 0,
  });

  useEffect(() => {
    fetchShops();
    fetchParts();
  }, []);

  const fetchShops = async () => {
    const snapshot = await getDocs(collection(db, "sellers"));
    setShops(
      snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((shop) => shop.verified === true),
    );
  };

  const fetchParts = async () => {
    const snapshot = await getDocs(collection(db, "spareParts"));
    setParts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.shopId || !form.name || !form.imageUrl)
      return alert("Required fields missing");

    await addDoc(collection(db, "spareParts"), {
      ...form,
      createdAt: new Date(),
    });

    alert("Spare part added!");
    setForm({
      shopId: "",
      name: "",
      description: "",
      stock: 0,
      location: "",
      imageUrl: "",
      price: 0,
    });

    fetchParts();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Spare Parts</h2>

      {/* FORM */}
      <form
        className="bg-white p-4 rounded shadow space-y-3 mb-6"
        onSubmit={submit}
      >
        <select
          value={form.shopId}
          onChange={(e) => setForm({ ...form, shopId: e.target.value })}
          className="input w-full"
        >
          <option value="">Select Shop</option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shopName}
            </option>
          ))}
        </select>

        <input
          className="input w-full"
          placeholder="Spare Part Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          className="input w-full"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />

        <input
          className="input w-full"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          className="input w-full"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <input
          type="number"
          className="input w-full"
          placeholder="Price (LKR)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Add Spare Part
        </button>
      </form>

      {/* TABLE */}
      <h2 className="text-xl font-bold mb-2">All Spare Parts</h2>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Image</th>
            <th>Name</th>
            <th>Shop</th>
            <th>Stock</th>
            <th>Location</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => {
            const shop = shops.find((s) => s.id === p.shopId);
            return (
              <tr key={p.id} className="border-b text-center">
                <td className="p-2">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-16 w-16 object-cover mx-auto rounded"
                  />
                </td>
                <td>{p.name}</td>
                <td>{shop?.shopName || "Unknown"}</td>
                <td>{p.stock}</td>
                <td>{p.location}</td>
                <td>LKR {p.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Shop: John Auto Parts
// Name: Toyota Oil Filter
// Description: Genuine oil filter for Toyota Corolla
// Stock: 25
// Location: Colombo
// Image URL: https://images.unsplash.com/photo-1607860108855-64acf2078b44

// Shop: Lanka Motors
// Name: Honda Brake Pads
// Description: Front brake pads for Honda Civic
// Stock: 40
// Location: Kandy
// Image URL: https://images.unsplash.com/photo-1617821076761-bcf27d41d8d5

// Shop: City Spare Hub
// Name: Engine Air Filter
// Description: Universal air filter
// Stock: 15
// Location: Galle
// Image URL: https://images.unsplash.com/photo-1617791160536-598cf32026fb
