'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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

    if (loading)
        return (
            <TextShimmerWave duration={1} className="text-muted-foreground">
                Loading recent PDFs...
            </TextShimmerWave>
        )

    if (pdfs.length === 0)
        return <p className="text-muted-foreground">No PDFs yet. Create one to get started!</p>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pdfs.map((pdf) => (
                <Link href={`/edit/${pdf.id}`} key={pdf.id}>
                    <Card className="cursor-pointer gap-2 transition-all hover:scale-105 duration-150 hover:border-primary">
                        <CardHeader>
                            <CardTitle className="text-primary truncate">{pdf.fileName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="text-xs text-muted-foreground">
                                {pdf.createdAt
                                    ? `Created On: ${new Date(pdf.createdAt).toLocaleDateString(undefined, {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}`
                                    : "Created On: N/A"}
                            </span>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}

export default Recents