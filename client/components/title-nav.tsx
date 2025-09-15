import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import ThemeToggle from './ThemeToggle'

const TitleNav = ({ text }: { text: string }) => {
    return (
        <header className="flex border-b-1 border-b-secondary h-16 shrink-0 justify-between items-center gap-2 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 ">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <h2 className="text-foreground text-sm">{text}</h2>
            </div>
            <ThemeToggle />
        </header>
    )
}

export default TitleNav