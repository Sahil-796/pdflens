import React from "react"
import CurrentUser from "./CurrentUser"
import ThemeToggle from "./ThemeToggle"
import Link from "next/link"

const Sidebar = () => {
    return (
        <aside className="flex flex-col gap-6 border-r border-border bg-card text-foreground w-64 p-6">
            {/* Current User */}
            <div className="flex items-center justify-between">
            <CurrentUser />
            <ThemeToggle />
            </div>

            {/* Brand / Logo */}
            <div className="text-2xl font-bold tracking-tight">
                PDF Lens
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 mt-6">
                <button className="px-3 py-2 rounded-md hover:bg-accent text-left transition">
                    My PDFs
                </button>
                <button className="px-3 py-2 rounded-md hover:bg-accent text-left transition">
                    Favourites
                </button>
                <button className="px-3 py-2 rounded-md hover:bg-accent text-left transition">
                    Trash
                </button>
                <Link href={'/generate'} className="px-3 py-2 rounded-md hover:bg-accent text-left transition">
                    Create PDF
                </Link>
                <button className="px-3 py-2 rounded-md hover:bg-accent text-left transition">
                    Edit PDF
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar