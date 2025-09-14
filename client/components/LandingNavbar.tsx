"use client";
import React, { useState } from "react";
import { Menu, FileText, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full border-b border-border bg-background text-primary fixed top-0 left-0">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href={'/'} className="text-xl font-bold">PDF Lens</Link>

                {/* Desktop Menu */}
                <div className="hidden items-center space-x-6 md:flex">
                    {/* PDF Tools Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 font-medium hover:text-accent transition">
                            PDF Tools
                            <svg
                                className="h-4 w-4 transition-transform group-hover:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                        <div className="absolute left-0 mt-2 hidden w-48 rounded-xl border border-border bg-background shadow-lg group-hover:block">
                            <a
                                href="#merge"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10"
                            >
                                <FileText size={16} /> Merge PDF
                            </a>
                            <a
                                href="#split"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10"
                            >
                                <FileText size={16} /> Split PDF
                            </a>
                            <a
                                href="#compress"
                                className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10"
                            >
                                <FileText size={16} /> Compress PDF
                            </a>
                        </div>
                    </div>

                    {/* Other Links */}
                    <a href="#features" className="hover:text-accent transition">
                        Features
                    </a>
                    <a href="#pricing" className="hover:text-accent transition">
                        Pricing
                    </a>
                    <a href="#faq" className="hover:text-accent transition">
                        FAQ
                    </a>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-border text-primary hover:bg-accent/10"
                            >
                                <LogIn size={16} /> Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="flex items-center gap-2 bg-accent text-accent-foreground hover:opacity-90">
                                <UserPlus size={16} /> Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <Menu />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="space-y-3 border-t border-border bg-background px-6 py-4 md:hidden">
                    <details>
                        <summary className="cursor-pointer font-medium">PDF Tools</summary>
                        <div className="ml-4 mt-2 space-y-2">
                            <a href="#merge" className="block text-sm hover:text-accent">
                                Merge PDF
                            </a>
                            <a href="#split" className="block text-sm hover:text-accent">
                                Split PDF
                            </a>
                            <a href="#compress" className="block text-sm hover:text-accent">
                                Compress PDF
                            </a>
                        </div>
                    </details>
                    <a href="#features" className="block hover:text-accent">
                        Features
                    </a>
                    <a href="#pricing" className="block hover:text-accent">
                        Pricing
                    </a>
                    <a href="#faq" className="block hover:text-accent">
                        FAQ
                    </a>
                    <div className="flex items-center gap-3 pt-3">
                        <Link href="/login" className="flex-1">
                            <Button
                                variant="outline"
                                className="w-full border-border text-primary hover:bg-accent/10"
                            >
                                <LogIn size={16} className="mr-2" /> Login
                            </Button>
                        </Link>
                        <Link href="/signup" className="flex-1">
                            <Button className="w-full bg-accent text-accent-foreground hover:opacity-90">
                                <UserPlus size={16} className="mr-2" /> Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;