import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"
import Link from "next/link"
import PdfSearch from "@/components/dashboardPage/SearchBar"

export default function Dashboard() {

  const templates = ["Resume", "Invoice", "Certificate"];
  
  return (
    <div className='h-screen flex flex-col'>
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
                variant="secondary"
                className="bg-card text-primary border border-border whitespace-nowrap cursor-pointer"
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
                <Card className="p-4 rounded-lg border border-border bg-card text-primary text-center font-medium cursor-pointer hover:bg-muted hover:text-primary transition">
                  {template}
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent PDFs */}
        <div className="space-y-4 ">
          <h2 className="text-lg font-semibold text-primary ">Recent PDFs</h2>
          <Recents />
        </div>

        {/* Favourites
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Favourites</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2].map((fav) => (
              <Card
                key={fav}
                className="p-4 rounded-lg border border-border bg-card text-primary"
              >
                Favourite {fav}
              </Card>
            ))}
          </div>
        </div> */}

      </div>
    </div>
  )
}