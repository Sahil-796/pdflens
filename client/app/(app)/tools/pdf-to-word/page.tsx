import TitleNav from '@/components/bars/title-nav'
import Pdf2Word from '@/components/toolPages/PDF2Word'
import React from 'react'

const page = () => {
    return (
        <div className='h-screen flex flex-col'>

            <TitleNav text="PDF to Word" />
            <div className='flex-1 overflow-hidden p-4'>
                <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
                    <h2 className="text-2xl font-semibold text-primary mb-2">
                        PDF to WORD Converter
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Convert your PDFs into fully editable Word documents while preserving formatting, fonts, and structure — perfect for quick edits and document updates.
                    </p>
                    <div className="flex-1 overflow-y-scroll p-2">
                        <Pdf2Word />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page