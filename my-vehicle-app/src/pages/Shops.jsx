import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Store,
  Search,
  Star,
  Calendar,
  Wrench,
} from "lucide-react";
import ToyotaLandCruiser300Model from "../components/Models/ToyotaLandCruiser300Model";

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sellers"));
        const shopList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((s) => s.verified === true);
        setShops(shopList);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const locations = useMemo(() => {
    const locSet = new Set(shops.map((s) => s.shopLocation || "Negombo Area"));
    return ["all", ...Array.from(locSet)];
  }, [shops]);

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesSearch =
        searchTerm === "" ||
        shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.shopDescription?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === "all" ||
        shop.shopLocation?.toLowerCase() === selectedLocation.toLowerCase() ||
        (selectedLocation === "negombo area" && !shop.shopLocation);

      return matchesSearch && matchesLocation;
    });
  }, [shops, searchTerm, selectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section - Updated with Toyota Land Cruiser model */}
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
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-2xl">
                Verified{" "}
                <span className="text-indigo-400">Spare Parts Shops</span>
              </h1>
              <p className="text-xl lg:text-2xl text-indigo-200 drop-shadow-md max-w-3xl">
                Connect with trusted local sellers in Negombo and Western
                Province. Genuine vehicle parts, expert advice, and fast
                service.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-indigo-400/30 shadow-lg">
                  <Store className="h-7 w-7 text-indigo-400" />
                  <span className="font-semibold text-lg">
                    {shops.length} Verified Shops
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-indigo-400/30 shadow-lg">
                  <MapPin className="h-7 w-7 text-indigo-400" />
                  <span className="font-semibold text-lg">
                    Western Province Focus
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/40 bg-gray-900/70 backdrop-blur-md">
              <ToyotaLandCruiser300Model />
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Shops Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Search className="h-5 w-5 text-indigo-600" />
                  Search Shops
                </label>
                <input
                  type="text"
                  placeholder="Shop name or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition"
                >
                  {locations.map((loc) => (
                    <option
                      key={loc}
                      value={loc === "all" ? "all" : loc.toLowerCase()}
                    >
                      {loc === "all" ? "All Locations" : loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shops Content */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-2xl text-gray-700">
                Loading verified spare parts shops...
              </p>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md p-10">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No shops found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search or filters. New verified sellers are
                added regularly.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredShops.map((shop) => (
                <Link
                  key={shop.id}
                  to={`/shops/${shop.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-400 hover:-translate-y-1"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 flex items-center justify-center">
                    <Wrench className="h-20 w-20 text-indigo-300 opacity-50" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                          <Store className="h-7 w-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {shop.shopName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-5 line-clamp-3">
                      {shop.shopDescription ||
                        "Specialized in genuine spare parts for cars, SUVs, vans & trucks. Fast service & competitive prices."}
                    </p>

                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                        <span>
                          {shop.shopLocation ||
                            "Negombo Area, Western Province"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-indigo-600" />
                        <span>
                          {shop.contactNumber || "Available via platform"}
                        </span>
                      </div>
                      {shop.establishedYear && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                          <span>Since {shop.establishedYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100 flex justify-between items-center">
                    <span className="text-indigo-700 font-medium group-hover:underline flex items-center gap-2">
                      View Shop Details →
                    </span>
                    <span className="text-sm text-gray-500">Explore Parts</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
