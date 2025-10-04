"use client"

import * as React from "react"
import {
  FileSearch,
  LayoutGrid,
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
import { useUserStore } from "@/app/store/useUserStore"
import { useAuthRehydrate } from "@/hooks/useAuthRehydrate"
import SearchBar from "../dashboardPage/SearchBar"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useAuthRehydrate()
  const { userName, userEmail, userAvatar } = useUserStore()
  const { state } = useSidebar();
  const data = {
    user: {
      name: userName || 'Loading',
      email: userEmail || 'Loading',
      avatar: userAvatar || ''
    },
    super: [
      {
        name: "Dashboard",
        url: '/dashboard',
        icon: LayoutGrid
      },
      {
        name: 'Generate',
        url: '/generate',
        icon: Plus
      },
      {
        name: 'Edit',
        url: '/edit',
        icon: Pen
      },
    ],
    tools: [
      {
        "title": "Convert",
        "url": "#",
        "items": [
          { "title": "PDF to Word", "url": "/tools/pdf-to-word" },
          { "title": "Word to PDF", "url": "/tools/word-to-pdf" },
          { "title": "PDF to MD", "url": "/tools/pdf-to-md" }
        ]
      },
      {
        "title": "PDF Tools",
        "url": "#",
        "items": [
          { "title": "Merge PDF", "url": "/tools/merge-pdf" },
          { "title": "Split PDF", "url": "/tools/split-pdf" },
          { "title": "Organize Pages", "url": "/tools/organize-pdf" },
          { "title": "Edit PDF", "url": "/tools/edit-pdf" },
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
                "hover:bg-sidebar-accent/50 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "px-3"
              )}
              tooltip={isCollapsed ? "Flowt" : undefined}
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
                      PDF Lens
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
        <NavProjects projects={data.super} />
        <NavMain items={data.tools} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
