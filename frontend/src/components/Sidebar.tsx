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

    return <aside className="w-64 bg-black border-r px-4 py-6 flex flex-col justify-between">
        {/* Nav Section */}
        <nav className="flex flex-col space-y-3">
            {/* Create Post Button */}
            <Link href="/create-post" className="flex items-center space-x-2 text-gray-400 hover:text-white w-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                <span>Create Post</span>
            </Link>

            {/* Controls Button */}
            <Link
                to="/controls"
                className="flex items-center space-x-2 text-gray-400 hover:text-white w-full"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                    />
                </svg>
                <span>Controls</span>
            </Link>

            {/* Admin Button */}
            <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-400 hover:text-white w-full"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zM6 20h12a2 2 0 002-2V8a2 2 0 00-2-2h-2l-2-2H8L6 6H4a2 2 0 00-2 2v10a2 2 0 002 2h2z"
                    />
                </svg>
                <span>Admin</span>
            </Link>
        </nav>


        {/* Archive Section */}
        <div className=" bg-black text-white p-4 rounded-lg">
            <h3 className="font-bold ">Archive</h3>
          
                {Object.entries(archiveData ?? {}).map(([monthYear, posts]) => (
                    <div key={monthYear}>
                        <button
                            className="w-full text-left px-3 py-2 bg-gray-800 rounded hover:bg-gray-700 font-semibold"
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
                                        // to={post.link}
                                        className="block px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
                                    >
                                        {post.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            
        </div>
    </aside>
}