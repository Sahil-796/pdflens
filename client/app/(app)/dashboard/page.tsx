import React from "react"
import TitleNav from "@/components/bars/title-nav"
import Recents from "@/components/dashboardPage/Recents"
import QuickActions from "@/components/dashboardPage/QuickActions"

export default function Dashboard() {

  return (
    <div className="h-screen flex flex-col">
      <TitleNav text="Dashboard" />
      <div className="flex-1 overflow-y-auto bg-muted/5">
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
          <QuickActions />
          <Recents />
        </div>
      </div>
    </div>
  )
}