import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"

export default function Dashboard() {
  return (
    <div className='h-screen flex flex-col overflow-auto'>
      <TitleNav text="Dashboard" />
      <div className='flex-1 overflow-hidden'>
        <div className="flex flex-col gap-6 p-4 text-foreground bg-background h-full">
          {/* Search Section */}
          <div className="flex items-center justify-between">
            <Input
              type="text"
              placeholder="Search PDFs..."
              className="w-1/3 border-border text-primary bg-card"
            />
            <Button className="bg-card text-primary border border-border">
              + Create New PDF
            </Button>
          </div>

          {/* Recent PDFs */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-primary">Recent PDFs</CardTitle>
            </CardHeader>
            <CardContent>
              <Recents />
            </CardContent>
          </Card>

          {/* Favourites */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-primary">Favourites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2].map((fav) => (
                  <div
                    key={fav}
                    className="p-4 rounded-lg border border-border bg-card text-primary"
                  >
                    Favourite {fav}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-primary">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {["Resume", "Invoice", "Certificate"].map((template) => (
                  <div
                    key={template}
                    className="p-4 rounded-lg border border-border bg-card text-primary cursor-pointer hover:opacity-80"
                  >
                    {template}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}