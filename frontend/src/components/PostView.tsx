import dayjs from "dayjs";
import { markPostViewedPostsPostIdViewPost, type PostRead } from "../api/generated";
import { useAuthStore } from "../state/auth";
import { convertUrlToAbsolute } from "../api/axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useInView } from "react-intersection-observer"
import { useEffect, useRef } from "react";

export default function PostView({
    post,
    handleLike
}: {
    post: PostRead
    handleLike?: () => void
}) {
    // const { inView, ref } = useInView({
    //     threshold: 0.5
    // });
    const authStore = useAuthStore();
    // const hasSentViewEvent = useRef(false);

    // console.log("POST VIEW")

    // // send view event when post comes into view
    // useEffect(() => {
    //     console.log("Post in view:", inView, "Post ID:", post.id);
    //     if (inView && authStore.extensions.views && !hasSentViewEvent.current) {
    //         // send view event to backend
    //         markPostViewedPostsPostIdViewPost(post.id);
    //         hasSentViewEvent.current = true;
    //     }
    // }, [inView, post.id, authStore.extensions.views]);

    const fixedContent = post.content
        ? post.content.replace(/\\n/g, "\n") // 🔑 unescape \n into real newlines
        : "No content available";
    return <article
        key={post.slug}
        className="bg-white rounded-lg text-black shadow hover:shadow-lg transition p-6 flex flex-col w-full items-stretch"
    >
        <h2 className="text-xl font-bold text-black">
            {post.title}
        </h2>
        <p className="text-black">
            Published on {dayjs(post.published_at).format("MMMM D, YYYY")}
        </p>
        <span className="text-black">by {post.author_name}</span>

        <div className="my-4 flex flex-col gap-4">
            {
                post.media_type === "file" && post.media_url && (
                    <a
                        href={convertUrlToAbsolute(post.media_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-800 text-lg font-semibold hover:underline break-all"
                    >
                        Download File &#128190; &rarr;
                    </a>
                )
            }
            {
                post.media_type === "photo" && post.media_url && (
                    <img
                        src={convertUrlToAbsolute(post.media_url)}
                        alt={post.title ?? "Post image"}
                        className="w-full h-auto mb-4 rounded"
                    />
                )
            }
            {
                post.media_type === "video" && post.media_url && (
                    <video
                        src={convertUrlToAbsolute(post.media_url)}
                        controls
                        className="w-full h-auto mb-4 rounded"
                    />
                )
            }
            {post.media_type === "audio" && post.media_url && (
                <audio
                    src={convertUrlToAbsolute(post.media_url)}
                    controls
                    className="w-full h-auto mb-4 rounded"
                />
            )}
            {
                post.link_url && <a
                    href={post.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 text-lg font-semibold hover:underline break-all"
                >
                    {post.link_url}
                </a>
            }
            {post.feather_type !== "quote" &&
                <div className="markdown-body bg-white! text-black!">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {fixedContent}
                    </Markdown>
                </div>}
            {post.feather_type === "quote" &&
                <div className="bg-gray-100 p-4 rounded flex flex-col gap-0">
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                        {post.content ? post.content : "No content available"}
                    </blockquote>
                    {/* source */}
                    {post.quote_source && <cite className="not-italic block text-left text-gray-500 mt-2">— {post.quote_source}</cite>}
                </div>
            }
        </div>
        <div className="flex space-x-4 text-sm text-gray-500 mt-2">
            {authStore.extensions.likes && <span>
                <button className="mr-1">
                    ❤️
                </button>
                {post.likes_count ?? 0}</span>}
            {authStore.extensions.views && <span>
                <button className="mr-1">
                    👁️
                </button>
                {post.view_count ?? 0}</span>}
        </div>
        {authStore.accountInformation && handleLike && <span>
            <button className="font-bold mr-1 text-red-600 underline cursor-pointer" onClick={handleLike}>
                Like this post
            </button>
        </span>}
        {
            authStore.extensions.tags && post.tags && post.tags.length > 0 && (
                <div className="mt-2">
                    {post.tags.map((tag) => (
                        <span
                            key={tag.name as string}
                            className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2"
                        >
                            #{tag.name as string}
                        </span>
                    ))}
                </div>
            )
        }
    </article >
}