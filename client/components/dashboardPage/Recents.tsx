'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null // keep as string, since fetch returns JSON
}

const Recents: React.FC = () => {
    const [pdfs, setPdfs] = useState<Pdf[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                setLoading(true)
                const res = await fetch("/api/getAll")
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

    if (loading) return <div>⏳ Loading recent PDFs...</div>

    return (
        <div className="space-y-3">
            <h2 className="text-primary font-semibold text-lg">Recent PDFs</h2>
            {pdfs.length === 0 ? (
                <p className="text-muted-foreground">No PDFs yet. Create one to get started!</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {pdfs.map((pdf) => (
                        <Link
                            href={`/edit/${pdf.id}`}
                            key={pdf.id}
                            className="p-4 border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                            <p className="text-primary font-medium truncate">{pdf.fileName}</p>
                            <span className="text-xs text-muted-foreground">
                                {pdf.createdAt
                                    ? new Date(pdf.createdAt).toLocaleDateString()
                                    : "No date"}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recents