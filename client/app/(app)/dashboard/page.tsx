import React from "react"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"
import QuickActions from "@/components/dashboardPage/QuickActions"

export default function Dashboard() {

  return (
    <div className="h-screen flex flex-col">
      <TitleNav text="Dashboard" />
      <div className="flex-1 overflow-y-scroll flex flex-col gap-6 p-4 text-foreground bg-background h-full">

        <QuickActions />

        {/* Recent PDFs */}
        <Recents />
      </div>
    </div>
  )
}