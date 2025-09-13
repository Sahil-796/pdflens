'use client';
import React, { useState, useRef, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const LandingNavbar = () => {
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toolsRef = useRef(null);

    const tools = [
        {
            category: "PDF Compression",
            items: [
                { name: "Compress PDF", icon: "📦", description: "Reduce PDF file size" },
                { name: "Optimize PDF", icon: "⚡", description: "Optimize for web" }
            ]
        },
        {
            category: "PDF Conversion",
            items: [
                { name: "PDF to Excel", icon: "📊", description: "Convert PDF to spreadsheet" },
                { name: "PDF to Word", icon: "📄", description: "Convert PDF to document" },
                { name: "PDF to PowerPoint", icon: "📽️", description: "Convert PDF to presentation" },
                { name: "PDF to Images", icon: "🖼️", description: "Extract images from PDF" }
            ]
        },
        {
            category: "Document to PDF",
            items: [
                { name: "Word to PDF", icon: "📝", description: "Convert documents to PDF" },
                { name: "Excel to PDF", icon: "📈", description: "Convert spreadsheets to PDF" },
                { name: "PowerPoint to PDF", icon: "🎯", description: "Convert presentations to PDF" },
                { name: "Images to PDF", icon: "🖼️", description: "Convert images to PDF" }
            ]
        },
        {
            category: "PDF Manipulation",
            items: [
                { name: "Merge PDF", icon: "🔗", description: "Combine multiple PDFs" },
                { name: "Split PDF", icon: "✂️", description: "Split PDF into pages" },
                { name: "Rotate PDF", icon: "🔄", description: "Rotate PDF pages" },
                { name: "Extract Pages", icon: "📑", description: "Extract specific pages" }
            ]
        },
        {
            category: "PDF Security",
            items: [
                { name: "Password Protect", icon: "🔒", description: "Add password protection" },
                { name: "Remove Password", icon: "🔓", description: "Remove PDF password" },
                { name: "Digital Signature", icon: "✍️", description: "Add digital signatures" }
            ]
        }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target)) {
                setIsToolsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToolClick = (toolName:any) => {
        console.log(`Selected tool: ${toolName}`);
        setIsToolsOpen(false);
        // Add your navigation logic here
    };

    return (
        <nav
            className="w-full flex items-center justify-between py-6 px-8 fixed top-0 z-50 shadow-md border-b"
            style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border, #e5e7eb)"
            }}
        >
            {/* Logo */}
            <div style={{ 
                color: "var(--primary)", 
                fontWeight: "bold", 
                fontSize: "1.5rem" 
            }}>
                PDF Lens
            </div>

            {/* Desktop Links */}
            <ul className="hidden lg:flex space-x-8 font-medium">
                <li><a href="#features" className="hover:opacity-80 transition-opacity" style={{ color: "var(--text, #374151)" }}>Features</a></li>
                <li><a href="#how-it-works" className="hover:opacity-80 transition-opacity" style={{ color: "var(--text, #374151)" }}>How it Works</a></li>
                
                {/* Tools Dropdown */}
                <li className="relative" ref={toolsRef}>
                    <button
                        onClick={() => setIsToolsOpen(!isToolsOpen)}
                        className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
                        style={{ color: "var(--text, #374151)" }}
                    >
                        <span>Tools</span>
                        <svg 
                            className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Tools Dropdown Menu */}
                    {isToolsOpen && (
                        <div 
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[800px] rounded-xl shadow-2xl border overflow-hidden"
                            style={{
                                backgroundColor: "var(--surface, white)",
                                borderColor: "var(--border, #e5e7eb)",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            }}
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text, #111827)" }}>
                                    PDF Tools & Utilities
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    {tools.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="space-y-3">
                                            <h4 
                                                className="font-medium text-sm uppercase tracking-wide"
                                                style={{ color: "var(--primary)" }}
                                            >
                                                {category.category}
                                            </h4>
                                            <div className="space-y-1">
                                                {category.items.map((tool, toolIndex) => (
                                                    <button
                                                        key={toolIndex}
                                                        onClick={() => handleToolClick(tool.name)}
                                                        className="w-full flex items-start space-x-3 p-3 rounded-lg transition-all duration-150 hover:translate-x-1 hover:bg-secondary"
                                                    >
                                                        <span className="text-lg">{tool.icon}</span>
                                                        <div className="flex-1 text-left">
                                                            <div className="font-medium text-sm">{tool.name}</div>
                                                            <div 
                                                                className="text-xs"
                                                                style={{ color: "var(--text-secondary, #6b7280)" }}
                                                            >
                                                                {tool.description}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div 
                                    className="mt-6 pt-4 border-t text-center"
                                    style={{ borderColor: "var(--border, #e5e7eb)" }}
                                >
                                    <button
                                        className="px-6 py-2 rounded-lg font-medium transition-all duration-150 hover:scale-105"
                                        style={{
                                            backgroundColor: "var(--primary)",
                                            color: "var(--surface, white)"
                                        }}
                                    >
                                        View All Tools
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </li>

                <li><a href="#pricing" className="hover:opacity-80 transition-opacity" style={{ color: "var(--text, #374151)" }}>Pricing</a></li>
                <li><a href="#contact" className="hover:opacity-80 transition-opacity" style={{ color: "var(--text, #374151)" }}>Contact</a></li>
            </ul>

            {/* Clerk Authentication Buttons */}
            <div className="hidden md:flex items-center gap-4">
                <SignedOut>
                    <SignInButton forceRedirectUrl='/dashboard'>
                        <button
                            className="px-4 py-2 rounded-lg font-semibold transition-all duration-150 hover:scale-105"
                            style={{
                                border: `1px solid var(--primary)`,
                                color: "var(--primary)",
                                backgroundColor: "transparent",
                            }}
                        >
                            Sign In
                        </button>
                    </SignInButton>
                    <SignUpButton forceRedirectUrl='/dashboard'>
                        <button
                            className="px-4 py-2 rounded-lg font-semibold transition-all duration-150 hover:scale-105"
                            style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--surface, white)",
                            }}
                        >
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "var(--text, #374151)" }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div 
                    className="absolute top-full left-0 right-0 lg:hidden border-t shadow-lg"
                    style={{
                        backgroundColor: "var(--surface, white)",
                        borderColor: "var(--border, #e5e7eb)"
                    }}
                >
                    <div className="p-4 space-y-4">
                        <a href="#features" className="block py-2" style={{ color: "var(--text, #374151)" }}>Features</a>
                        <a href="#how-it-works" className="block py-2" style={{ color: "var(--text, #374151)" }}>How it Works</a>
                        <a href="#pricing" className="block py-2" style={{ color: "var(--text, #374151)" }}>Pricing</a>
                        <a href="#contact" className="block py-2" style={{ color: "var(--text, #374151)" }}>Contact</a>
                        
                        <div className="pt-4 border-t" style={{ borderColor: "var(--border, #e5e7eb)" }}>
                            <SignedOut>
                                <div className="space-y-2">
                                    <SignInButton forceRedirectUrl='/dashboard'>
                                        <button
                                            className="w-full px-4 py-2 rounded-lg font-semibold"
                                            style={{
                                                border: `1px solid var(--primary)`,
                                                color: "var(--primary)",
                                                backgroundColor: "transparent",
                                            }}
                                        >
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton forceRedirectUrl='/dashboard'>
                                        <button
                                            className="w-full px-4 py-2 rounded-lg font-semibold"
                                            style={{
                                                backgroundColor: "var(--primary)",
                                                color: "var(--surface, white)",
                                            }}
                                        >
                                            Sign Up
                                        </button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default LandingNavbar;