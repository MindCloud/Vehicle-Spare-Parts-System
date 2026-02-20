import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Package,
  Edit,
  Trash2,
  Save,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Truck,
} from "lucide-react";
import FutureCarModel from "../components/Models/FutureCarModel";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchOrders(user.uid);
  }, [navigate]);

  const fetchOrders = async (uid) => {
    setLoading(true);
    setError(null);

    try {
      const ordersCollection = collection(db, "orders");
      const snapshot = await getDocs(ordersCollection);

      const userOrders = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((order) => order.userId === uid);

      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Could not load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "orders", orderId));
      // Re-fetch to update UI
      fetchOrders(auth.currentUser.uid);
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    setEditForm({
      userName: order.userName || "",
      userPhone: order.userPhone || "",
      items: order.items?.map((i) => ({ ...i })) || [],
    });
  };

  const saveChanges = async () => {
    if (!editingId || !auth.currentUser) return;

    try {
      const ref = doc(db, "orders", editingId);
      await updateDoc(ref, {
        userName: editForm.userName.trim(),
        userPhone: editForm.userPhone.trim(),
        items: editForm.items,
        updatedAt: new Date(),
      });

      setEditingId(null);
      setEditForm({});
      fetchOrders(auth.currentUser.uid);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update order. Please try again.");
    }
  };

  const updateItemQuantity = (index, value) => {
    const qty = Math.max(1, Number(value) || 1);
    const newItems = [...editForm.items];
    newItems[index].qty = qty;
    setEditForm({ ...editForm, items: newItems });
  };

  const getStatusDisplay = (status = "pending") => {
    const config = {
      pending: { color: "yellow", icon: Clock, text: "Pending" },
      processing: { color: "blue", icon: Clock, text: "Processing" },
      shipped: { color: "indigo", icon: Truck, text: "Shipped" },
      delivered: { color: "green", icon: CheckCircle, text: "Delivered" },
      cancelled: { color: "red", icon: AlertCircle, text: "Cancelled" },
    };

    const {
      color,
      icon: Icon,
      text,
    } = config[status.toLowerCase()] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-${color}-100 text-${color}-800 border border-${color}-300`}
      >
        <Icon className="h-4 w-4" />
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-12"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative container mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight drop-shadow-2xl leading-tight">
                My <span className="text-indigo-400">Orders</span>
              </h1>
              <p className="text-xl lg:text-2xl text-indigo-200 drop-shadow-md max-w-3xl">
                Manage your spare parts purchases — track status, update
                details, or cancel when needed.
              </p>

              <div className="flex flex-wrap gap-5 pt-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg px-6 py-4 rounded-full border border-indigo-400/30 shadow-lg">
                  <Package className="h-7 w-7 text-indigo-400" />
                  <span className="font-semibold text-lg">
                    {orders.length} Active Orders
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/40 bg-gray-900/70 backdrop-blur-md">
              <FutureCarModel />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-2xl p-12 lg:p-16 text-center border border-gray-200">
              <div className="max-w-lg mx-auto">
                <Package className="h-24 w-24 text-gray-400 mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  No orders found
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  When you place an order for vehicle spare parts, they will
                  appear here.
                </p>
                <button
                  onClick={() => navigate("/shops")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Browse Spare Parts Shops
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.id.slice(-10).toUpperCase()}
                        </h3>
                        {getStatusDisplay(order.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {order.createdAt?.toDate?.()?.toLocaleString() || "—"}
                      </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      {editingId !== order.id ? (
                        <>
                          <button
                            onClick={() => startEdit(order)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition font-medium"
                            disabled={
                              order.status === "cancelled" ||
                              order.status === "delivered"
                            }
                          >
                            <Edit className="h-4 w-4" />
                            Edit Details
                          </button>
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium"
                            disabled={
                              order.status === "cancelled" ||
                              order.status === "delivered"
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Cancel Order
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={saveChanges}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium shadow-sm"
                          >
                            <Save className="h-4 w-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-medium"
                          >
                            <X className="h-4 w-4" />
                            Cancel Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6 lg:p-8">
                    {editingId === order.id ? (
                      <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                              value={editForm.userName}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  userName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Phone
                            </label>
                            <input
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                              value={editForm.userPhone}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  userPhone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                            <ShoppingBag className="h-6 w-6 text-indigo-600" />
                            Order Items
                          </h4>

                          <div className="space-y-5">
                            {editForm.items.map((item, idx) => (
                              <div
                                key={item.partId}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200"
                              >
                                <div className="flex items-center gap-5">
                                  <img
                                    src={
                                      item.imageUrl ||
                                      "https://via.placeholder.com/80?text=Part"
                                    }
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Unit: LKR {item.price.toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <label className="text-sm font-medium text-gray-700">
                                    Quantity:
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                    value={item.qty}
                                    onChange={(e) =>
                                      updateItemQuantity(idx, e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="font-medium text-gray-900">
                              {order.userName || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">
                              {order.userPhone || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Total Amount
                            </p>
                            <p className="text-2xl font-bold text-indigo-700">
                              LKR {order.subtotal?.toLocaleString() || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Items</p>
                            <p className="font-medium text-gray-900">
                              {order.items?.length || 0}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                            <ShoppingBag className="h-6 w-6 text-indigo-600" />
                            Purchased Items
                          </h4>

                          <div className="space-y-5">
                            {order.items?.map((item) => (
                              <div
                                key={item.partId}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 bg-gray-50 rounded-xl border border-gray-200"
                              >
                                <div className="flex items-center gap-5">
                                  <img
                                    src={
                                      item.imageUrl ||
                                      "https://via.placeholder.com/80?text=Part"
                                    }
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {item.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      LKR {item.price.toLocaleString()} ×{" "}
                                      {item.qty}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xl font-bold text-indigo-700">
                                  LKR {(item.price * item.qty).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
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
