'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import { usePdf } from '@/hooks/usePdf'

const SaveChanges = ({ filename, onSaveSuccess }: { filename: string, onSaveSuccess?: () => void }) => {
    const { renderedHtml, pdfId } = usePdfStore()
    const { pdfs } = usePdf()
    const [loading, setLoading] = useState(false)

    async function handleSave() {
        if (!renderedHtml) return

        setLoading(true)
        if (filename.trim() == '') {
            toast.error("Filename can't be empty")
            return
        }
        const res = await fetch("/api/updatePdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                html: renderedHtml,
                id: pdfId,
                filename
            }),
        })

        if (res.ok) {
            setLoading(false)
            toast.success("Changes Saved.")
            onSaveSuccess?.()
            pdfs.forEach(e => {
                if (e.id == pdfId) e.fileName = filename
            })
        } else {
            setLoading(false)
            toast.error("Error while Saving.")
        }
    }

    return (
        <button
            onClick={handleSave}
            disabled={loading}
            className="group flex items-center gap-2 bg-primary text-primary-foreground font-medium rounded-md px-3 py-2 text-sm shadow-sm hover:bg-primary/90 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Save className={`w-4 h-4 ${loading ? 'animate-caret-blink' : ''}`} />
            <span className="hidden sm:inline">Save</span>
        </button>
    )
}

export default SaveChanges