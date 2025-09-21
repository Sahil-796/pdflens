'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null
}

const Recents: React.FC = () => {
    const [pdfs, setPdfs] = useState<Pdf[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/getALL")
                const data: Pdf[] = await res.json()
                setPdfs(data)
            } catch (error) {
                console.error("Error fetching PDFs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPdfs()
    }, [])

    if (loading)
        return (
            <TextShimmerWave duration={1} className="text-muted-foreground">
                Loading recent PDFs...
            </TextShimmerWave>
        )

    if (pdfs.length === 0)
        return <p className="text-muted-foreground">No PDFs yet. Create one to get started!</p>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs.map((pdf) => (
                <Link
                    href={`/edit/${pdf.id}`}
                    key={pdf.id}
                    className="p-5 border border-border rounded-xl bg-card shadow-sm cursor-pointer flex flex-col justify-between"
                >
                    <p className="text-primary font-semibold text-lg truncate">{pdf.fileName}</p>
                    <span className="text-xs text-muted-foreground mt-2">
                        {pdf.createdAt
                            ? `Created On: ${new Date(pdf.createdAt).toLocaleDateString(undefined, {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}`
                            : "Created On: N/A"}
                    </span>
                </Link>
            ))}
        </div>
    )
}

export default Recents