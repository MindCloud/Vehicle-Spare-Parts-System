// src/pages/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    shopName: "",
    shopDescription: "",
    shopLocation: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      alert("Fill required fields");
      return;
    }

    const res = await createUserWithEmailAndPassword(
      auth,
      form.email.trim(),
      form.password,
    );

    // Always create user
    await setDoc(doc(db, "users", res.user.uid), {
      username: form.username,
      email: form.email,
      phone: form.phone,
      role: form.role,
      address: form.address,
      createdAt: new Date(),
    });

    // If seller → also create seller profile
    if (form.role === "seller") {
      await setDoc(doc(db, "sellers", res.user.uid), {
        shopName: form.shopName,
        shopDescription: form.shopDescription,
        shopLocation: form.shopLocation,
        contactNumber: form.phone,
        verified: false,
        createdAt: new Date(),
      });
    }

    nav("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow w-96 space-y-3"
      >
        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="input"
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input"
        />
        <input
          placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input"
        />
        <input
          placeholder="Address"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="input"
        />

        <select
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="input"
        >
          <option value="">Select Role</option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
        </select>

        {form.role === "seller" && (
          <>
            <input
              placeholder="Shop Name"
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="input"
            />
            <input
              placeholder="Shop Description"
              onChange={(e) =>
                setForm({ ...form, shopDescription: e.target.value })
              }
              className="input"
            />
            <input
              placeholder="Shop Location"
              onChange={(e) =>
                setForm({ ...form, shopLocation: e.target.value })
              }
              className="input"
            />
          </>
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
