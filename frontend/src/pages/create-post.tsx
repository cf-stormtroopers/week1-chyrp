"use client";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { createPostPostsPost, PostStatus, uploadFilesUploadPost, type PostCreate } from "../api/generated";
import type { AxiosError } from "axios";
import MarkdownEditorWrapper from "../components/MarkdownEditorWrapper";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("public");
  const [priority, setPriority] = useState("medium");
  const [parent, setParent] = useState("none");
  const [pinned, setPinned] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [editorMode, setEditorMode] = useState<
    "text" | "photo" | "uploader" | "link" | "quote" | "audio" | "video"
  >("text");
  // new for photo/uploader/link/quote/audio
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteSource, setQuoteSource] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [captionText, setCaptionText] = useState(""); // changed from file to text
  // wouter hook for navigation
  const [, setLocation] = useLocation();
  const randomNum = useMemo(() => Math.floor(Math.random() * 1000), []);

  useEffect(() => {
    // slugify title with a random number for uniqueness
    const slugified = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);
    setSlug(slugified + "-" + randomNum);
  }, [title, randomNum]);

  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toISOString().slice(0, 19).replace("T", " "));
  }, []);

  const handlePublish = async () => {
    alert("Post published!");
    setLocation("/");
  };

  const handleSave = async () => {
    try {
      let data: PostCreate = {
        feather_type: editorMode,
        title,
        slug,
        is_private: false,
      }
      switch (status) {
        case "public":
          data.status = PostStatus.published;
          break;
        case "private":
          data.status = PostStatus.private;
          break;
        case "draft":
          data.status = PostStatus.draft;
          break;
      }
      switch (editorMode) {
        case "text":
          data.content = body;
          break;
        case "photo":
          data.media_type = "photo";
          break;
        case "link":
          data.link_url = url;
          data.content = body;
          break;
        case "quote":
          data.content = quote;
          data.quote_source = quoteSource;
          break;
        case "audio":
          data.media_type = "audio";
          data.content = body;
          break;
        case "video":
          // For simplicity, using the same field as audio
          data.media_type = "video";
          data.content = body;
          break;
        case "uploader":
          data.media_type = "file";
          data.content = captionText;
          break;
      }
      const isFileUpload = editorMode === "photo" || editorMode === "uploader" || editorMode === "audio" || editorMode === "video";
      if (isFileUpload) {
        const res = await uploadFilesUploadPost({
          files: editorMode === "audio" ? audioFile ? [audioFile] : [] : photoFile ? [photoFile] : videoFile ? [videoFile] : [],
          post_id: null,
        });
        if (res && res.length > 0) {
          const fileId = res[0].id;
          data.media_url = `/upload/${fileId}/download`;
        } else {
          alert("File upload failed");
          return;
        }
      }
      const res = await createPostPostsPost(data)
      if (res && res.id) {
        alert("Post created!");
        setTimeout(() => {
          setLocation(`/posts/${res.slug}`);
        }, 1000);
      }
    } catch (e: any | AxiosError) {
      console.log(e)
      alert("Failed to create post: " + (e?.response?.data?.message || e.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setLocation("/")}
          className="text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &larr;
        </button>
        <h1 className="text-2xl font-bold text-black">Create a post</h1>
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
        {/* Mode Buttons */}
        <div>
          <label className="block font-semibold mb-2 text-black">Body</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
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
                onClick={() =>
                  setEditorMode(
                    item.toLowerCase() as
                    | "text"
                    | "photo"
                    | "uploader"
                    | "link"
                    | "quote"
                    | "audio"
                    | "video"
                  )
                }
                className={`px-4 py-2 border text-sm font-medium rounded-md transition
              ${editorMode === item.toLowerCase()
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Photo mode */}
          {editorMode === "photo" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Upload Photo
                </label>
                <div className="w-full">
                  <label className="block cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-300">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {photoFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {photoFile.name}
                    </p>
                  )}
                </div>
              </div>
              {/* <div>
                <label className="block font-semibold mb-2 text-black">
                  Alternative Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full border rounded-lg p-2 text-black"
                  placeholder="Describe the photo..."
                />
              </div> */}
              {/* <div>
                <label className="block font-semibold mb-2 text-black">
                  Source
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border rounded-lg p-2 text-black"
                  placeholder="Image source..."
                />
              </div> */}
            </div>
          )}

          {/* Uploader mode */}
          {editorMode === "uploader" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Upload File
                </label>
                <div className="w-full">
                  <label className="block cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-300">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {photoFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {photoFile.name}
                    </p>
                  )}
                </div>
              </div>
              {/* <div>
                <label className="block font-semibold mb-2 text-black">
                  Source
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border rounded-lg p-2 text-black"
                  placeholder="File source..."
                />
              </div> */}
            </div>
          )}

          {/* Link mode */}
          {editorMode === "link" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block font-semibold mb-2 text-black">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border rounded-lg p-2 text-black"
                  placeholder="Enter the link here..."
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Description
                </label>
                <MarkdownEditorWrapper
                  value={body}
                  onChange={setBody}
                  placeholder="Write the description here..."
                />
              </div>
            </div>
          )}

          {/* Quote mode */}
          {editorMode === "quote" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block font-semibold mb-2 text-black">Quote</label>
                <MarkdownEditorWrapper
                  value={quote}
                  onChange={setQuote}
                  placeholder="Enter the quote..."
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-black">Source</label>
                <MarkdownEditorWrapper
                  value={quoteSource}
                  onChange={setQuoteSource}
                  placeholder="Enter the source..."
                />
              </div>
            </div>
          )}

          {/* Audio mode */}
          {editorMode === "audio" && (
            <div className="space-y-4 mb-4">
              {/* Audio File */}
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Audio File
                </label>
                <div className="w-full">
                  <label className="block cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-300">
                    Choose File
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {audioFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {audioFile.name}
                    </p>
                  )}
                </div>
              </div>
              {/* Captions (changed to text area) */}
              {/* <div>
                <label className="block font-semibold mb-2 text-black">
                  Captions
                </label>
                <textarea
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg p-2 text-black"
                  placeholder="Type the caption here..."
                />
              </div> */}
              {/* Description */}
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Description
                </label>
                <MarkdownEditorWrapper
                  value={body}
                  onChange={setBody}
                  placeholder="Write the description here..."
                />
              </div>
            </div>
          )}

          {/* Video mode */}
          {editorMode === "video" && (
            <div className="space-y-4 mb-4">
              {/* Video File */}
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Video File
                </label>
                <div className="w-full">
                  <label className="block cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-300">
                    Choose File
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        console.log("Video selected:", e.target.files?.[0]);
                        setVideoFile(e.target.files?.[0] || null);
                      }}
                    />
                  </label>
                  {videoFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {videoFile.name}
                    </p>
                  )}
                </div>
              </div>
              {/* Poster Image */}
              {/* <div>
                <label className="block font-semibold mb-2 text-black">
                  Poster Image
                </label>
                <div className="w-full">
                  <label className="block cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-300">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        console.log("Poster image selected:", e.target.files?.[0])
                      }
                    />
                  </label>
                </div>
              </div> */}
              {/* Captions */}
              {/* <div>
                <label className="block font-semibold mb-2 text-black">
                  Captions
                </label>
                <textarea
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg p-2 text-black"
                  placeholder="Type the caption here..."
                />
              </div> */}
              {/* Description */}
              <div>
                <label className="block font-semibold mb-2 text-black">
                  Description
                </label>
                <MarkdownEditorWrapper
                  value={body}
                  onChange={setBody}
                  placeholder="Write the description here..."
                />
              </div>
            </div>
          )}

          {/* Caption or Body */}
          {editorMode === "photo" || editorMode === "uploader" ? (
            <div>
              <label className="block font-semibold mb-2 text-black">Caption</label>
              <MarkdownEditorWrapper
                value={body}
                onChange={setBody}
                placeholder="Write the caption here..."
              />
            </div>
          ) : editorMode !== "quote" && editorMode !== "link" && editorMode !== "audio" && editorMode !== "video" ? (
            <MarkdownEditorWrapper
              value={body}
              onChange={setBody}
              placeholder="Write your content here..."
            />
          ) : null}
        </div>

        {/* Slug & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-black">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border rounded-lg p-2 text-black"
              placeholder="post-slug"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-black">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2 text-black"
            >
              <option value="public">Public and visible</option>
              <option value="private">Private</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Extra Fields */}
        <div className="grid grid-cols-2 gap-6">
          {/* <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-black">
              Pinned?{" "}
              <span className="font-normal">
                (shows this post above all others)
              </span>
            </label>
            <div className="relative">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="appearance-none w-5 h-5 border border-black rounded-sm
                  checked:bg-black checked:border-black cursor-pointer"
              />
              {pinned && (
                <span className="absolute left-1 top-0 text-white text-sm pointer-events-none">
                  ✓
                </span>
              )}
            </div>
          </div> */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-black">
              Timestamp
            </label>
            <input
              type="text"
              value={timestamp}
              readOnly
              className="border rounded p-2 bg-gray-200 text-black cursor-not-allowed"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePublish}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-400 hover:text-black transition"
          >
            Publish
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-400 hover:text-black transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}