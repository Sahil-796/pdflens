"use client";

import {
  Loader2,
  LogOut,
  User,
  Coins,
  Search,
  Menu,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ThemeToggle from "../theme/ThemeToggle";
import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { Logo } from "../Logo";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import MobileMenubar from "./mobile-menubar";
import { useLogout } from "@/hooks/mutations/useLogout";

const navigationLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Convert",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/tools/word-to-pdf",
        label: "Word to PDF",
        description: "Turn Word documents into secure PDFs.",
      },
      {
        href: "/tools/ppt-to-pdf",
        label: "PPT to PDF",
        description: "Turn PowerPoint slides into PDFs.",
      },
      {
        href: "/tools/pdf-to-word",
        label: "PDF to Word",
        description: "Convert PDF files into editable Word docs.",
      },
      {
        href: "/tools/pdf-to-md",
        label: "PDF to MD",
        description: "Convert your PDF documents into editable Markdown files.",
      },
    ],
  },
  {
    label: "Tools",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/tools/merge-pdf",
        label: "Merge PDF",
        description: "Combine multiple PDFs into one.",
      },
      {
        href: "/tools/split-pdf",
        label: "Split PDF",
        description: "Extract pages from large PDFs.",
      },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useUser();
  const { setOpen } = useCommandPalette();
  const { mutate: logout, isPending } = useLogout();

  // Add a scroll effect to make the border verify visible only when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const monogram = loading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : user ? (
    user.avatar ? (
      <img
        src={user.avatar}
        alt={user.name || "User"}
        className="w-full h-full rounded-full object-cover"
      />
    ) : (
      user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    )
  ) : null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <div
          className={cn(
            "flex items-center justify-between w-full md:max-w-6xl rounded-2xl px-4 py-3 transition-all duration-300",
            scrolled
              ? "bg-background/70 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5"
              : "bg-background/50 backdrop-blur-sm border border-transparent",
          )}
        >
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "shrink-0 justify-center hover:opacity-80 transition-opacity",
              )}
            >
              <Logo showSubtitle={true} showText={true} size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu viewport={false} className="hidden md:flex">
              <NavigationMenuList className="gap-1">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger className="text-sm font-medium bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50 h-8 px-3">
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-50 p-2">
                          <ul
                            className={cn(
                              link.type === "description"
                                ? "min-w-[280px]"
                                : "min-w-48",
                            )}
                          >
                            {link.items?.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link
                                  href={item.href}
                                  className="block rounded-md p-3 hover:bg-muted transition-colors outline-none focus:bg-muted"
                                >
                                  <div className="text-sm font-medium leading-none mb-1">
                                    {item.label}
                                  </div>
                                  <p className="line-clamp-2 text-xs text-muted-foreground leading-snug">
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
                        className={cn(
                          "text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted/50",
                          "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : !user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full px-5">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  asChild
                  size="sm"
                  className="hidden md:flex rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shadow-none"
                >
                  <Link href="/generate" className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Create PDF</span>
                  </Link>
                </Button>

                {/* User Dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full h-9 w-9 border border-border/50 shadow-sm"
                    >
                      {monogram}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-64 p-2 rounded-xl" align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="mt-2 mb-2 px-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-2">
                          <Coins className="w-3.5 h-3.5 text-yellow-500" />
                          <span className="text-xs font-medium">
                            {user.creditsLeft} Credits
                          </span>
                        </div>
                        {!user.isCreator && (
                          <Link
                            href="/pricing"
                            className="text-[10px] font-bold text-primary hover:underline"
                          >
                            UPGRADE
                          </Link>
                        )}
                      </div>
                    </div>

                    <Separator className="my-1" />

                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />{" "}
                        Dashboard
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />{" "}
                        Settings
                      </Link>
                      <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          Theme
                        </span>
                        <ThemeToggle />
                      </div>
                    </div>

                    <Separator className="my-1" />

                    <button
                      onClick={() => logout()}
                      disabled={isPending}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors text-left"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Sign out
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              {user && (
                <Link
                  href="/generate"
                  className="p-2 rounded-full bg-primary/10 text-primary"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenubar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navigationLinks={navigationLinks}
        user={user}
        handleLogout={() => logout()}
        isLoading={isPending}
      />
    </>
  );
}
