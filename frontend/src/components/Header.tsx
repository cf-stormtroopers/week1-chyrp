import { useState } from "react";
import { useAuthStore } from "../state/auth"
import { Link } from "wouter";

export default function Header(
    {
        onSearchTextChange,
    }: {
        onSearchTextChange?: (text: string) => void
    }
) {
    const authStore = useAuthStore();
    const [openProfile, setOpenProfile] = useState(false);

    return <header className="flex items-center justify-between px-6 py-8 bg-black shadow border-b border-white">
        <Link to="/">
            <div
                style={{ fontFamily: "Georgia, serif" }}
                className="font-bold text-4xl cursor-pointer"
            >
                {authStore.blogTitle ?? "Stormtrooper Chyrp"}
            </div>
        </Link>

        {/* Search */}
        {onSearchTextChange && <input
            type="text"
            placeholder="Search..."
            className="w-1/2 px-4 py-3 border rounded-lg focus:outline-none focus:ring focus:black"
            onChange={(e) => onSearchTextChange?.(e.target.value)}
        />}

        {/* Right actions */}
        <div className="flex items-center space-x-6">
            <div className="relative">
                <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="focus:outline-none"
                >
                    <img
                        src="/pfp.jpg"
                        alt="profile"
                        className="rounded-full w-15 h-15"
                    />
                </button>

                {openProfile && (
                    <div className="absolute right-0 mt-2 pb-[0.35rem] w-40 bg-white rounded-lg shadow-lg text-black z-50">
                        <div className="px-4 py-2 border-b">
                            <span className="font-semibold">{authStore.accountInformation?.display_name}</span>
                        </div>
                        <Link to="/controls">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-400"
                            >
                                Account
                            </button>
                        </Link>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-400"
                            onClick={() => authStore.logout()} // <-- fixed
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    </header>
}