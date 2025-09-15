"use client"

import * as React from "react"
import {
  LayoutGrid,
  Pen,
  Plus,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import LogoutButton from "./logout-button"
import { useSession } from "@/lib/auth-client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const data = {
    user: {
      name: session?.user.name || 'Loading',
      email: session?.user.email || 'Loading',
      avatar: session?.user.image || '/avatars/shadcn.jpg'
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
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavProjects projects={data.super} /> */}
        <NavMain items={data.super} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarRail />
      <LogoutButton />
    </Sidebar>
  )
}
