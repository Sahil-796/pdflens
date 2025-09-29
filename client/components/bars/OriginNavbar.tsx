/* eslint-disable @next/next/no-img-element */
'use client'

import { BookOpenIcon, InfoIcon, LifeBuoyIcon, Loader2, LogOut, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"
import ThemeStyle from "../theme/ThemeStyle"
import ThemeToggle from "../theme/ThemeToggle"
import LogoutButton from "../auth/logout-button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/app/store/useUserStore"
import { authClient } from "@/lib/auth-client"

// Navigation links array
const navigationLinks = [
    { href: "#", label: "Home" },
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
        href: "#pricing"
    },
    {
        label: "Convert",
        submenu: true,
        type: "description",
        items: [
            {
                href: "#",
                label: "Merge PDF",
                description: "Combine multiple PDFs into a single, organized file.",
            },
            {
                href: "#",
                label: "Split PDF",
                description: "Separate large PDFs into smaller, more manageable files.",
            },
            {
                href: "#",
                label: "Convert PDF",
                description: "Easily transform PDFs to and from Word, Excel, PPT, JPG, and more.",
            },
        ],
    },
]

export default function Component() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
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
    // Simulating auth state
    const { data: session } = authClient.useSession()

    const user = session?.user

    // Monogram (first letter of name or email fallback)
    const monogram =
        user?.image ||
        user?.name?.[0]?.toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "U"


    return (
        <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-md border-b px-4 md:px-6">
            <div className="flex h-16 items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="text-xl font-bold text-primary">
                    PDF Lens
                </Link>

                {/* Center: Navigation */}
                <NavigationMenu viewport={false} className="hidden md:flex">
                    <NavigationMenuList className="gap-4">
                        {navigationLinks.map((link, index) => (
                            <NavigationMenuItem key={index}>
                                {link.submenu ? (
                                    <>
                                        <NavigationMenuTrigger className="text-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium">
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
                                                        <NavigationMenuLink
                                                            href={item.href}
                                                            className="block rounded-md px-3 py-2 hover:bg-muted"
                                                        >
                                                            <div className="font-medium">
                                                                {item.label}
                                                            </div>
                                                            <p className="text-muted-foreground text-xs">
                                                                {item.description}
                                                            </p>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </>
                                ) : (
                                    <NavigationMenuLink
                                        href={link.href}
                                        className="text-foreground hover:text-primary px-2 py-1.5 font-medium"
                                    >
                                        {link.label}
                                    </NavigationMenuLink>
                                )}
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right: Auth/User */}
                <div className="flex items-center gap-2">
                    {!user ? (
                        <>
                            <Button asChild variant="ghost" size="sm" className="text-sm">
                                <a href="/login">Sign In</a>
                            </Button>
                            <Button asChild size="sm" className="text-sm">
                                <a href="/signup">Get Started</a>
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button asChild variant="outline" size="sm">
                                <a href="/dashboard">Dashboard</a>
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full font-bold"
                                    >
                                        {monogram}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-3">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                    <div className="mt-3 flex flex-col gap-2">
                                        <div className="flex">
                                            <div className="scale-90">
                                                <ThemeToggle />
                                            </div>
                                            <div className="scale-90">
                                                <ThemeStyle />
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={handleLogout}
                                            disabled={isLoading}
                                            className="flex items-center m-2 gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <LogOut className="size-4" />
                                            )}
                                            <span>{isLoading ? "Logging out..." : "Logout"}</span>
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}