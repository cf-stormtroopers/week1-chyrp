import { useLocation } from "wouter";
import { useState } from "react";
import { useAuthStore } from "../state/auth";

export default function AdminPage() {
  const authStore = useAuthStore();
  const [, setLocation] = useLocation();
  const [openProfile, setOpenProfile] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-14 bg-black shadow">
        <div
          style={{ fontFamily: "Georgia, serif" }}
          className="font-bold text-4xl"
        >
          {authStore.blogTitle ?? "Chyrp"}
        </div>

        
         <div className="flex items-center space-x-6">


<div className="relative">
  <button
    onClick={() => setOpenProfile(!openProfile)}
    className="focus:outline-none"
  >
    <img
      src="/pfp.jpg"
      alt="profile"
      className="rounded-full w-10 h-10"
    />
  </button>

  {openProfile && (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg text-black z-50">
      <div className="px-4 py-2 border-b">
        <span className="font-semibold">John Doe</span>
      </div>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => authStore.logout()} // <-- fixed
      >
        Logout
      </button>
    </div>
  )}
</div>
</div>
      </header>

      {/* Center buttons */}
      <main className="flex-grow flex flex-col items-center justify-center relative">
      {/* Settings button (top vertex) */}
      <button
        onClick={() => setLocation("/settings")}
        className="absolute top-[15%] left-1/2 transform -translate-x-1/2 px-20 py-18 rounded-lg bg-gray-700 hover:bg-gray-600 shadow-lg text-2xl font-bold"
      >
        Settings
      </button>

      {/* Manage (bottom-left) */}
      <button
        onClick={() => setLocation("/manage")}
        className="absolute bottom-[25%] left-[30%] px-20 py-18 rounded-lg bg-gray-700 hover:bg-gray-600 shadow-lg text-2xl font-bold"
      >
        Manage
      </button>

      {/* Extend (bottom-right) */}
      <button
        onClick={() => setLocation("/extend")}
        className="absolute bottom-[25%] right-[30%] px-20 py-18 rounded-lg bg-gray-700 hover:bg-gray-600 shadow-lg text-2xl font-bold"
      >
        Extend
      </button>
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
