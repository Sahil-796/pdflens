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
      avatar: session?.user.image || 'L'
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
          { "title": "PDF to PPT", "url": "/tools/pdf-to-ppt" },
          { "title": "PDF to Excel", "url": "/tools/pdf-to-excel" },
          { "title": "PDF to JPG", "url": "/tools/pdf-to-jpg" },
          { "title": "JPG to PDF", "url": "/tools/jpg-to-pdf" },
          { "title": "Word to PDF", "url": "/tools/word-to-pdf" },
          { "title": "PPT to PDF", "url": "/tools/ppt-to-pdf" },
          { "title": "Excel to PDF", "url": "/tools/excel-to-pdf" },
          { "title": "HTML to PDF", "url": "/tools/html-to-pdf" }
        ]
      },
      {
        "title": "Organize",
        "url": "#",
        "items": [
          { "title": "Merge PDF", "url": "/tools/merge-pdf" },
          { "title": "Split PDF", "url": "/tools/split-pdf" },
          { "title": "Organize Pages", "url": "/tools/organize-pdf" },
          { "title": "Compress PDF", "url": "/tools/compress-pdf" }
        ]
      },
      {
        "title": "Edit",
        "url": "#",
        "items": [
          { "title": "Edit PDF", "url": "/tools/edit-pdf" },
          { "title": "Add Text", "url": "/tools/add-text" },
          { "title": "Add Image", "url": "/tools/add-image" },
          { "title": "Fill & Sign", "url": "/tools/fill-sign" },
          { "title": "Annotate PDF", "url": "/tools/annotate" }
        ]
      },
      {
        "title": "Security",
        "url": "#",
        "items": [
          { "title": "Protect PDF (Password)", "url": "/tools/protect-pdf" },
          { "title": "Unlock PDF", "url": "/tools/unlock-pdf" },
          { "title": "Watermark PDF", "url": "/tools/watermark-pdf" },
          { "title": "E-signature", "url": "/tools/esign-pdf" }
        ]
      },
      {
        "title": "View & Utilities",
        "url": "#",
        "items": [
          { "title": "PDF Reader", "url": "/tools/pdf-reader" },
          { "title": "Rotate PDF", "url": "/tools/rotate-pdf" },
          { "title": "Extract Images", "url": "/tools/extract-images" },
          { "title": "Extract Text", "url": "/tools/extract-text" },
          { "title": "Compare PDFs", "url": "/tools/compare-pdfs" }
        ]
      }
    ]
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.super} />
        <NavMain items={data.tools} />
      </SidebarContent>
      <SidebarRail />
      <LogoutButton />
    </Sidebar>
  )
}
