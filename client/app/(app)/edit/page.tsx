import TitleNav from '@/components/bars/title-nav'
import PdfSelector from '@/components/shared/PdfSelector'
import React from 'react'

const Page = () => {
    return (
        <div className="h-screen flex flex-col">
            <TitleNav text="Edit PDF" />
            <div className="flex-1 overflow-hidden p-4">
                <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
                    <h2 className="text-xl font-semibold text-primary mb-2">
                        Choose a PDF to Edit
                    </h2>
                    <p className="text-muted-foreground text-sm mb-6">
                        Select one of your recent PDFs below to continue editing, or create a new one from the dashboard.
                    </p>
                    <div className="flex-1 overflow-y-scroll p-2">
                        <PdfSelector />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page