import { useLocation } from "wouter";
import { useState } from "react";
import { useAuthStore } from "../state/auth";
import Header from "../components/Header";

export default function AdminPage() {
  const authStore = useAuthStore();
  const [, setLocation] = useLocation();
  const [openProfile, setOpenProfile] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Header */}
      <Header />

      {/* Triangle layout (top row + bottom row) */}
      <main className="flex-grow flex flex-col items-center justify-center space-y-16">
        {/* Top row (Settings) */}
        <div>
          <button
            onClick={() => setLocation("/settings")}
            className="px-20 py-18 rounded-lg bg-gray-700 hover:bg-gray-600 shadow-lg text-2xl font-bold"
          >
            Settings
          </button>
        </div>

        {/* Bottom row (Manage + Extend) */}
        <div className="flex space-x-24">
          <button
            onClick={() => setLocation("/manage")}
            className="px-20 py-18 rounded-lg bg-gray-700 hover:bg-gray-600 shadow-lg text-2xl font-bold"
          >
            Manage
          </button>
          <button
            onClick={() => setLocation("/extend")}
            className="px-20 py-18 rounded-lg bg-gray-700 hover:bg-gray-600 shadow-lg text-2xl font-bold"
          >
            Extend
          </button>
        </div>
      </main>

      {/* Back to Home button (bottom-right corner) */}
      <button
        onClick={() => setLocation("/")}
        className="absolute bottom-6 right-6 px-6 py-3 rounded-full bg-gray-600 text-white font-semibold shadow-lg hover:bg-gray-700 transition"
      >
        ⬅ Back Home
      </button>
    </div>
  );
}
