// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shops from "./pages/Shops";
import ShopDetails from "./pages/ShopDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShoppingCart from "./pages/ShoppingCart";
import Orders from "./pages/Orders";

import Dashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminShops from "./pages/Admin/AdminShops";
import AdminSpareParts from "./pages/Admin/AdminSpareParts";
import AdminOrders from "./pages/Admin/AdminOrders";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/shops/:id" element={<ShopDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orders" element={<Orders />} />

        {/* Admin Nested Routes */}
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route
            index
            element={<h1 className="text-3xl font-bold">Welcome Admin</h1>}
          />
          <Route path="users" element={<AdminUsers />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="spare-parts" element={<AdminSpareParts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}
