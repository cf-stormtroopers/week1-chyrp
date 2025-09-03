"use client";
import { useState } from "react";
import { useLocation } from "wouter";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("public");
  const [priority, setPriority] = useState("medium");
  const [parent, setParent] = useState("none");

  // wouter hook for navigation
  const [, setLocation] = useLocation();

  const handlePublish = () => {
    alert("Post published!");
    setLocation("/"); // navigate back to home
  };

  const handleSave = () => {
    alert("Draft saved!");
    setLocation("/"); // navigate back to home
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-black">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-800 text-black"
            placeholder="Enter post title..."
          />
        </div>

        {/* Body */}
        <div>
          <label className="block font-semibold mb-2 text-black">Body</label>

          {/* Horizontal 8 buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "Page",
              "Text",
              "Photo",
              "Uploader",
              "Link",
              "Quote",
              "Audio",
              "Video",
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 text-black rounded-md 
                           hover:bg-gray-800 hover:text-white text-sm font-medium transition"
              >
                {item}
              </button>
            ))}
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-purple-400 text-black"
            placeholder="Write your content here..."
          />
        </div>

        {/* Slug & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-black">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-800 text-black"
              placeholder="post-slug"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-black">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-800 text-black"
            >
              <option value="public">Public and visible</option>
              <option value="private">Private</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Priority & Parent */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-black">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-purple-400 text-black"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2 text-black">Parent</label>
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-purple-400 text-black"
            >
              <option value="none">[None]</option>
              <option value="category1">Test Page</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Publish
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
