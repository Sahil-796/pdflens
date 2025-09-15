"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"
import { useState } from "react"

function page() {

  const [pdfs] = useState([
    { id: 1, name: "ProjectReport.pdf", date: "2025-09-10", size: "2.1 MB" },
    { id: 2, name: "Invoice2025.pdf", date: "2025-09-09", size: "1.2 MB" },
  ])

  const [favorites] = useState([
    { id: 3, name: "Resume.pdf", size: "800 KB" },
  ])

  return (
    <div className="min-h-screen bg-background text-foreground ">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h2>Generate PDF</h2>
        </div>
      </header>
      {/* Quick Tools */}
      <div className="p-4 border rounded-lg bg-card border-border mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3">Quick Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Upload PDF", "Merge PDF", "Split PDF", "Compress PDF"].map((tool) => (
            <button
              key={tool}
              className="p-3 rounded-lg border border-border bg-muted hover:bg-secondary hover:text-white transition"
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* Main Section: PDFs + Favorites + Shared */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF Management */}
        <div className="col-span-2 p-4 border rounded-lg bg-card border-border">
          <h2 className="text-lg font-semibold text-primary mb-3">Recent PDFs</h2>
          <ul className="space-y-2">
            {pdfs.map((pdf) => (
              <li
                key={pdf.id}
                className="flex justify-between items-center p-2 border rounded bg-muted border-border"
              >
                <div>
                  <p className="font-medium">{pdf.name}</p>
                  <p className="text-xs text-secondary">{pdf.date} • {pdf.size}</p>
                </div>
                <button className="text-sm px-2 py-1 rounded bg-primary text-white">Open</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Favorites */}
          <div className="p-4 border rounded-lg bg-card border-border">
            <h2 className="text-lg font-semibold text-primary mb-3">Favorites ⭐</h2>
            <ul className="space-y-2">
              {favorites.map((fav) => (
                <li
                  key={fav.id}
                  className="flex justify-between items-center p-2 border rounded bg-muted border-border"
                >
                  <p>{fav.name}</p>
                  <button className="text-sm px-2 py-1 rounded bg-secondary text-white">Open</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shared PDFs */}
          <div className="p-4 border rounded-lg bg-card border-border">
            <h2 className="text-lg font-semibold text-primary mb-3">Shared With Me</h2>
            <p className="text-sm text-secondary">No shared PDFs yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page