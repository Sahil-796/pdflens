"use client";

import { ChevronsUpDown, User, Coins, ArrowRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import LogoutButton from "../auth/logout-button";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    isCreator: boolean;
    creditsLeft: number;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="group-data-[collapsible=icon]:hidden pb-1">
        <div className="mx-2 flex flex-col gap-2 rounded-lg bg-background/50 p-3 shadow-sm transition-all">
          <div className="flex items-center justify-center gap-2">
            <span className="flex items-center gap-1.5 text-secondary-foreground text-xs font-medium">
              <Coins className="h-3.5 w-3.5" />
              <span className="text-sm font-bold">
                {user.creditsLeft.toLocaleString()}
              </span>
              Credits Left
            </span>
          </div>

          {!user.isCreator && (
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={() => router.push("/pricing")}
            >
              Get More Credits
              <ArrowRight className="mr-1.5 h-3 w-3" />
            </Button>
          )}
        </div>
      </SidebarMenuItem>
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
            className="min-w-56 rounded-xl border border-border/60 bg-linear-to-br from-background to-card shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            {/* Top section */}
            <DropdownMenuLabel className="flex flex-col gap-2 px-3 py-2 border-b border-border/60">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                {user.isCreator && (
                  <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                    PRO
                  </span>
                )}
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => router.push("/account")}>
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                Account Settings
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
  );
}
