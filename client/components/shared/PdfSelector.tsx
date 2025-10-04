'use client'

import React from 'react'
import PdfList from './PdfList'

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null
    htmlContent: string
}

interface PdfSelectorProps {
    onPdfSelect?: (pdf: Pdf) => void
    className?: string
}

const PdfSelector: React.FC<PdfSelectorProps> = ({ 
    onPdfSelect, 
    className = "" 
}) => {
    return (
        <PdfList
            limit={12}
            showDelete={false}
            showViewMore={true}
            emptyTitle="No PDFs to Edit"
            emptyDescription="Create a new PDF to get started with editing."
            emptyActionText="Create PDF"
            emptyActionPath="/generate"
            onPdfClick={onPdfSelect}
            className={className}
        />
    )
}

export default PdfSelector
