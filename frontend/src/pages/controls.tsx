"use client";
import { useState } from "react";
import { useLocation } from "wouter";

export default function ControlsPage() {
  const [, navigate] = useLocation();
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("ranjithrd03@gmail.com"); // prefilled like your screenshot
  const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    // For now, just show a success message
    alert("Profile updated successfully!");

    // Navigate back to home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-6">
      <div className="bg-black shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        {/* Back Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setLocation("/")}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Controls</h2>

        <form className="space-y-4" onSubmit={handleUpdate}>
          {/* Full name */}
          <div>
            <label className="block font-medium mb-1">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block font-medium mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* New password */}
          <div>
            <label className="block font-medium mb-1">New password?</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Confirm */}
          <div>
            <label className="block font-medium mb-1">Confirm</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Update button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
