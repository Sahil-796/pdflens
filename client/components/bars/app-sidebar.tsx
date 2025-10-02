"use client"

import * as React from "react"
import {
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
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import LogoutButton from "../auth/logout-button"
import { useUserStore } from "@/app/store/useUserStore"
import { useAuthRehydrate } from "@/hooks/useAuthRehydrate"
import SearchBar from "../dashboardPage/SearchBar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useAuthRehydrate()
  const { userName, userEmail, userAvatar } = useUserStore()
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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SearchBar />
        <NavProjects projects={data.super} />
        <NavMain items={data.tools} />
      </SidebarContent>
      <SidebarRail />
      <LogoutButton />
    </Sidebar>
  )
}
