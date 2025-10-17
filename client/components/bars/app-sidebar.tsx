"use client"

import * as React from "react"
import {
  ArrowLeftRight,
  BetweenVerticalEnd,
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
import { Button } from "../ui/button"
import Link from "next/link"
import { Spinner } from "../ui/spinner"
import { Logo } from "../Logo"
import { useUserStore } from "@/app/store/useUserStore"
import { usePathname } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useAuthRehydrate()
  const { user, loading } = useUser()
  const { state } = useSidebar();
  const { creditsLeft } = useUserStore()
  const pathname = usePathname()

  const data = {
    user: {
      name: user.name || 'Loading',
      email: user.email || 'Loading',
      avatar: user.avatar || '',
      isPro: user.isPro,
      creditsLeft
    },
    main: [
      {
        title: "Dashboard",
        url: '/dashboard',
        icon: Home,
        isActive: pathname === '/dashboard',
      },
      {
        title: 'Generate',
        url: '/generate',
        icon: Plus,
        isActive: pathname === '/generate',
      },
      {
        title: 'Edit',
        url: '/edit',
        icon: Pen,
        isActive: pathname === '/edit',
      },
    ],
    projects: [
      {
        name: "Convert",
        url: "",
        icon: ArrowLeftRight,
        items: [
          { title: "Word to PDF", url: "/tools/word-to-pdf", isActive: pathname === '/tools/word-to-pdf' },
          { title: "PPT to PDF", url: "/tools/ppt-to-pdf", isActive: pathname === '/tools/ppt-to-pdf' },
          { title: "PDF to Word", url: "/tools/pdf-to-word", isActive: pathname === '/tools/pdf-to-word' },
          { title: "PDF to MD", url: "/tools/pdf-to-md", isActive: pathname === '/tools/pdf-to-md' },
        ]
      },
      {
        name: "PDF Tools",
        url: "",
        icon: BetweenVerticalEnd,
        items: [
          { title: "Edit PDF", url: "/tools/edit-pdf", isActive: pathname === '/tools/edit-pdf' },
          { title: "Merge PDF", url: "/tools/merge-pdf", isActive: pathname === '/tools/merge-pdf' },
          { title: "Split PDF", url: "/tools/split-pdf", isActive: pathname === '/tools/split-pdf' },
          { title: "Organize Pages", url: "/tools/organize-pdf", isActive: pathname === '/tools/organize-pdf' },
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
              <Logo
                size={isCollapsed ? "sm" : "md"}
                showText={!isCollapsed}
                showSubtitle={!isCollapsed}
              />
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
        {loading ? (
          <Button variant="secondary" disabled className="m-1">
            <Spinner />
            Please wait
          </Button>
        ) : user?.id ? (
          <NavUser user={data.user} />
        ) : (
          <Button asChild variant="secondary" className="m-1 cursor-pointer">
            <Link href="/login">Log In</Link>
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
