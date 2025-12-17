"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../theme/ThemeToggle";
import {
  Coins,
  LogOut,
  Loader2,
  X,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface Items {
  label: string;
  description?: string;
  href: string;
}

interface NavigationLinks {
  label: string;
  href?: string;
  submenu?: boolean;
  items?: Items[];
}

interface MobileMenubarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  navigationLinks: NavigationLinks[];
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isCreator: boolean;
    creditsLeft: number;
    plan?: string;
  } | null;
  handleLogout?: () => void;
  isLoading?: boolean;
}

const MobileMenubar: React.FC<MobileMenubarProps> = ({
  mobileOpen,
  setMobileOpen,
  navigationLinks,
  user,
  handleLogout,
  isLoading,
}) => {
  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          />

          {/* Menu Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background border-l border-border shadow-2xl flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <span className="font-semibold text-lg">Menu</span>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navigationLinks.map((item, idx) => (
                  <div key={idx}>
                    {!item.submenu ? (
                      <Link
                        href={item.href!}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between py-3 text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className="py-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          {item.label}
                        </div>
                        <div className="space-y-1 pl-2 border-l border-border/50 ml-1">
                          {item.items?.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              href={subItem.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-2 text-sm text-foreground/70 hover:text-primary transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {idx < navigationLinks.length - 1 && !item.submenu && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Footer / User Section */}
            <div className="p-5 border-t border-border bg-muted/30">
              {user ? (
                <div className="space-y-4">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-3 bg-background p-3 rounded-xl border border-border/50 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          className="w-full h-full rounded-full object-cover"
                          alt=""
                        />
                      ) : (
                        user.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    {user.isCreator && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border/50 hover:bg-muted transition-colors">
                        <LayoutDashboard className="w-5 h-5 mb-1 text-primary" />
                        <span className="text-xs font-medium">Dashboard</span>
                      </div>
                    </Link>
                    <Link href="/account" onClick={() => setMobileOpen(false)}>
                      <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background border border-border/50 hover:bg-muted transition-colors">
                        <Settings className="w-5 h-5 mb-1 text-muted-foreground" />
                        <span className="text-xs font-medium">Settings</span>
                      </div>
                    </Link>
                  </div>

                  {/* Credits & Logout */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium">
                      <Coins className="w-3.5 h-3.5" /> {user.creditsLeft}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-red-500 flex items-center gap-1.5 hover:underline"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <LogOut className="w-3.5 h-3.5" />
                      )}
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenubar;
