"use client"

import * as React from "react"
import {
  ArrowLeftRight,
  BetweenVerticalEnd,
  FileSearch,
  Home,
  Pen,
  Plus,
} from "lucide-react"

import { NavMain } from "@/components/bars/nav-main"
import { NavProjects } from "@/components/bars/nav-projects"
import { NavUser } from "@/components/bars/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuthRehydrate } from "@/hooks/useAuthRehydrate"
import SearchBar from "../dashboardPage/SearchBar"
import { cn } from "@/lib/utils"
import useUser from "@/hooks/useUser"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useAuthRehydrate()
  const { user, isPro } = useUser()
  const { state } = useSidebar();
  const data = {
    user: {
      name: user.name || 'Loading',
      email: user.email || 'Loading',
      avatar: user.avatar || '',
      isPro
    },
    main: [
      {
        title: "Dashboard",
        url: '/dashboard',
        icon: Home,
      },
      {
        title: 'Generate',
        url: '/generate',
        icon: Plus
      },
      {
        title: 'Edit',
        url: '/edit',
        icon: Pen
      },
    ],
    projects: [
      {
        name: "Convert",
        url: "",
        icon: ArrowLeftRight,
        items: [
          { title: "PDF to Word", url: "/tools/pdf-to-word" },
          { title: "Word to PDF", url: "/tools/word-to-pdf" },
          { title: "PDF to MD", url: "/tools/pdf-to-md" }
        ]
      },
      {
        name: "PDF Tools",
        url: "",
        icon: BetweenVerticalEnd,
        items: [
          { title: "Merge PDF", url: "/tools/merge-pdf" },
          { title: "Split PDF", url: "/tools/split-pdf" },
          { title: "Organize Pages", url: "/tools/organize-pdf" },
          { title: "Edit PDF", url: "/tools/edit-pdf" },
        ]
      },
    ]
  }
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "group/header relative",
                "hover:bg-sidebar-accent transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "px-3"
              )}
              tooltip={isCollapsed ? "Zendra" : undefined}
            >
              <div
                className={cn(
                  "flex items-center gap-3 transition-all duration-200",
                  isCollapsed && "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg",
                    "bg-gradient-to-br from-primary to-primary/80",
                    "text-primary-foreground shadow-sm",
                    "transition-all duration-200",
                    "group-hover/header:shadow-md group-hover/header:scale-105",
                    isCollapsed ? "size-8" : "size-9"
                  )}
                >
                  <FileSearch
                    className={cn(
                      "transition-all duration-200",
                      isCollapsed ? "size-4" : "size-5"
                    )}
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight">
                      Zendra
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      AI PDF Assistant
                    </span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SearchBar />
        <NavMain items={data.main} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
