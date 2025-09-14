import React from "react";
import CurrentUser from "./CurrentUser";
import ThemeToggle from "./ThemeToggle";
import ThemeStyle from "./ThemeStyle";
import LogoutButton from "./logout-button";
import Link from "next/link";

const Sidebar = () => {
    return (
        <aside className="flex flex-col justify-between w-64 p-6 border-r border-border bg-card text-foreground">
            {/* Top Section: Theme + Brand */}
            <div className="flex flex-col gap-6">
                {/* Theme Controls */}
                <div className="flex items-center justify-between">
                    {/* <CurrentUser /> */}
                    <ThemeStyle />
                    <ThemeToggle />
                </div>

                {/* Brand / Logo */}
                <div className="text-2xl font-bold tracking-tight">PDF Lens</div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 mt-4">
                    <Link
                        href="#"
                        className="px-3 py-2 rounded-md hover:bg-accent transition text-left"
                    >
                        My PDFs
                    </Link>
                    <Link
                        href="#"
                        className="px-3 py-2 rounded-md hover:bg-accent transition text-left"
                    >
                        Favourites
                    </Link>
                    <Link
                        href="#"
                        className="px-3 py-2 rounded-md hover:bg-accent transition text-left"
                    >
                        Trash
                    </Link>
                    <Link
                        href="/generate"
                        className="px-3 py-2 rounded-md hover:bg-accent transition text-left"
                    >
                        Create PDF
                    </Link>
                    <Link
                        href="#"
                        className="px-3 py-2 rounded-md hover:bg-accent transition text-left"
                    >
                        Edit PDF
                    </Link>
                </nav>
            </div>

            {/* Bottom Section: Logout */}
            <div className="mt-6">
                <LogoutButton />
            </div>
        </aside>
    );
};

export default Sidebar;