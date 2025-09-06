import { Link } from "wouter";
import { useListPostsPostsGet } from "../api/generated";
import { useState } from "react";

export default function Sidebar() {
    const { data: posts } = useListPostsPostsGet()

    const archiveData = posts?.reduce((acc, post) => {
        const date = new Date(post.published_at ?? 0);
        const monthYear = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });

        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push({ title: post.title ?? "", link: `/posts/${post.slug}` });
        return acc;
    }, {} as Record<string, { title: string; link: string }[]>);

    const [openMonth, setOpenMonth] = useState<string | null>(null);

    return (
        <aside className="flex flex-col px-4 py-6 w-64 border-r bg-primary">
            
            {/* Archive Section with its own scrollbar */}
            <div className="flex overflow-y-auto flex-col flex-1 gap-2 p-4 text-2xl rounded-lg bg- text-dark">
                <h3 className="font-bold">Archive</h3>

                {Object.entries(archiveData ?? {}).map(([monthYear, posts]) => (
                    <div key={monthYear}>
                        <button
                            className="px-3 py-2 w-full font-semibold text-2xl text-left rounded bg-primary hover:bg-secondary"
                            onClick={() =>
                                setOpenMonth(openMonth === monthYear ? null : monthYear)
                            }
                        >
                            {monthYear}
                        </button>

                        {openMonth === monthYear && (
                            <div className="mt-2 ml-3 space-y-2">
                                {posts.map((post, idx) => (
                                    <div
                                        key={idx}
                                        className="block px-3 py-2 text-sm text-2xl rounded bg-primary hover:bg-secondary"
                                    >
                                        {post.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Nav Section (always pinned at bottom) */}
            <nav className="flex flex-col mt-4 space-y-3">
                <Link href="/create-post" className="flex items-center space-x-2 w-full font-bold text-dark text-2xl hover:text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>Create Post</span>
                </Link>

                <Link to="/settings" className="flex items-center space-x-2 w-full font-bold text-dark text-2xl hover:text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zM6 20h12a2 2 0 002-2V8a2 2 0 00-2-2h-2l-2-2H8L6 6H4a2 2 0 00-2 2v10a2 2 0 002 2h2z"/>
                    </svg>
                    <span>Admin</span>
                </Link>
            </nav>
        </aside>
    )
}
