import TitleNav from '@/components/bars/title-nav'
import PDF2MD from '@/components/toolPages/PDF2MD'
import React from 'react'

const page = () => {
    return (
        <div className='h-screen flex flex-col'>

            <TitleNav text="PDF to MD" />
            <div className='flex-1 overflow-hidden p-4'>
                <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col">
                    <h2 className="text-2xl font-semibold text-primary mb-2">
                        PDF to MD Converter
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Effortlessly convert your PDFs into clean, editable Markdown files. Perfect for developers, writers, and note-takers who prefer working in text-based formats.
                    </p>
                    <div className="flex-1 overflow-y-scroll p-2">
                        <PDF2MD />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page