import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

export default function LandingPage() {
  const { user: authUser, loading } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!authUser) return;

    const load = async () => {
      const ref = doc(db, "users", authUser.uid);
      const snap = await getDoc(ref);
      setProfile(snap.data());
    };

    load();
  }, [authUser]);

  if (loading) return "Checking session...";
  if (!authUser) return "Not logged in";
  if (!profile) return "Loading profile...";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {profile.username} 👋</h1>

      <p>Role: {profile.role}</p>
      <p>Phone: {profile.phone}</p>
      <p>Address: {profile.address}</p>

      {profile.role === "seller" && <p>Shop: {profile.shopName}</p>}
    </div>
  );
}
