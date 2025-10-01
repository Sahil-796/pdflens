'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

const SaveChanges = () => {
    const { renderedHtml, pdfId } = usePdfStore()
    const [loading, setLoading] = useState(false)

    async function handleSave() {
        if (!renderedHtml) return

        setLoading(true)
        const res = await fetch("/api/updatePdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                html: renderedHtml,
                id: pdfId
            }),
        })

        if (res.ok) {
            setLoading(false)
            toast.success("Changes Saved.")
        } else {
            setLoading(false)
            toast.error("Error while Saving.")
        }
    }

    return (
        <button
            onClick={handleSave}
            disabled={loading}
            className="group flex items-center bg-primary text-primary-foreground font-medium rounded-lg py-2 hover:py-2 px-3 hover:px-4 shadow-md hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
            <Save className={`w-4 h-4 shrink-0 ${loading && 'animate-caret-blink'}`} />

            <span
                className="max-w-0 opacity-0 group-hover:ml-2 group-hover:max-w-xs group-hover:opacity-200 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden"
            >
                Save Changes
            </span>
        </button>
    )
}

export default SaveChanges