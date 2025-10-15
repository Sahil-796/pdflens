import React from 'react'
import TitleNav from '@/components/bars/title-nav'
import ToolsHome from '@/components/toolPages/tools-home'

const Page = () => {
    return (
        <div className="h-screen flex flex-col">
            <TitleNav text="Tools" />
            <div className="flex-1 overflow-hidden p-4">
                <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
                    <h2 className="text-xl font-semibold text-primary mb-2">
                        Your PDF toolbox
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Quickly convert, split, merge, and organize your PDFs. Select a file and choose a tool below to get started.
                    </p>
                    <div className="flex-1 overflow-y-scroll p-2">
                        <ToolsHome />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page