import { useState } from "react";
import { useLocation } from "wouter";

export default function ManagePage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Posts");
  const [showNewUserForm, setShowNewUserForm] = useState(false);


  // Example posts data
  const posts = [
    { title: "hello", date: "2025-09-01", status: "Public", author: "Admin" },
    { title: "test", date: "2025-09-01", status: "Public", author: "Admin" },
    { title: "new user", date: "2025-09-01", status: "Public", author: "Admin" },
    { title: "Test", date: "2025-09-01", status: "Public", author: "Admin" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* Tabs on top */}
      <div className="flex justify-center space-x-2 bg-white shadow px-4 py-2">
        {["Posts", "Pages", "Users", "Groups", "Uploads", "Import", "Export"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-semibold border 
              ${activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-grow p-8">
        {activeTab === "Posts" && (
          <div className="bg-white shadow rounded-lg p-6">
            {/* Search + Actions */}
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded bg-gray-100 w-1/3"
              />
              <button className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold">
                Search
              </button>
              <button
      onClick={() => setLocation("/create-post")}
      className="px-4 py-2 bg-green-100 hover:bg-green-200 border rounded-md font-semibold"
    >
      ➕ New Post
    </button>
            </div>

            {/* Table */}
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">Title</th>
                  <th className="p-3">Posted</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Controls</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-blue-600 underline cursor-pointer">{post.title}</td>
                    <td className="p-3">{post.date}</td>
                    <td className="p-3 text-green-700 font-semibold">{post.status}</td>
                    <td className="p-3">{post.author}</td>
                    <td className="p-3 flex gap-3">
                      <button className="text-gray-600 hover:text-black">✏️</button>
                      <button className="text-red-600 hover:text-red-800">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "Pages" && (
  <div className="bg-white shadow rounded-lg p-6">
    {/* Search + Actions */}
    <div className="flex items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 border rounded bg-gray-100 w-1/3"
      />
      <button className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold">
        Search
      </button>
      <button
      onClick={() => setLocation("/create-post")}
      className="px-4 py-2 bg-green-100 hover:bg-green-200 border rounded-md font-semibold"
    >
      ➕ New Page
    </button>
    </div>

    {/* Table */}
    <h2 className="text-2xl font-bold mb-4">Pages</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Title</th>
            <th className="p-3">Created</th>
            <th className="p-3">Last Updated</th>
            <th className="p-3">Public?</th>
            <th className="p-3">Listed?</th>
            <th className="p-3">Author</th>
            <th className="p-3">Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="p-3 text-blue-600 underline cursor-pointer">
              Test Page
            </td>
            <td className="p-3">2025-09-01</td>
            <td className="p-3">2025-09-01</td>
            <td className="p-3">✔️</td>
            <td className="p-3">✔️</td>
            <td className="p-3">Admin</td>
            <td className="p-3 flex gap-3">
              <button className="text-gray-600 hover:text-black" aria-label="Edit Page">
                ✏️
              </button>
              <button className="text-red-600 hover:text-red-800" aria-label="Delete Page">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}
{activeTab === "Users" && (
  <div className="bg-white shadow rounded-lg p-6">
    {/* Search + Actions */}
    <div className="flex items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 border rounded bg-gray-100 w-1/3"
      />
      <button className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold">
        Search
      </button>
      <button
        onClick={() => setShowNewUserForm(!showNewUserForm)}
        className="px-6 py-2 rounded-md border bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        + New User
      </button>
    </div>

    {/* Conditional: Show New User Form */}
    {showNewUserForm ? (
      <div>
        <h2 className="text-2xl font-bold mb-4">New User</h2>
        <form className="space-y-4 max-w-xl">
          <div className="flex justify-between items-center">
            <label className="font-medium">Login</label>
            <input type="text" className="px-3 py-2 border rounded w-2/3 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <label className="font-medium">Email</label>
            <input type="email" className="px-3 py-2 border rounded w-2/3 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <label className="font-medium">Group</label>
            <select className="px-3 py-2 border rounded w-2/3 bg-gray-100">
              <option>Member</option>
              <option>Admin</option>
              <option>Guest</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <label className="font-medium">Password</label>
            <input type="password" className="px-3 py-2 border rounded w-2/3 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <label className="font-medium">Confirm</label>
            <input type="password" className="px-3 py-2 border rounded w-2/3 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <label className="font-medium">Full Name (optional)</label>
            <input type="text" className="px-3 py-2 border rounded w-2/3 bg-gray-100" />
          </div>
          <div className="flex justify-between items-center">
            <label className="font-medium">Website (optional)</label>
            <input type="url" className="px-3 py-2 border rounded w-2/3 bg-gray-100" />
          </div>
          <button
            type="submit"
            className="px-6 py-2 rounded-md border bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Add User
          </button>
        </form>
      </div>
    ) : (
      <>
        {/* Users Table */}
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Login (name)</th>
              <th className="p-3">Group</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Website</th>
              <th className="p-3">Controls</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3 text-blue-600 underline cursor-pointer">Admin</td>
              <td className="p-3 text-blue-600 underline cursor-pointer">Admin</td>
              <td className="p-3">2025-09-01</td>
              <td className="p-3">—</td>
              <td className="p-3 flex gap-3">
                <button className="text-gray-600 hover:text-black">✏️</button>
                <button className="text-red-600 hover:text-red-800">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    )}
  </div>
)}

{activeTab === "Groups" && (
  <div className="bg-white shadow rounded-lg p-6">
    {/* Search + Actions */}
    <div className="flex items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search all groups for user..."
        className="px-4 py-2 border rounded bg-gray-100 w-1/3"
      />
      <button className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold">
        Search
      </button>
      <button className="px-6 py-2 rounded-md border bg-green-100 text-black font-semibold hover:bg-green-200">
        ⊕ New Group
      </button>
    </div>

    {/* Groups Table */}
    <h2 className="text-2xl font-bold mb-4">Groups</h2>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-3">Group</th>
          <th className="p-3">Members</th>
          <th className="p-3">Default?</th>
          <th className="p-3">Guests?</th>
          <th className="p-3">Controls</th>
        </tr>
      </thead>
      <tbody>
        {[
          { group: "Admin", members: 1, default: false, guests: false },
          { group: "Member", members: 0, default: true, guests: false },
          { group: "Friend", members: 0, default: false, guests: false },
          { group: "Banned", members: 0, default: false, guests: false },
          { group: "Guest", members: 0, default: false, guests: true },
        ].map((g, idx) => (
          <tr key={idx} className="border-b hover:bg-gray-50">
            <td className="p-3">{g.group}</td>
            <td className="p-3 text-blue-600 underline cursor-pointer">
              {g.members}
            </td>
            <td className="p-3 text-center">
              {g.default ? "✔️" : ""}
            </td>
            <td className="p-3 text-center">
              {g.guests ? "✔️" : ""}
            </td>
            <td className="p-3 flex gap-3">
              <button className="text-gray-600 hover:text-black">✏️</button>
              <button className="text-red-600 hover:text-red-800">🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{activeTab === "Uploads" && (
  <div className="bg-white shadow rounded-lg p-6">
    {/* Search + Actions */}
    <div className="flex items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 border rounded bg-gray-100 w-1/3"
      />
      <button className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold">
        Search
      </button>
      <button className="px-6 py-2 rounded-md border bg-green-100 text-black font-semibold hover:bg-green-200">
        ⊕ Add Files
      </button>
    </div>

    {/* Uploads Table */}
    <h2 className="text-2xl font-bold mb-4">Uploads</h2>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-3">Name</th>
          <th className="p-3">Last Modified</th>
          <th className="p-3">Size</th>
          <th className="p-3">Type</th>
          <th className="p-3">Controls</th>
        </tr>
      </thead>
      <tbody>
        {/* If no uploads */}
        <tr>
          <td colSpan={5} className="p-4 text-gray-500 flex items-center gap-2">
            <span>✖️ No results</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}
{activeTab === "Import" && (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-6">What would you like to import?</h2>

    <div className="space-y-4">
      {/* Posts .atom File */}
      <div className="flex items-center justify-between">
        <label className="w-1/4 font-medium">Posts .atom File</label>
        <input type="file" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
      </div>

      {/* Pages .atom File */}
      <div className="flex items-center justify-between">
        <label className="w-1/4 font-medium">Pages .atom File</label>
        <input type="file" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
      </div>

      {/* Groups .json File */}
      <div className="flex items-center justify-between">
        <label className="w-1/4 font-medium">Groups .json File</label>
        <input type="file" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
      </div>

      {/* Users .json File */}
      <div className="flex items-center justify-between">
        <label className="w-1/4 font-medium">Users .json File</label>
        <input type="file" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
      </div>

      {/* Bulk File Upload */}
      <div className="flex items-center justify-between">
        <label className="w-1/4 font-medium">Bulk File Upload</label>
        <input type="file" multiple className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
      </div>

      {/* URL for Embedded Media */}
      <div>
        <label className="block font-medium mb-1">URL for Embedded Media (optional)</label>
        <input
          type="text"
          placeholder="https://example.com/uploads/"
          className="border rounded px-3 py-2 w-full bg-gray-100"
        />
        <p className="text-sm text-gray-500 mt-1">
          Usually something like <code>https://chyrp-test.ranjithrd.in/uploads/</code>.
        </p>
      </div>

      {/* Import Button */}
      <button className="px-6 py-2 bg-green-100 hover:bg-green-200 border rounded-md font-semibold">
        Import
      </button>
    </div>
  </div>
)}
{activeTab === "Export" && (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-6">What would you like to export?</h2>

    <div className="space-y-6">
      {/* Posts */}
      <div>
        <div className="flex items-center mb-2">
          <input type="checkbox" defaultChecked className="mr-2" />
          <label className="font-medium">Posts</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-1/4 text-sm">Filter Posts (optional) <span className="text-gray-400">?</span></label>
          <input type="text" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
        </div>
      </div>

      {/* Pages */}
      <div>
        <div className="flex items-center mb-2">
          <input type="checkbox" defaultChecked className="mr-2" />
          <label className="font-medium">Pages</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-1/4 text-sm">Filter Pages (optional) <span className="text-gray-400">?</span></label>
          <input type="text" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
        </div>
      </div>

      {/* Groups */}
      <div>
        <div className="flex items-center mb-2">
          <input type="checkbox" defaultChecked className="mr-2" />
          <label className="font-medium">Groups</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-1/4 text-sm">Filter Groups (optional) <span className="text-gray-400">?</span></label>
          <input type="text" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
        </div>
      </div>

      {/* Users */}
      <div>
        <div className="flex items-center mb-2">
          <input type="checkbox" defaultChecked className="mr-2" />
          <label className="font-medium">Users</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-1/4 text-sm">Filter Users (optional) <span className="text-gray-400">?</span></label>
          <input type="text" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
        </div>
        <p className="text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2 mt-2">
          Users export file will contain the hashed password for each user – keep it safe!
        </p>
      </div>

      {/* Uploads Manifest */}
      <div>
        <div className="flex items-center mb-2">
          <input type="checkbox" defaultChecked className="mr-2" />
          <label className="font-medium">Uploads Manifest</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="w-1/4 text-sm">Filter Uploads Manifest (optional) <span className="text-gray-400">?</span></label>
          <input type="text" className="border rounded px-3 py-2 w-3/4 bg-gray-100" />
        </div>
      </div>

      {/* Export Button */}
      <button className="px-6 py-2 bg-green-100 hover:bg-green-200 border rounded-md font-semibold">
        Export
      </button>
    </div>
  </div>
)}

      </div>

      {/* Back button */}
      <button
        onClick={() => setLocation("/admin")}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
      >
        ⬅ Back to Admin
      </button>
    </div>
  );
}
