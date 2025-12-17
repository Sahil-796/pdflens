import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../theme/ThemeToggle";
import { Coins, User, LogOut, Loader2, ArrowRight } from "lucide-react";

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
  };
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
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
        onClick={() => setMobileOpen(false)}
      />

      {/* Sliding Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[80%] max-w-xs bg-background border-l border-border shadow-xl p-6 flex flex-col sm:hidden transform transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 px-3 rounded-full bg-muted transition-colors"
          >
            <span className="text-xl font-bold leading-none text-foreground/80">
              ✕
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 overflow-y-auto mb-4">
          {navigationLinks.map((item, idx) =>
            !item.submenu ? (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between text-primary bg-muted/80 text-xl px-2 py-1 font-semibold rounded-md transition-colors"
              >
                {item.label}
                <ArrowRight />
              </Link>
            ) : (
              <div key={idx} className="flex flex-col space-y-1">
                <p className="font-semibold text-secondary-foreground text-sm mt-2 mb-1">
                  {item.label}
                </p>
                {item.items?.map((subItem, subIdx) => (
                  <Link
                    key={subIdx}
                    href={subItem.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-muted-foreground text-sm rounded-md px-3 py-1 transition-colors"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            ),
          )}
        </div>

        <div className="border-t border-border pt-4 flex flex-col space-y-3">
          {/* User logged in */}
          {user?.id ? (
            <>
              {/* User info */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">
                      {user.name}
                    </p>
                    {user.isCreator && (
                      <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                {/* Dashboard & Account */}
                <Link href="/account">
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start gap-1 text-xs text-foreground px-2 py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div>
                      <User className="h-4 w-4 mr-1" />
                      Account
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Credits + Upgrade */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1 text-sm font-medium bg-muted px-2 py-1.5 rounded-md">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-foreground/90">
                    {user?.creditsLeft} credits
                  </span>
                </div>
                {!user.isCreator && (
                  <Link
                    href="/pricing"
                    className=" cursor-pointer flex items-center gap-2 text-xs text-primary hover:underline"
                  >
                    Get More Credits →
                  </Link>
                )}
              </div>

              {/* Logout */}
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full justify-center h-8 text-xs font-normal"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>{isLoading ? "Logging out..." : "Log out"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline">
                <Link href={"/signup"}>Get Started</Link>
              </Button>
              <Button>
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenubar;
