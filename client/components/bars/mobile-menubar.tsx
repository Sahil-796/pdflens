import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "../theme/ThemeToggle"
import { Coins, ArrowUpCircle, Home, User, LogOut, Loader2, Search } from "lucide-react"

interface Items {
  label: string
  description?: string
  href: string
}

interface NavigationLinks {
  label: string
  href?: string
  submenu?: boolean
  items?: Items[]
}

interface MobileMenubarProps {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  navigationLinks: NavigationLinks[]
  user?: {
    id?: string
    name?: string
    email?: string
    avatar?: string
    isPro?: boolean
  }
  loading?: boolean
  handleLogout?: () => void
  isLoading?: boolean
  creditsLeft?: number
  setOpen?: (open: boolean) => void
}

const MobileMenubar: React.FC<MobileMenubarProps> = ({
  mobileOpen,
  setMobileOpen,
  navigationLinks,
  user,
  loading,
  handleLogout,
  isLoading,
  creditsLeft,
  setOpen,
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
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg font-semibold text-foreground">Menu</p>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <span className="text-xl font-bold leading-none text-foreground/80">✕</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 overflow-y-auto mb-4">
          {navigationLinks.map((item, idx) =>
            !item.submenu ? (
              <Link
                key={idx}
                href={item.href || "#"}
                onClick={() => setMobileOpen(false)}
                className="text-foreground hover:text-primary text-base font-medium rounded-md px-3 py-2 transition-colors hover:bg-muted/50"
              >
                {item.label}
              </Link>
            ) : (
              <div key={idx} className="flex flex-col space-y-1">
                <p className="font-semibold text-foreground/90 text-sm mt-2 mb-1">
                  {item.label}
                </p>
                {item.items?.map((subItem, subIdx) => (
                  <Link
                    key={subIdx}
                    href={subItem.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-muted-foreground hover:text-primary text-sm rounded-md px-3 py-1 transition-colors hover:bg-muted/50"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )
          )}
        </div>

        <div className="border-t border-border pt-4 flex flex-col space-y-3">
          {/* User logged in */}
          {user?.id ?
            <>
              {/* User info */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5 mb-2">
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

                {/* Dashboard & Account */}
                <Link href="/account">
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start gap-1 text-xs text-foreground hover:text-primary px-2 py-1"
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
                <div className="flex items-center gap-1 text-sm font-medium bg-muted px-2 py-0.5 rounded-md">
                  <Coins className="h-3 w-3 text-primary" />
                  <span className="text-foreground/90">{creditsLeft} credits</span>
                </div>
                {!user.isPro && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileOpen(false)
                      window.location.href = "/pricing"
                    }}
                    className="flex items-center gap-1 text-sm text-primary px-2 py-0.5"
                  >
                    <ArrowUpCircle className="h-3 w-3" /> Upgrade
                  </Button>
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
            :
            (
              <>
                <Button variant="outline" >
                  <Link href={'/signup'}>
                    Get Started
                  </Link>
                </Button>
                <Button>
                  <Link href="/login">
                    Login
                  </Link>
                </Button>
              </>
            )}
        </div>
      </div>
    </>
  )
}

export default MobileMenubar
