'use client'

import { Loader2, LogOut, User, Coins, Search, Home, Menu } from "lucide-react"
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
import { Logo } from "../Logo"
import { usePdfStore } from "@/app/store/usePdfStore"
import { useCommandPalette } from "@/hooks/useCommandPalette"
import MobileMenubar from "./mobile-menubar"

// Navigation links array
const navigationLinks = [
  {
    href: "/",
    label: "Home"
  },
  // {
  //   label: "About",
  //   href: '/about'
  // },
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
        "href": "/tools/word-to-pdf",
        "label": "Word to PDF",
        "description": "Turn Word documents into secure, shareable PDF files in seconds."
      },
      {
        "href": "/tools/ppt-to-pdf",
        "label": "PPT to PDF",
        "description": "Turn your PowerPoint slides into shareable PDFs in seconds — no quality loss."
      },
      {
        "href": "/tools/pdf-to-word",
        "label": "PDF to Word",
        "description": "Convert your PDF files into editable Word documents with high accuracy."
      },
      {
        "href": "/tools/pdf-to-md",
        "label": "PDF to MD",
        "description": "Convert your PDF documents into clean and editable Markdown files."
      }
    ]
  },
  {
    label: "Tools",
    submenu: true,
    type: "description",
    items: [
      {
        "href": "/tools/merge-pdf",
        "label": "Merge PDF",
        "description": "Combine your PDFs into one neat file — quick and simple."
      },
      {
        "href": "/tools/split-pdf",
        "label": "Split PDF",
        "description": "Extract and split pages from large PDFs into smaller, separate files."
      },
    ]
  },
]

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useUser()
  const { clearUser, creditsLeft } = useUserStore()
  const { clearPdf } = usePdfStore()
  const { setOpen } = useCommandPalette()

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
      clearPdf()
    } finally {
      setIsLoading(false)
    }
  }

  // Monogram (first letter of name or email fallback)
  const monogram = loading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name || "User"}
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
  )

  return (
    <>
      <header className="w-full p-4 lg:p-6 fixed left-1/2 -translate-x-1/2 z-50 md:max-w-6xl">
        {/* //Add another div here to for padding purposes */}
        <div className="flex items-center justify-between  bg-background/80 backdrop-blur-lg border shadow-lg rounded-lg px-4 py-3 ">

          {/* Left: Logo */}
          <Link href="/"
            className={cn(
              "flex-shrink-0 justify-center",
            )}
          >
            <Logo showSubtitle={true} showText={true} size="sm" />
          </Link>

          <div className="sm:hidden flex items-center gap-2">

            <Button asChild variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 rounded-md cursor-pointer text-primary">
              <div><Search className="h-4 w-4" /></div>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-8 rounded-md text-primary">
              <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
            </Button>
            <Button onClick={() => setMobileOpen(!mobileOpen)} variant="default" className="cursor-pointer">
              <Menu />
            </Button>
          </div>

          {/* Center: Navigation */}
          <NavigationMenu viewport={false} className="hidden sm:flex">
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
          <div className={`hidden sm:flex items-center gap-2 flex-shrink-0 ${loading ? 'scale-0' : 'scale-100'}`}>
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
                <Button asChild variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-8 rounded-md cursor-pointer text-primary">
                  <div><Search className="h-4 w-4" /></div>
                </Button>
                <Button asChild variant="ghost" size="sm" className="h-8 rounded-md text-primary">
                  <Link href="/dashboard"><Home className="h-4 w-4" /></Link>
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-lg h-9 w-9 font-semibold cursor-pointer transition-transform hover:scale-105"
                    >
                      {monogram}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-72 p-0 mr-4 rounded-xl border border-border/60 bg-gradient-to-br from-background to-card shadow-xl" align="end">
                    {/* User Info Section */}
                    <div className="p-4 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate">{user.name}</p>
                            {user.isPro && (
                              <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Credits + Pro Section */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium bg-muted px-2.5 py-1 rounded-md">
                            <Coins className="h-3.5 w-3.5 text-primary" />
                            <span className="text-foreground/90">{creditsLeft} credits left</span>
                          </div>
                        </div>

                        {/* Upgrade Button for non-pro users */}
                        {!user.isPro && (
                          <Link href='/pricing' className=" cursor-pointer flex items-center gap-2 text-xs text-primary hover:underline">
                            Get More Credits →
                          </Link>
                        )}
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

      </header >
      {mobileOpen && (
        <MobileMenubar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          navigationLinks={navigationLinks}
          user={user}
          handleLogout={handleLogout}
          isLoading={isLoading}
          creditsLeft={creditsLeft}
        />
      )}
    </>
  )
}
