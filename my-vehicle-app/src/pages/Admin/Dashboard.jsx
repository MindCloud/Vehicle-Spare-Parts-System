// src/pages/Admin/Dashboard.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

import AdminSidebar from "../../components/AdminSidebar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchUser = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUser(docSnap.data());
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6 bg-gray-100">
        {/* Render nested admin pages here */}
        <Outlet />
      </div>
    </div>
  );
}
