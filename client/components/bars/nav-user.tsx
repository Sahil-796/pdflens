"use client"

import {
  ChevronsUpDown,
  CreditCard,
  User,
  Coins,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import LogoutButton from "../auth/logout-button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    isPro: boolean
    creditsLeft: number
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-muted/50 data-[state=open]:text-foreground rounded-xl transition-all"
            >
              <Avatar className="h-8 w-8 rounded-lg ring-1 ring-border/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-muted">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-foreground">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-xl border border-border/60 bg-gradient-to-br from-background to-card shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            {/* Top section */}
            <DropdownMenuLabel className="flex flex-col gap-2 px-3 py-2 border-b border-border/60">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                {user.isPro && (
                  <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                    PRO
                  </span>
                )}
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>

              {/* Credits left */}
              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="text-[11px] font-medium bg-muted px-3 py-1 rounded-md text-foreground flex items-center"
                >
                  <Coins className="w-4 h-4 mr-1 text-primary" />
                  {user.creditsLeft} credits left
                </Badge>
              </div>

              {/* Upgrade to Pro button (only for non-pro users) */}
              {!user.isPro && (
                <Link href='/pricing' className=" cursor-pointer flex items-center gap-2 text-xs text-primary hover:underline">
                  Get More Credits →
                </Link>
              )}
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => router.push("/account")}>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                Account Settings
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={() => router.push("/billing")}>
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup className="w-full">
              <LogoutButton />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
