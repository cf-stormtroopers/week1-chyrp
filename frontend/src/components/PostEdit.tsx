"use client";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { createPostPostsPost, PostStatus, uploadFilesUploadPost, type PostCreate } from "../api/generated";
import type { AxiosError } from "axios";
import MarkdownEditorWrapper from "../components/MarkdownEditorWrapper";

export type PostReadTitle = string | null;
export type PostReadPublishedAt = string | null;
export type PostReadCategoriesItem = { [key: string]: unknown };
export type PostReadTagsItem = { [key: string]: unknown };
export type PostReadContent = string | null;
export type PostReadExcerpt = string | null;
export type PostReadMediaUrl = string | null;
export type PostReadMediaType = string | null;
export type PostReadQuoteSource = string | null;
export type PostReadLinkUrl = string | null;

export interface PostRead {
    id: string;
    author_id: string;
    author_name: string;
    feather_type: string;
    slug: string;
    title: PostReadTitle;
    status: PostStatus;
    published_at: PostReadPublishedAt;
    is_private: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
    categories?: PostReadCategoriesItem[];
    tags?: PostReadTagsItem[];
    likes_count?: number;
    content?: PostReadContent;
    excerpt?: PostReadExcerpt;
    media_url?: PostReadMediaUrl;
    media_type?: PostReadMediaType;
    quote_source?: PostReadQuoteSource;
    link_url?: PostReadLinkUrl;
}

interface PostEditProps {
    post?: PostRead;
    onSave: (data: PostCreate, files: { photoFile?: File; audioFile?: File; videoFile?: File }) => Promise<void>;
    onPublish: () => Promise<void>;
    onCancel: () => void;
    mode: 'create' | 'edit';
}

export default function PostEdit({ post, onSave, onCancel, mode }: PostEditProps) {
    const [title, setTitle] = useState(post?.title || "");
    const [body, setBody] = useState(post?.content || "");
    const [slug, setSlug] = useState(post?.slug || "");
    const [, setLocation] = useLocation();
    const [status, setStatus] = useState(() => {
        if (!post) return "public";
        switch (post.status) {
            case PostStatus.published: return "public";
            case PostStatus.private: return "private";
            case PostStatus.draft: return "draft";
            default: return "public";
        }
    });
    const [priority, setPriority] = useState("medium");
    const [parent, setParent] = useState("none");
    const [pinned, setPinned] = useState(false);
    const [timestamp, setTimestamp] = useState("");
    const [editorMode, setEditorMode] = useState<
        "text" | "photo" | "uploader" | "link" | "quote" | "audio" | "video"
    >(post?.feather_type as any || "text");

    // new for photo/uploader/link/quote/audio
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [altText, setAltText] = useState("");
    const [source, setSource] = useState("");
    const [url, setUrl] = useState(post?.link_url || "");
    const [quote, setQuote] = useState(post?.content || "");
    const [quoteSource, setQuoteSource] = useState(post?.quote_source || "");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [captionText, setCaptionText] = useState(""); // changed from file to text

    const randomNum = useMemo(() => Math.floor(Math.random() * 1000), []);

    useEffect(() => {
        if (mode === 'create') {
            // slugify title with a random number for uniqueness
            const slugified = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .substring(0, 50);
            setSlug(slugified + "-" + randomNum);
        }
    }, [title, randomNum, mode]);

    useEffect(() => {
        if (mode === 'create') {
            const now = new Date();
            setTimestamp(now.toISOString().slice(0, 19).replace("T", " "));
        } else if (post) {
            setTimestamp(post.created_at.slice(0, 19).replace("T", " "));
        }
    }, [mode, post]);

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

            await onSave(data, { photoFile: photoFile || undefined, audioFile: audioFile || undefined, videoFile: videoFile || undefined });
        } catch (e: any | AxiosError) {
            console.log(e)
            alert("Failed to save post: " + (e?.response?.data?.message || e.message || "Unknown error"));
        }
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-cover bg-center text-dark"
            bg-accent
        >
            <div className="max-w-3xl mx-auto bg-accent shadow-lg rounded-lg p-6 space-y-6">
                {/* Back Button */}
                <button
                    onClick={onCancel}
                    className="text-primary hover:text-black text-xl font-bold"
                >
                    &larr;
                </button>
                <h1 className="text-2xl font-bold text-dark">
                    {mode === 'create' ? 'Create a post' : 'Edit post'}
                </h1>
                {/* Title */}
                <div>
                    <label className="block font-semibold mb-2 text-dark">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-800 text-dark"
                        placeholder="Enter post title..."
                    />
                </div>
                {/* Mode Buttons */}
                <div>
                    <label className="block font-semibold mb-2 text-dark">Body</label>
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
                                        ? "bg-accent text-dark"
                                        : "bg-accent text-dark border-gray-300 hover:bg-secondary hover:text-dark"
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
                                <label className="block font-semibold mb-2 text-dark">
                                    Upload Photo
                                </label>
                                <div className="w-full">
                                    <label className="block cursor-pointer bg-primary text-dark px-4 py-2 rounded-lg text-center hover:bg-secondary">
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
                                        <p className="mt-2 text-sm text-dark">
                                            Selected: {photoFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Uploader mode */}
                    {editorMode === "uploader" && (
                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block font-semibold mb-2 text-dark">
                                    Upload File
                                </label>
                                <div className="w-full">
                                    <label className="block cursor-pointer bg-primary text-dark px-4 py-2 rounded-lg text-center hover:bg-secondary">
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
                                        <p className="mt-2 text-sm text-dark">
                                            Selected: {photoFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Link mode */}
                    {editorMode === "link" && (
                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block font-semibold mb-2 text-dark">URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full border rounded-lg p-2 text-dark"
                                    placeholder="Enter the link here..."
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-dark">
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
                                <label className="block font-semibold mb-2 text-dark">Quote</label>
                                <MarkdownEditorWrapper
                                    value={quote}
                                    onChange={setQuote}
                                    placeholder="Enter the quote..."
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-dark">Source</label>
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
                                <label className="block font-semibold mb-2 text-dark">
                                    Audio File
                                </label>
                                <div className="w-full">
                                    <label className="block cursor-pointer bg-primary text-dark px-4 py-2 rounded-lg text-center hover:bg-secondary">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="hidden"
                                            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    {audioFile && (
                                        <p className="mt-2 text-sm text-dark">
                                            Selected: {audioFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Description */}
                            <div>
                                <label className="block font-semibold mb-2 text-dark">
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
                                <label className="block font-semibold mb-2 text-dark">
                                    Video File
                                </label>
                                <div className="w-full">
                                    <label className="block cursor-pointer bg-primary text-dark px-4 py-2 rounded-lg text-center hover:bg-secondary">
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
                                        <p className="mt-2 text-sm text-dark">
                                            Selected: {videoFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Description */}
                            <div>
                                <label className="block font-semibold mb-2 text-dark">
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
                            <label className="block font-semibold mb-2 text-dark">Caption</label>
                            <MarkdownEditorWrapper
                                value={editorMode === "uploader" ? captionText : body}
                                onChange={editorMode === "uploader" ? setCaptionText : setBody}
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
                        <label className="block font-semibold mb-2 text-dark">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full border rounded-lg p-2 text-dark"
                            placeholder="post-slug"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2 text-dark">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border rounded-lg p-2 text-dark"
                        >
                            <option value="public">Public and visible</option>
                            <option value="private">Private</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Extra Fields */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1 text-dark">
                            Timestamp
                        </label>
                        <input
                            type="text"
                            value={timestamp}
                            readOnly
                            className="border rounded p-2 bg-accent text-dark cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    {/* <button
                        onClick={onPublish}
                        className="px-6 py-2 bg-primary text-secondary rounded hover:bg-gray-400 hover:text-primary transition"
                    >
                        Publish
                    </button> */}
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-primary text-white font-bold rounded hover:bg-secondary hover:text-primary transition"
                    >
                        Save
                    </button>
                    
                    
                </div>
            </div>
        </div>
    );
}