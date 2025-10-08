'use client'

import { Loader2, LogOut, User, FileSearch } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import ThemeToggle from "../theme/ThemeToggle"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/app/store/useUserStore"
import { authClient } from "@/lib/auth-client"
import useUser from "@/hooks/useUser"

// Navigation links array
const navigationLinks = [
    { href: "/", label: "Home" },
    {
        label: "Features",
        href: "#features"
    },
    {
        label: "Working",
        href: "#steps"
    },
    {
        label: "Pricing",
        href: "/pricing"
    },
    {
        label: "Convert",
        submenu: true,
        type: "description",
        items: [
            {
                "href": "/tools/merge-pdf",
                "label": "Merge PDF",
                "description": "Combine multiple PDF documents into one seamless, organized file."
            },
            {
                "href": "/tools/split-pdf",
                "label": "Split PDF",
                "description": "Extract and split pages from large PDFs into smaller, separate files."
            },
            {
                "href": "/tools/organize-pdf",
                "label": "Organize Pages",
                "description": "Reorder, rotate, or delete pages in your PDF for better structure."
            },
            {
                "href": "/tools/edit-pdf",
                "label": "Edit PDF",
                "description": "Modify text, images, and layout directly within your PDF files."
            }
        ]
    },
    {
        label: "Tools",
        submenu: true,
        type: "description",
        items: [
            {
                "href": "/tools/pdf-to-word",
                "label": "PDF to Word",
                "description": "Convert your PDF files into editable Word documents with high accuracy."
            },
            {
                "href": "/tools/word-to-pdf",
                "label": "Word to PDF",
                "description": "Turn Word documents into secure, shareable PDF files in seconds."
            },
            {
                "href": "/tools/pdf-to-md",
                "label": "PDF to MD",
                "description": "Extract content from PDFs and convert it into clean Markdown format."
            }
        ]
    },
]

export default function Navbar() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { user } = useUser()
    const { clearUser } = useUserStore()

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                    },
                },
            });
            clearUser()
        } finally {
            setIsLoading(false)
        }
    }

    // Monogram (first letter of name or email fallback)
    const monogram =
        user.avatar ||
        user.name?.[0]?.toUpperCase() ||
        user.email?.[0]?.toUpperCase() ||
        "U"

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
            <div className="bg-background/80 backdrop-blur-lg border shadow-lg rounded-lg px-3 py-2.5">

                <div className="flex items-center justify-between">
                    {/* Left: Logo */}
                    <Link href="/"
                        className={cn(
                            "group/header relative text-lg font-bold text-primary flex-shrink-0",
                            "justify-center"
                        )}
                    >
                        <div
                            className={cn(
                                "flex items-center gap-3",
                            )}
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-lg",
                                    "bg-gradient-to-br from-primary to-primary/80",
                                    "text-primary-foreground shadow-sm",
                                    "transition-all duration-200",
                                    "group-hover/header:shadow-md5",
                                    "size-9"
                                )}
                            >
                                <FileSearch className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold tracking-tight">
                                    PDF Lens
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    AI PDF Assistant
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Center: Navigation */}
                    <NavigationMenu viewport={false} className="hidden md:flex">
                        <NavigationMenuList className="gap-1">
                            {navigationLinks.map((link, index) => (
                                <NavigationMenuItem key={index}>
                                    {link.submenu ? (
                                        <>
                                            <NavigationMenuTrigger className="text-sm text-foreground hover:text-primary bg-transparent px-3 py-1.5 font-medium h-8">
                                                {link.label}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="z-50 p-2">
                                                <ul
                                                    className={cn(
                                                        link.type === "description"
                                                            ? "min-w-64"
                                                            : "min-w-48"
                                                    )}
                                                >
                                                    {link.items.map((item, itemIndex) => (
                                                        <li key={itemIndex}>
                                                            <Link
                                                                href={item.href}
                                                                className={cn('block rounded-md px-3 py-2 hover:bg-muted',
                                                                    "data-[active]:focus:bg-accent data-[active]:hover:bg-accent data-[active]:bg-accent data-[active]:text-accent-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
                                                                )}

                                                            >
                                                                <div className="font-medium text-sm">
                                                                    {item.label}
                                                                </div>
                                                                <p className="text-muted-foreground text-xs">
                                                                    {item.description}
                                                                </p>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </NavigationMenuContent>
                                        </>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className={cn("text-sm text-foreground hover:text-primary px-3 py-1.5 font-medium",
                                                "data-[active]:focus:bg-accent data-[active]:hover:bg-accent data-[active]:bg-accent data-[active]:text-accent-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right: Auth/User */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {!user.id ? (
                            <>
                                <Button asChild variant="ghost" size="sm" className="text-sm h-8">
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button asChild size="sm" className="text-sm h-8 rounded-md">
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button asChild variant="ghost" size="sm" className="h-8 rounded-md">
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="rounded-lg h-9 w-9 font-semibold cursor-pointer transition-transform"
                                        >
                                            {monogram}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-0 mr-4" align="end">
                                        {/* User Info Section */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-primary">
                                                        {monogram}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Actions Section */}
                                        <div className="p-2">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-2 h-9 text-sm font-normal"
                                                asChild
                                            >
                                                <Link href="/account">
                                                    <User className="h-4 w-4" />
                                                    Account Settings
                                                </Link>
                                            </Button>
                                            <div className="flex items-center justify-between px-3 py-2">
                                                <span className="text-sm text-muted-foreground">Theme</span>
                                                <ThemeToggle />
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Logout Section */}
                                        <div className="p-2">
                                            <Button
                                                variant="ghost"
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                className="w-full justify-start gap-2 h-9 text-sm font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <LogOut className="h-4 w-4" />
                                                )}
                                                <span>{isLoading ? "Logging out..." : "Log out"}</span>
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header >
    )
}