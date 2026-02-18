// src/components/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { name: "Manage Users", path: "/dashboard/users" },
    { name: "Manage Shops", path: "/dashboard/shops" },
    { name: "Add Spare Parts", path: "/dashboard/spare-parts" },
    { name: "Manage Orders", path: "/dashboard/orders" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path} // absolute paths fix nested routing issue
          className={`py-2 px-4 rounded mb-2 hover:bg-gray-700 transition ${
            location.pathname.startsWith(link.path) ? "bg-gray-700" : ""
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
