import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import AdminNav from "./AdminNav";
import { useAuthStore } from "../state/auth";
import { updateExtensionStatusSiteExtensionExtensionSlugPut } from "../api/generated";

interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export default function ExtendPage() {
  const authStore = useAuthStore();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Modules");

  // Status messages
  const [touched, setTouched] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [feathersTouched, setFeathersTouched] = useState(false);
  const [featherStatus, setFeatherStatus] = useState<string | null>(null);

  const [themeTouched, setThemeTouched] = useState(false);
  const [themeStatus, setThemeStatus] = useState<string | null>(null);

  const [modules, setModules] = useState<Module[]>([
    // { id: "captcha", name: "MAPTCHA", description: "Ask users to solve simple mathematics problems to prevent spam.", enabled: false },
    // { id: "migration", name: "Migration Assistant", description: "Enables import from Wordpress, MovableType, TextPattern, and Tumblr.", enabled: false },
    // { id: "embed", name: "Easy Embed", description: "Embed content in your blog by pasting its URL surrounded by <!-- and -->.", enabled: false },
    // { id: "rights", name: "Rights", description: "Adds post options for attribution and assigning intellectual property rights.", enabled: false },
    { id: "likes", name: "Likes", description: "Allow users to “like” a post.", enabled: false },
    // { id: "readmore", name: "Read More", description: "Add “…more” links by typing <!--more--> or <!--more custom text--> in posts.", enabled: false },
    // { id: "mentionable", name: "Mentionable", description: "Register webmentions from blogs that link to yours.", enabled: false },
    // { id: "sitemap", name: "Sitemap Generator", description: "Creates a sitemap.xml file for search engines.", enabled: false },
    { id: "views", name: "Post Views", description: "Counts the number of times your posts have been viewed.", enabled: false },
    // { id: "lightbox", name: "Lightbox", description: "A lightbox for your images.", enabled: false },
    // { id: "cascade", name: "Cascade", description: "Adds ajax-powered infinite scrolling to your blog.", enabled: false },
    // { id: "categorize", name: "Categorize", description: "Categorize your posts.", enabled: false },
    { id: "tags", name: "Tagginator", description: "Adds tagging functionality to posts.", enabled: false },
    // { id: "syntax", name: "Syntax Highlighting", description: "Adds syntax highlighting to nested <pre><code> blocks.", enabled: false },
    { id: "comments", name: "Comments", description: "Adds commenting functionality with webmention support.", enabled: false },
    // { id: "cacher", name: "Cacher", description: "Caches pages, drastically reducing server load.", enabled: false },
    // { id: "mathjax", name: "MathJax", description: "A JavaScript display engine for mathematics.", enabled: false },
  ]);

  const [feathers, setFeathers] = useState<Module[]>([
    { id: "uploader", name: "Uploader", description: "Upload files and make them available for visitors to download.", enabled: true },
    { id: "photo", name: "Photo", description: "Upload and display an image with a caption.", enabled: true },
    { id: "link", name: "Link", description: "Link to other sites and add an optional description.", enabled: true },
    { id: "text", name: "Text", description: "A basic text feather.", enabled: true },
    { id: "quote", name: "Quote", description: "Post quotes and cite sources.", enabled: true },
    { id: "audio", name: "Audio", description: "A feather for audio.", enabled: true },
    { id: "video", name: "Video", description: "Upload and embed videos.", enabled: true },
  ]);


  useEffect(() => {
    const extensionsToEnable = [
      authStore.extensions.comments ? "comments" : null,
      authStore.extensions.likes ? "likes" : null,
      authStore.extensions.views ? "views" : null,
      authStore.extensions.tags ? "tags" : null,
    ];

    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        enabled: extensionsToEnable.includes(mod.id),
      }))
    );
  }, [authStore.extensions]);

  // Toggle module
  const toggleModule = async (id: string) => {
    setTouched(true);
    try {
      await updateExtensionStatusSiteExtensionExtensionSlugPut(id, {
        active: !modules.find((m) => m.id === id)?.enabled,
      })
      authStore.mutate();
    } catch (e) {
      alert("An error occurred while updating extensions.");
      console.error(e);
    }
  };

  // Toggle feather
  const toggleFeather = (id: string) => {
    setFeathersTouched(true);
    setFeathers((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const newEnabled = !f.enabled;
          setFeatherStatus(newEnabled ? "Extension enabled." : "Extension disabled.");
          return { ...f, enabled: newEnabled };
        }
        return f;
      })
    );
  };


  // UI sections
  const renderModules = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black mb-4">Modules</h2>
      {touched && statusMessage && (
        <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">{statusMessage}</div>
      )}
      <div className="space-y-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${mod.enabled ? "bg-green-100 text-black" : "bg-gray-100"
              }`}
          >
            <div>
              <h3 className="font-semibold">{mod.name}</h3>
              <p className="text-sm text-gray-600">{mod.description}</p>
            </div>
            <button
              onClick={() => toggleModule(mod.id)}
              className={`px-4 py-2 rounded font-semibold ${mod.enabled
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              {mod.enabled ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeathers = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black mb-4">Feathers</h2>
      {feathersTouched && featherStatus && (
        <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">{featherStatus}</div>
      )}
      <div className="space-y-4">
        {feathers.map((f) => (
          <div
            key={f.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${f.enabled ? "bg-green-100 text-black" : "bg-gray-100"
              }`}
          >
            <div>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
            {/* <button
              onClick={() => toggleFeather(f.id)}
              className={`px-4 py-2 rounded font-semibold ${f.enabled
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              {f.enabled ? "Disable" : "Enable"}
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col min-h-screen bg-accent text-black"
    >

      {/* Tabs */}
      <AdminNav />
      <div className="flex justify-center space-x-2 bg-white shadow px-4 py-2">
        {["Modules", "Feathers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-semibold border 
              ${activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-grow p-8">
        {activeTab === "Modules" && renderModules()}
        {activeTab === "Feathers" && renderFeathers()}
      </div>

      {/*{activeTab === "Themes" && renderThemes()} *
      </div>

      {/* <div className="p-8">
        {renderModules()}
      </div> */}



      {/* Back */}
      <button
        onClick={() => setLocation("/admin")}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-secondary text-dark font-semibold shadow-lg hover:bg-primary transition"
      >
        ⬅ Home
      </button>
    </div>
  );
}
