import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className='h-screen flex flex-col'>
      <TitleNav text="Dashboard" />
      <div className="flex-1 overflow-y-scroll flex flex-col gap-6 p-4 text-foreground bg-background h-full">
        {/* Search Section */}
        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search PDFs..."
            className="w-1/3 border-border text-primary bg-card"
          />
          <Link href='/generate'>
            <Button variant='secondary' className="bg-card text-primary border border-border">
              + Create New PDF
            </Button>
          </Link>
        </div>

        {/* Recent PDFs */}
        <div className="space-y-4 ">
          <h2 className="text-lg font-semibold text-primary ">Recent PDFs</h2>
          <Recents />
        </div>

        {/* Favourites */}
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
        </div>

        {/* Templates */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Templates</h2>
          <div className="grid grid-cols-3 gap-4">
            {["Resume", "Invoice", "Certificate"].map((template) => (
              <Card
                key={template}
                className="p-4 rounded-lg border border-border bg-card text-primary cursor-pointer hover:opacity-80"
              >
                {template}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}