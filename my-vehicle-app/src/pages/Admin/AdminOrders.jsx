import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    fetchOrders();
  };

  const removeOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    await deleteDoc(doc(db, "orders", id));
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Total</th>
            <th>Status</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b text-center">
              <td>{o.userName}</td>
              <td>{o.userEmail}</td>
              <td>LKR {o.total}</td>

              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>

              <td className="text-left px-2">
                {o.items.map((i) => (
                  <div key={i.partId}>
                    {i.name} x {i.qty}
                  </div>
                ))}
              </td>

              <td>
                <button
                  onClick={() => removeOrder(o.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
