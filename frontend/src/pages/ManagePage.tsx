import { useState } from "react";
import { Link, useLocation } from "wouter";
import AdminNav from "./AdminNav";
import { useGetAllRolesRolesGet, useListPostsPostsGet, useListUsersUsersGet } from "../api/generated";
import dayjs from "dayjs";
import ManageUsers from "../components/ManageUsers";
import ManageRoles from "../components/ManageRoles";

export default function ManagePage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Posts");
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  const { data: posts, isLoading, error } = useListPostsPostsGet();


  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center text-black bg-accent"
    >

      {/* Tabs on top */}
      <AdminNav />
      <div className="flex justify-center space-x-2 bg-white shadow px-4 py-2">
        {["Posts", "Users", "Roles"].map((tab) => (
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
          <div className="bg-white shadow rounded-lg p-6 mt-20">
            {/* Search + Actions */}
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/create-post"
                className="px-4 py-2 bg-green-100 hover:bg-green-200 border rounded-md font-semibold"
              >
                ➕ New Post
              </Link>
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
                </tr>
              </thead>
              <tbody>
                {(posts ?? []).map((post, idx) => {
                  const url = `/post/${post.slug}`;
                  return (<tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-blue-600 underline cursor-pointer">
                      <Link to={url}>{post.title}</Link></td>
                    <td className="p-3">{dayjs(post.published_at).format("MMMM D, YYYY")}</td>
                    <td className="p-3 text-green-700 font-semibold">{post.status}</td>
                    <td className="p-3 flex gap-3 cursor-pointer">
                      <Link to={url} className="text-gray-600 hover:text-black">✏️</Link>
                      <Link to={url} className="text-red-600 hover:text-red-800">🗑️</Link>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}


        {activeTab === "Users" && (
          <ManageUsers />
        )}

        {activeTab === "Roles" && (
          <ManageRoles />
        )}


      </div>

      {/* Back button */}
      <button
        onClick={() => setLocation("/admin")}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-secondary text-dark font-semibold shadow-lg hover:bg-primary transition"
      >
        ⬅ Home
      </button>
    </div>
  );
}
