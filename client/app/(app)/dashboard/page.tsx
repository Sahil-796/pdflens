import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"
import Link from "next/link"
import PdfSearch from "@/components/dashboardPage/SearchBar"

export default function Dashboard() {
  const templates = [
    "Resume",
    "Business-Proposal",
    "Cover-Letter",
    "Research-Paper",
    "Agreement",
    "Report",
  ]

  return (
    <div className="h-screen flex flex-col">
      <TitleNav text="Dashboard" />
      <div className="flex-1 overflow-y-scroll flex flex-col gap-6 p-4 text-foreground bg-background h-full">
        {/* Search Section */}
        <PdfSearch />

        {/* Templates */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Templates</h2>
            <Link href="/generate">
              <Button
                className="bg-primary text-primary-foreground rounded-xl px-6 py-2 shadow-md hover:shadow-lg hover:bg-primary/90 transition"
              >
                + Create New PDF
              </Button>
            </Link>
          </div>

          {/* Template Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Link
                key={template}
                href={`/generate?template=${encodeURIComponent(template)}`}
                className="block"
              >
                <Card className="h-12 lg:h-18 flex items-center justify-center rounded-lg border border-border bg-card text-primary text-center font-medium cursor-pointer hover:bg-muted hover:text-primary transition overflow-hidden text-ellipsis">
                  {template}
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent PDFs */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Recent PDFs</h2>
          <Recents />
        </div>
      </div>
    </div>
  )
}