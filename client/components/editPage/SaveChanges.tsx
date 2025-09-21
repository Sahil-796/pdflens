'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'

const SaveChanges = () => {
    const { htmlContent, pdfId } = usePdfStore()
    const [loading, setLoading] = useState(false)

    async function handleSave() {
        if (!htmlContent) return;

        setLoading(true)
        const res = await fetch("/api/updatePdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                html: htmlContent,
                id: pdfId
            }),
        });

        if (res.ok) {
            setLoading(false)
            toast.success("Changes Saved.")
        } else {
            toast.error("Error while Saving.")
        }
    }
    return (
        <button
            onClick={handleSave}
            className="bg-secondary text-secondary-foreground rounded-md py-2 px-4 hover:bg-secondary/90 transition cursor-pointer"
            disabled={loading}
        >
            {loading ? <TextShimmerWave>Saving...</TextShimmerWave> : "Save Changes"}
        </button>
    )
}

export default SaveChanges