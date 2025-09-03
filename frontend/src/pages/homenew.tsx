"use client";

import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useListPostsPostsGet } from "../api/generated";

export default function HomePage() {
  const [openMonth, setOpenMonth] = useState<string | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [location, setLocation] = useLocation(); // <-- replace navigate

  const { data, isLoading, error } = useListPostsPostsGet();
  const posts = data?.data ?? [];

  // Example archive data
  const archiveData: Record<string, { title: string; link: string }[]> = {
    "January 2023": [
      { title: "Great UX Tips", link: "/posts/ux-tips" },
      { title: "React Performance Hacks", link: "/posts/react-performance" },
    ],
    "February 2023": [
      { title: "Why Python Still Rocks", link: "/posts/python-rocks" },
      { title: "Data Science Trends", link: "/posts/ds-trends" },
    ],
    "March 2023": [{ title: "Leadership Lessons", link: "/posts/leadership" }],
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-14 bg-black shadow">
        <div
          style={{ fontFamily: "Georgia, serif" }}
          className="font-bold text-4xl"
        >
          Stormtrooper Chyrp.
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:black"
        />

        {/* Right actions */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white text-2xl">
            🔔
          </button>

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
                  onClick={() => setLocation("/")} // <-- fixed
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-black border-r px-4 py-6 flex flex-col justify-between">
          {/* Nav Section */}
          <nav className="space-y-3">
            <button
              onClick={() => setLocation("/create-post")} // <-- fixed
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create Post</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>

              <Link href="/controls">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <span>Controls</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zM6 20h12a2 2 0 002-2V8a2 2 0 00-2-2h-2l-2-2H8L6 6H4a2 2 0 00-2 2v10a2 2 0 002 2h2z"
                    />
                  </svg>
                </button>
              </Link>

              <span>Admin</span>
            </button>
          </nav>

          {/* Archive Section */}
          <div className="mt-6 bg-black text-white p-4 rounded-lg">
            <h3 className="font-bold mb-3">Archive</h3>
            <div className="space-y-3">
              {Object.entries(archiveData).map(([monthYear, posts]) => (
                <div key={monthYear}>
                  <button
                    className="w-full text-left px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 font-semibold"
                    onClick={() =>
                      setOpenMonth(openMonth === monthYear ? null : monthYear)
                    }
                  >
                    {monthYear}
                  </button>

                  {openMonth === monthYear && (
                    <div className="mt-2 ml-3 space-y-2">
                      {posts.map((post, idx) => (
                        <a
                          key={idx}
                          href={post.link}
                          className="block px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                        >
                          {post.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 px-8 py-6 space-y-6 overflow-y-auto h-[calc(100vh-112px)]">
          {isLoading && <p>Loading...</p>}
          {error && (
            <p>Failed with error {error.cause?.message ?? "Unknown error"}</p>
          )}

          {JSON.stringify(posts)}

          {[...Array(20)].map((_, post) => (
            <article
              key={post}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold text-black">
                  Post Title {post + 1}
                </h2>
                <p className="text-gray-600">
                  This is a short description of the post content...
                </p>
                <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                  <span>⭐ 1.2k</span>
                  <span>💬 300</span>
                  <span>👁️ 5k</span>
                </div>
              </div>
              <img
                src="https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg"
                alt="thumbnail"
                className="w-1/3 h-auto rounded-lg object-cover"
              />
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
