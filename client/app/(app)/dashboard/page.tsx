import React from "react"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"
import Templates from "@/components/dashboardPage/Templates"

export default function Dashboard() {

  return (
    <div className="h-screen flex flex-col">
      <TitleNav text="Dashboard" />
      <div className="flex-1 overflow-y-scroll flex flex-col gap-6 p-4 text-foreground bg-background h-full">

        <Templates />

        {/* Recent PDFs */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Recent PDFs</h2>
          <Recents />
        </div>
      </div>
    </div>
  )
}