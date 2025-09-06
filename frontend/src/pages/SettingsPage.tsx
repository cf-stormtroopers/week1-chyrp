import { useLocation } from "wouter";
import AdminNav from "./AdminNav";
import { useEffect, useState } from "react";
import { updateSettingsSiteSettingsPatch } from "../api/generated";
import { useAuthStore } from "../state/auth";

export default function SettingsPage() {
  const authstore = useAuthStore();
  const [, setLocation] = useLocation();

  const [blogTitle, setBlogTitle] = useState("");
  const [searchPages, setSearchPages] = useState(false);
  const [markdown, setMarkdown] = useState(true);
  const [registration, setRegistration] = useState(false);

  async function updateSettings(e: React.FormEvent) {
    e.preventDefault();

    if (blogTitle.trim() === "") {
      alert("Blog title cannot be empty");
      return;
    }

    try {
      const res = await updateSettingsSiteSettingsPatch({
        blog_title: blogTitle,
        show_search: searchPages,
        show_markdown: markdown,
        show_registration: registration,
      })
      if (res) {
        alert("Settings updated successfully!");
        authstore.mutate();
      }
    } catch (e) {
      console.error("Failed to update settings", e);
      alert("Failed to update settings");
    }
  }

  useEffect(() => {
    setBlogTitle(authstore.blogTitle);
    setSearchPages(authstore.settings.show_search);
    setMarkdown(authstore.settings.show_markdown);
    setRegistration(authstore.settings.show_registration);
  }, [authstore.blogTitle, authstore.settings])

  return (
    <div
      className="flex flex-col min-h-screen bg-accent bg-center  text-black"
    >
      {/* Admin Navigation */}
      {/* If you still want AdminNav on top, leave this, else remove */}
      <AdminNav />

      {/* Main content */}
      <div className="flex-grow flex justify-center items-start p-8 mt-25">
        <div className="bg-white shadow rounded-lg p-8 w-full max-w-3xl space-y-12">
          {/* --- Content Settings --- */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Content Settings</h2>
            <form className="space-y-4" onSubmit={updateSettings}>
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="blogTitle">Blog Title</label>
                <input
                  type="text"
                  id="blogTitle"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="searchPages"
                  checked={searchPages}
                  onChange={() => setSearchPages(!searchPages)}
                />
                <label htmlFor="searchPages">Search Pages</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="markdown"
                  checked={markdown}
                  onChange={() => setMarkdown(!markdown)}
                />
                <label htmlFor="markdown">Markdown</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="registration"
                  checked={registration}
                  onChange={() => setRegistration(!registration)}
                />
                <label htmlFor="registration" className="">
                  Allow Users to Sign Up
                </label>
              </div>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => setLocation("/")}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-secondary text-dark font-semibold shadow-lg hover:primary transition"
      >
        ⬅ Home
      </button>
    </div>
  );
}
