"use client"
import TitleNav from "@/components/title-nav"
import { useSession } from "@/lib/auth-client"
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
    <div className="min-h-screen bg-background text-foreground">
      <TitleNav text='Dashboard' />
      <div className="p-4">
        {/* Quick Tools */}
        <div className="p-4 border rounded-lg bg-card border-border">
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
    </div>
  )
}

export default page