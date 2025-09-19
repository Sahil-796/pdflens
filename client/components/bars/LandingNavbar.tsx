"use client"

import Link from "next/link"
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
import { useAuthRehydrate } from "@/hooks/useAuthRehydrate"
import { useUserStore } from "@/app/store/useUserStore"

const tools = [
    {
        title: "Convert",
        items: [
            { title: "PDF to Word", url: "/tools/pdf-to-word" },
            { title: "PDF to PPT", url: "/tools/pdf-to-ppt" },
            { title: "PDF to Excel", url: "/tools/pdf-to-excel" },
            { title: "PDF to JPG", url: "/tools/pdf-to-jpg" },
            { title: "JPG to PDF", url: "/tools/jpg-to-pdf" },
            { title: "Word to PDF", url: "/tools/word-to-pdf" },
            { title: "PPT to PDF", url: "/tools/ppt-to-pdf" },
            { title: "Excel to PDF", url: "/tools/excel-to-pdf" },
            { title: "HTML to PDF", url: "/tools/html-to-pdf" },
        ],
    },
    {
        title: "Organize",
        items: [
            { title: "Merge PDF", url: "/tools/merge-pdf" },
            { title: "Split PDF", url: "/tools/split-pdf" },
            { title: "Organize Pages", url: "/tools/organize-pdf" },
            { title: "Compress PDF", url: "/tools/compress-pdf" },
        ],
    },
    {
        title: "Edit",
        items: [
            { title: "Edit PDF", url: "/tools/edit-pdf" },
            { title: "Add Text", url: "/tools/add-text" },
            { title: "Add Image", url: "/tools/add-image" },
            { title: "Fill & Sign", url: "/tools/fill-sign" },
            { title: "Annotate PDF", url: "/tools/annotate" },
        ],
    },
    {
        title: "Security",
        items: [
            { title: "Protect PDF (Password)", url: "/tools/protect-pdf" },
            { title: "Unlock PDF", url: "/tools/unlock-pdf" },
            { title: "Watermark PDF", url: "/tools/watermark-pdf" },
            { title: "E-signature", url: "/tools/esign-pdf" },
        ],
    },
    {
        title: "View & Utilities",
        items: [
            { title: "PDF Reader", url: "/tools/pdf-reader" },
            { title: "Rotate PDF", url: "/tools/rotate-pdf" },
            { title: "Extract Images", url: "/tools/extract-images" },
            { title: "Extract Text", url: "/tools/extract-text" },
            { title: "Compare PDFs", url: "/tools/compare-pdfs" },
        ],
    },
]

export default function Navbar() {
    useAuthRehydrate()
    const { userName } = useUserStore()
    return (
        <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                {/* Logo + Left Nav */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold text-primary">
                        PDF Lens
                    </Link>
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="gap-6">
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/" className="font-medium hover:text-primary">
                                    Home
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="#features" className="font-medium hover:text-primary">
                                    Features
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="#step" className="font-medium hover:text-primary">
                                    Working
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="#pricing" className="font-medium hover:text-primary">
                                    Pricing
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {/* Tools Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="font-medium hover:text-primary bg-transparent">
                                    Tools
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="grid grid-cols-2 gap-6 p-6 min-w-[600px]">
                                    {tools.map((category, i) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-sm font-semibold text-foreground">
                                                {category.title}
                                            </p>
                                            <ul className="space-y-1 text-sm">
                                                {category.items.map((item, j) => (
                                                    <li key={j}>
                                                        <NavigationMenuLink
                                                            href={item.url}
                                                            className="block rounded-md px-2 py-1 hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            {item.title}
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right side buttons */}
                {
                    !userName ?
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full bg-primary px-5 text-white shadow hover:bg-primary/90">
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </div>
                        :
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <div>
                                Welcome back {userName}
                            </div>
                        </div>
                }
            </div>
        </header>
    )
}