'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
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
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium rounded-lg px-5 py-2.5 shadow-md hover:bg-primary/90 hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
        >
            <Save className={`w-4 h-4 ${loading && 'animate-caret-blink'}`} />
            <span>Save Changes</span>
        </button>
    )
}

export default SaveChanges