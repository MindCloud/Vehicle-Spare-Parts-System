// LandingPage.jsx (updated with consistent premium styling)
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import CarModel from "../components/Models/CarModel";

import {
  UserCircleIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-200 bg-gray-950">
        Checking session...
      </div>
    );
  if (!authUser)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-200 bg-gray-950">
        Please log in to continue
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-200 bg-gray-950">
        Loading your profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* HERO SECTION */}
      <section
        className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          // Updated to a cleaner, higher-quality neon mechanical parts background
          // (vibrant blue/cyan/purple tones with engine/gears — fits premium auto parts vibe)
          backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000')`,
        }}
      >
        {/* Darker, more elegant overlay with indigo-purple-blue gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/75 to-blue-950/80 backdrop-blur-[3px]"></div>

        <div className="relative container mx-auto px-5 sm:px-6 lg:px-8 py-16 lg:py-24 z-10">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center lg:items-stretch">
            {/* LEFT – Text & Info */}
            <div className="space-y-8 lg:space-y-10 animate-fade-in flex flex-col justify-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl leading-tight">
                  Welcome back,{" "}
                  <span className="text-indigo-400">{profile.username}</span>!
                </h1>
                <p className="mt-5 text-xl sm:text-2xl lg:text-3xl font-semibold text-indigo-200 drop-shadow-xl">
                  Premium Spare Parts for Every Drive
                </p>
                <p className="mt-5 text-lg sm:text-xl italic text-orange-300/90 font-medium drop-shadow-lg">
                  "Engineered Reliability – Parts That Never Let You Down."
                </p>
              </div>

              {/* Profile Card – glassmorphism with stronger contrast */}
              <div className="bg-white/10 backdrop-blur-2xl border border-indigo-500/20 rounded-2xl p-7 lg:p-9 shadow-2xl">
                <div className="space-y-7 text-gray-100 text-base lg:text-lg">
                  <div className="flex items-center gap-5">
                    <UserCircleIcon className="h-9 w-9 text-indigo-400 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-300 block">Role</span>
                      <span className="font-semibold capitalize">
                        {profile.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <PhoneIcon className="h-9 w-9 text-indigo-400 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-gray-300 block">Phone</span>
                      <span className="font-medium">
                        {profile.phone || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <MapPinIcon className="h-9 w-9 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-sm text-gray-300 block">
                        Address
                      </span>
                      <span className="font-medium">
                        {profile.address || "—"}
                      </span>
                    </div>
                  </div>

                  {profile.role === "seller" && (
                    <div className="flex items-center gap-5">
                      <BuildingStorefrontIcon className="h-9 w-9 text-orange-400 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-300 block">
                          Shop
                        </span>
                        <span className="font-semibold">
                          {profile.shopName || "—"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="/shop"
                  className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-indigo-500/40 text-lg"
                >
                  Explore Quality Parts →
                </a>
              </div>
            </div>

            {/* RIGHT – 3D Model Area – neon glow border */}
            <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0 min-h-[500px] lg:min-h-[700px]">
              <div
                className="w-full max-w-4xl lg:max-w-none h-full rounded-3xl overflow-hidden shadow-2xl border border-indigo-600/40 bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-sm relative"
                style={{
                  boxShadow: "0 0 40px rgba(99, 102, 241, 0.25)", // subtle indigo neon glow
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent/40 z-10 pointer-events-none"></div>
                <CarModel />
              </div>

              {/* Floating badge – amber/orange gradient */}
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-10 bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 rounded-full shadow-2xl text-base font-bold text-white border border-orange-400/40 transform rotate-2">
                Genuine Auto Parts
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
