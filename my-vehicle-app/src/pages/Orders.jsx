import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null); // currently editing order
  const [form, setForm] = useState({}); // form for editing

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((o) => o.userId === auth.currentUser.uid),
    );
  };

  const cancelOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
    fetchOrders();
  };

  const startEditing = (order) => {
    setEditingOrder(order.id);
    setForm({
      items: order.items.map((i) => ({ ...i })), // copy items
      userName: order.userName,
      userPhone: order.userPhone || "",
    });
  };

  const updateOrder = async () => {
    const ref = doc(db, "orders", editingOrder);
    await updateDoc(ref, {
      items: form.items,
      userName: form.userName,
      userPhone: form.userPhone,
    });

    setEditingOrder(null);
    fetchOrders();
  };

  // update quantity in form
  const updateQty = (index, qty) => {
    const newItems = [...form.items];
    newItems[index].qty = Number(qty);
    setForm({ ...form, items: newItems });
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {orders.map((o) => (
        <div key={o.id} className="bg-white p-4 shadow rounded mb-4">
          {editingOrder === o.id ? (
            <div className="space-y-2">
              <input
                className="input w-full"
                placeholder="Name"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
              <input
                className="input w-full"
                placeholder="Phone"
                value={form.userPhone}
                onChange={(e) =>
                  setForm({ ...form, userPhone: e.target.value })
                }
              />

              {form.items.map((i, idx) => (
                <div key={i.partId} className="flex gap-2 items-center">
                  <span className="w-32">{i.name}</span>
                  <input
                    type="number"
                    className="input w-20"
                    value={i.qty}
                    onChange={(e) => updateQty(idx, e.target.value)}
                  />
                </div>
              ))}

              <button
                onClick={updateOrder}
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingOrder(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded mt-2 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p>Status: {o.status}</p>
              <p>Total: LKR {o.total}</p>
              {o.items.map((i) => (
                <p key={i.partId}>
                  {i.name} x {i.qty}
                </p>
              ))}

              <p>Name: {o.userName}</p>
              <p>Phone: {o.userPhone}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => startEditing(o)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => cancelOrder(o.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
