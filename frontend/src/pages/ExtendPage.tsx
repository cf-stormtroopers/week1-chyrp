import { useState } from "react";
import { useLocation } from "wouter";

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
    { id: "captcha", name: "MAPTCHA", description: "Ask users to solve simple mathematics problems to prevent spam.", enabled: false },
    { id: "migration", name: "Migration Assistant", description: "Enables import from Wordpress, MovableType, TextPattern, and Tumblr.", enabled: false },
    { id: "embed", name: "Easy Embed", description: "Embed content in your blog by pasting its URL surrounded by <!-- and -->.", enabled: false },
    { id: "rights", name: "Rights", description: "Adds post options for attribution and assigning intellectual property rights.", enabled: false },
    { id: "likes", name: "Likes", description: "Allow users to “like” a post.", enabled: false },
    { id: "readmore", name: "Read More", description: "Add “…more” links by typing <!--more--> or <!--more custom text--> in posts.", enabled: false },
    { id: "mentionable", name: "Mentionable", description: "Register webmentions from blogs that link to yours.", enabled: false },
    { id: "sitemap", name: "Sitemap Generator", description: "Creates a sitemap.xml file for search engines.", enabled: false },
    { id: "postviews", name: "Post Views", description: "Counts the number of times your posts have been viewed.", enabled: false },
    { id: "lightbox", name: "Lightbox", description: "A lightbox for your images.", enabled: false },
    { id: "cascade", name: "Cascade", description: "Adds ajax-powered infinite scrolling to your blog.", enabled: false },
    { id: "categorize", name: "Categorize", description: "Categorize your posts.", enabled: false },
    { id: "tagginator", name: "Tagginator", description: "Adds tagging functionality to posts.", enabled: false },
    { id: "syntax", name: "Syntax Highlighting", description: "Adds syntax highlighting to nested <pre><code> blocks.", enabled: false },
    { id: "comments", name: "Comments", description: "Adds commenting functionality with webmention support.", enabled: false },
    { id: "cacher", name: "Cacher", description: "Caches pages, drastically reducing server load.", enabled: false },
    { id: "mathjax", name: "MathJax", description: "A JavaScript display engine for mathematics.", enabled: false },
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

  const [themes, setThemes] = useState<Theme[]>([
    { id: "sparrow", name: "Sparrow", description: "An unobtrusive tumbleblog theme for Chyrp Lite.", active: false },
    { id: "topaz", name: "Topaz", description: "A minimalist responsive theme for Chyrp Lite.", active: false },
    { id: "blossom", name: "Blossom", description: "The default theme provided with Chyrp Lite.", active: true },
    { id: "umbra", name: "Umbra", description: "A dark tumbleblog theme for Chyrp Lite.", active: false },
    { id: "virgula", name: "Virgula", description: "A high-contrast theme for Chyrp Lite.", active: false },
  ]);

  // Toggle module
  const toggleModule = (id: string) => {
    setTouched(true);
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === id) {
          const newEnabled = !mod.enabled;
          setStatusMessage(newEnabled ? "Extension enabled." : "Extension disabled.");
          return { ...mod, enabled: newEnabled };
        }
        return mod;
      })
    );
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

  // Select theme
  const selectTheme = (id: string) => {
    setThemeTouched(true);
    setThemes((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          setThemeStatus(`Theme "${t.name}" selected.`);
          return { ...t, active: true };
        }
        return { ...t, active: false };
      })
    );
  };

  // UI sections
  const renderModules = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Modules</h2>
      {touched && statusMessage && (
        <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">{statusMessage}</div>
      )}
      <div className="space-y-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${
              mod.enabled ? "bg-green-100 text-black" : "bg-gray-100"
            }`}
          >
            <div>
              <h3 className="font-semibold">{mod.name}</h3>
              <p className="text-sm text-gray-600">{mod.description}</p>
            </div>
            <button
              onClick={() => toggleModule(mod.id)}
              className={`px-4 py-2 rounded font-semibold ${
                mod.enabled
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
      <h2 className="text-2xl font-bold mb-4">Feathers</h2>
      {feathersTouched && featherStatus && (
        <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">{featherStatus}</div>
      )}
      <div className="space-y-4">
        {feathers.map((f) => (
          <div
            key={f.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${
              f.enabled ? "bg-green-100 text-black" : "bg-gray-100"
            }`}
          >
            <div>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
            <button
              onClick={() => toggleFeather(f.id)}
              className={`px-4 py-2 rounded font-semibold ${
                f.enabled
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {f.enabled ? "Disable" : "Enable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThemes = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Blog Themes</h2>
      {themeTouched && themeStatus && (
        <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">{themeStatus}</div>
      )}
      <div className="space-y-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`p-4 border rounded-lg ${
              theme.active ? "bg-green-100 text-black" : "bg-gray-100"
            }`}
          >
            <h3 className="font-semibold">{theme.name}</h3>
            <p className="text-sm text-gray-600">{theme.description}</p>
            <div className="mt-2 flex space-x-2">
              <button
                disabled={theme.active}
                className={`px-4 py-2 rounded ${
                  theme.active
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Preview
              </button>
              <button
                disabled={theme.active}
                onClick={() => selectTheme(theme.id)}
                className={`px-4 py-2 rounded ${
                  theme.active
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-black">
      {/* Tabs */}
      <div className="flex justify-center space-x-2 bg-gray-200 shadow px-4 py-2">
        {["Modules", "Feathers", "Themes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-semibold border 
              ${
                activeTab === tab
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow p-8">
        {activeTab === "Modules" && renderModules()}
        {activeTab === "Feathers" && renderFeathers()}
        {activeTab === "Themes" && renderThemes()}
      </div>

      {/* Back */}
      <button
        onClick={() => setLocation("/admin")}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-gray-600 text-white font-semibold shadow-lg hover:bg-gray-700 transition"
      >
        ⬅ Back to Admin
      </button>
    </div>
  );
}
