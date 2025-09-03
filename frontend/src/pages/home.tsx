import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"recent" | "preview" | "archive" | null>(null);

  // Store refs for dropdowns
  const dropdownRefs = {
    recent: useRef<HTMLDivElement>(null),
    preview: useRef<HTMLDivElement>(null),
    archive: useRef<HTMLDivElement>(null),
  };

  // Close dropdown if click happens outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        openDropdown &&
        dropdownRefs[openDropdown] &&
        dropdownRefs[openDropdown]?.current &&
        !dropdownRefs[openDropdown]?.current?.contains(target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  return (
    <div
      className="relative min-h-screen flex flex-col text-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/blog.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative flex flex-col w-full min-h-screen">
        {/* Header */}
        <header className="p-6 bg-white/20 backdrop-blur-md text-center font-bold text-3xl text-gray-900 relative">
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded bg-gray-600 text-white shadow hover:bg-gray-700 transition"
          >
            ☰
          </button>
          Name of Site
          {/* Logout button */}
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded bg-gray-600 text-white shadow hover:bg-gray-700 transition">
            Logout
          </button>
        </header>

        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar (neutral colors, rounded, centered vertically) */}
        <div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-4 flex flex-col space-y-3 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold shadow hover:shadow-lg hover:bg-gray-600 transition">
            Blog
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold shadow hover:shadow-lg hover:bg-gray-600 transition">
            Admin
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold shadow hover:shadow-lg hover:bg-gray-600 transition">
            Controls
          </button>
        </div>

        {/* Main content */}
        <main className="flex-grow flex flex-col items-center justify-start mt-8 gap-12">
          {/* Top buttons row */}
          <div className="flex gap-12">
            {/* Recent Posts */}
            <div ref={dropdownRefs.recent} className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "recent" ? null : "recent")
                }
                className="px-8 py-4 rounded-lg bg-white/20 backdrop-blur-md text-black text-lg font-bold shadow hover:shadow-lg hover:scale-105 transition"
              >
                Recent Posts
              </button>
              {openDropdown === "recent" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 backdrop-blur-md shadow rounded-lg p-2">
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">Post 1</p>
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">Post 2</p>
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">Post 3</p>
                </div>
              )}
            </div>

            {/* Preview */}
            <div ref={dropdownRefs.preview} className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "preview" ? null : "preview")
                }
                className="px-8 py-4 rounded-lg bg-white/20 backdrop-blur-md text-black text-lg font-bold shadow hover:shadow-lg hover:scale-105 transition"
              >
                Preview
              </button>
              {openDropdown === "preview" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 backdrop-blur-md shadow rounded-lg p-2">
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">Preview 1</p>
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">Preview 2</p>
                </div>
              )}
            </div>

            {/* Archive */}
            <div ref={dropdownRefs.archive} className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "archive" ? null : "archive")
                }
                className="px-8 py-4 rounded-lg bg-white/20 backdrop-blur-md text-black text-lg font-bold shadow hover:shadow-lg hover:scale-105 transition"
              >
                Archive
              </button>
              {openDropdown === "archive" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 backdrop-blur-md shadow rounded-lg p-2">
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">2023</p>
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">2022</p>
                  <p className="px-3 py-2 hover:bg-gray-200 rounded">2021</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
