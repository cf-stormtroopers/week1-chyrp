import { useState } from "react";
import { useAuthStore } from "../state/auth";
import { Link } from "wouter";

export default function Header({
  onSearchTextChange,
}: {
  onSearchTextChange?: (text: string) => void;
}) {
  const authStore = useAuthStore();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-8 bg-primary text-dark shadow border-b border-dark">
      {/* Logo / Title */}
      <Link to="/">
        <div
          // style={{ fontFamily: "Georgia, serif" }}
          className="font-bold text-5xl cursor-pointer hover:text-secondary"
        >
          {authStore.blogTitle ?? "Stormtrooper Chyrp"}
        </div>
      </Link>

      {/* Search */}
      {onSearchTextChange && authStore.settings.show_search && (
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          onChange={(e) => onSearchTextChange?.(e.target.value)}
        />
      )}

      {/* Right actions */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="focus:outline-none"
          >
            <img
              src="/pfp.jpg"
              alt="profile"
              className="rounded-full w-12 h-12 border-2 border-dark hover:border-secondary"
            />
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-2 pb-2 w-40 bg-accent rounded-lg shadow-lg text-dark z-50">
              <div className="px-4 py-2 border-b border-black">
                <span className="font-semibold">
                  {authStore.accountInformation?.display_name ?? "Not logged in"}
                </span>
              </div>
              {authStore.accountInformation && <Link to="/controls">
                <button className="w-full text-left px-4 py-2 hover:bg-primary hover:text-black">
                  Account
                </button>
              </Link>}
              {authStore.accountInformation && <button
                className="w-full text-left px-4 py-2 hover:bg-primary hover:text-black"
                onClick={() => authStore.logout()}
              >
                Logout
              </button>}
              {!authStore.accountInformation && <Link
                to="/login"
              >
                <button className="w-full text-left px-4 py-2 hover:bg-primary hover:text-black">

                  Login
                </button>
              </Link>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
