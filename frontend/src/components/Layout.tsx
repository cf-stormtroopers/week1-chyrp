import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children, onSearchTextChange }: {
    children: React.ReactNode
    onSearchTextChange?: (text: string) => void
}) {
    return <div className="flex flex-col h-screen bg-orange-50 justify-stretch">
        {/* Header */}
        <Header onSearchTextChange={onSearchTextChange} />
        {/* Main Layout */}
        <div className="flex flex-row flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />
            <main className="flex-1 px-8 py-6 space-y-6 overflow-y-auto flex  flex-col gap-2"
            >
                {children}
            </main>
        </div>
    </div>

}