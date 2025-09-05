import { useLocation } from "wouter";
import { useState } from "react";

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Content");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* <h1 className="text-[80rem] font-extrabold">title</h1> */}
      {/* Tabs on top */}
      <div className="flex justify-center space-x-2 bg-white shadow px-4 py-2">
        {["Content", "Users", "Routes"].map((tab) => (
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

      {/* Content section */}
      <div className="flex-grow flex justify-center items-start p-8">
        <div className="bg-white shadow rounded-lg p-8 w-full max-w-3xl">
          {/* General Settings */}
        

          {/* Content Settings */}
          {activeTab === "Content" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Content Settings</h2>
              <form className="space-y-4">
                <div>
                  <label className="block font-semibold">Posts Per Blog Page</label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full px-4 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Posts in Feed</label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full px-4 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Items Per Admin Page</label>
                  <input
                    type="number"
                    defaultValue={25}
                    className="w-full px-4 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Default Post Status</label>
                  <select className="w-full px-4 py-2 border rounded bg-gray-100">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Default Page Status</label>
                  <select className="w-full px-4 py-2 border rounded bg-gray-100">
                    <option>Public and visible in pages list</option>
                    <option>Private</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Uploads Path</label>
                  <input
                    type="text"
                    defaultValue="/uploads/"
                    className="w-full px-4 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Upload Size Limit (MB)</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-4 py-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Feed Format</label>
                  <select className="w-full px-4 py-2 border rounded bg-gray-100">
                    <option>Atom</option>
                    <option>RSS</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="searchPages" />
                  <label htmlFor="searchPages">Search Pages</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="webmentions" />
                  <label htmlFor="webmentions">Webmentions</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="unicode" defaultChecked />
                  <label htmlFor="unicode">Unicode Emoticons</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="markdown" defaultChecked />
                  <label htmlFor="markdown">Markdown</label>
                </div>

                <button
  type="button"
  onClick={() => setLocation("/")}   // 👈 redirect to home.tsx
  className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
>
  Update
</button>

              </form>
            </>
          )}

          {/* User Settings */}
{activeTab === "Users" && (
  <>
    <h2 className="text-2xl font-bold mb-6">User Settings</h2>
    <form className="space-y-6">
      {/* Registration */}
      <div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="registration" />
          <label htmlFor="registration" className="font-semibold">
            Registration
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Allow people to register.
        </p>
      </div>

      {/* Email Correspondence */}
      <div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="emailCorrespondence" defaultChecked />
          <label htmlFor="emailCorrespondence" className="font-semibold">
            Email Correspondence
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Allow the site to send email correspondence to users?
        </p>
      </div>

      {/* Activate by Email */}
      <div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="activateByEmail" />
          <label htmlFor="activateByEmail" className="font-semibold">
            Activate by Email
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Should users activate by email?
        </p>
      </div>

      {/* Default User Group */}
      <div>
        <label className="block font-semibold mb-1">Default User Group</label>
        <select className="w-full px-4 py-2 border rounded bg-gray-100">
          <option>Member</option>
          <option>Admin</option>
          <option>Guest</option>
        </select>
      </div>

      {/* Guest Group */}
      <div>
        <label className="block font-semibold mb-1">“Guest” Group</label>
        <select className="w-full px-4 py-2 border rounded bg-gray-100">
          <option>Guest</option>
          <option>Member</option>
        </select>
      </div>

      {/* Update Button */}
      <button
  type="button"
  onClick={() => setLocation("/")}   // 👈 redirect to home.tsx
  className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
>
  Update
</button>

    </form>
  </>
)}

        


          {/* Route Settings */}
{activeTab === "Routes" && (
  <>
    <h2 className="text-2xl font-bold mb-6">Route Settings</h2>
    <form className="space-y-6">
      {/* Clean URLs */}
      <div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="cleanUrls" />
          <label htmlFor="cleanUrls" className="font-semibold">
            Clean URLs
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Gives your site prettier URLs.{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Download the URL rewrite files.
          </a>
        </p>
      </div>

      {/* Homepage */}
      <div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="homepage" />
          <label htmlFor="homepage" className="font-semibold">
            Homepage
          </label>
        </div>
        <p className="text-sm text-gray-500 ml-6">
          Make the default route a homepage instead of the blog index.
        </p>
      </div>

      {/* Post View URL */}
      <div>
        <label className="block font-semibold mb-1">
          Post View URL (requires clean URLs)
        </label>
        <input
          type="text"
          defaultValue="(year)/(month)/(day)/(url)/"
          className="w-full px-4 py-2 border rounded bg-gray-100"
        />
      </div>

      {/* Syntax */}
      <div>
        <h3 className="font-semibold mb-2">Syntax:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            <span className="font-mono text-purple-600">(year)</span> Year
            submitted (e.g. 2007)
          </li>
          <li>
            <span className="font-mono text-purple-600">(month)</span> Month
            submitted (e.g. 12)
          </li>
          <li>
            <span className="font-mono text-purple-600">(day)</span> Day
            submitted (e.g. 25)
          </li>
          <li>
            <span className="font-mono text-purple-600">(hour)</span> Hour
            submitted (e.g. 03)
          </li>
          <li>
            <span className="font-mono text-purple-600">(minute)</span> Minute
            submitted (e.g. 59)
          </li>
          <li>
            <span className="font-mono text-purple-600">(second)</span> Second
            submitted (e.g. 30)
          </li>
          <li>
            <span className="font-mono text-purple-600">(id)</span> Post ID
          </li>
          <li>
            <span className="font-mono text-purple-600">(author)</span> Post
            author (username) (e.g. Alex)
          </li>
          <li>
            <span className="font-mono text-purple-600">(clean)</span> The
            non-unique slug (e.g. this_is_clean)
          </li>
          <li>
            <span className="font-mono text-purple-600">(url)</span> The unique
            form of (clean) (e.g. this_one_is_taken_2)
          </li>
          <li>
            <span className="font-mono text-purple-600">(feather)</span> The
            post's feather (e.g. text)
          </li>
          <li>
            <span className="font-mono text-purple-600">(feathers)</span> The
            plural form of the post's feather (e.g. links)
          </li>
        </ul>
      </div>

      {/* Update Button */}
      <button
  type="button"
  onClick={() => setLocation("/")}   // 👈 redirect to home.tsx
  className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
>
  Update
</button>

    </form>
  </>
)}

          
        </div>
      </div>

      {/* Back button */}
      <button
  onClick={() => setLocation("/admin")}
  className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-gray-600 text-white font-semibold shadow-lg hover:bg-gray-700 transition"
>
  ⬅ Back to Admin
</button>

    </div>
  );
}
