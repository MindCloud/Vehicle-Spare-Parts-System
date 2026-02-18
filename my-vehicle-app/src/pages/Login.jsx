// src/pages/Login.jsx
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user profile from Firestore
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (!userData) {
        alert("User data not found in Firestore");
        return;
      }

      // Role-based redirect
      if (userData.role === "admin") {
        nav("/dashboard");
      } else {
        nav("/"); // Customer sees landing page
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96 space-y-3">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          value={password}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <button
          onClick={login}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
