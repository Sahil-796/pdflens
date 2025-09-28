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
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

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

    const handleDelete = async (pdfId: string, pdfName: string) => {
        try {
            const res = await fetch("/api/deletePdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pdfId }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Failed to delete")
            }

            toast.success(`${pdfName} deleted`)
            setPdfs((prev) => prev.filter((p) => p.id !== pdfId))
        } catch (error) {
            console.error("Error deleting PDF:", error)
            toast.error("Failed to delete PDF")
        }
    }

    if (loading)
        return (
            <TextShimmerWave duration={1} className="text-muted-foreground">
                Loading recent PDFs...
            </TextShimmerWave>
        )

    if (pdfs.length === 0)
        return <p className="text-muted-foreground">No PDFs yet. Create one to get started!</p>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {pdfs.map((pdf) => (
                <Card key={pdf.id} className="flex-1 flex flex-col transition-all duration-150 hover:scale-105 hover:border-primary">
                    {/* Header */}
                    <CardHeader className="flex flex-row items-center justify-between gap-6">
                        {/* PDF Link */}
                        <Link href={`/edit/${pdf.id}`} className="flex-1 min-w-0">
                            <CardTitle className="truncate text-primary text-sm sm:text-base">
                                {pdf.fileName}
                            </CardTitle>
                        </Link>

                        {/* Delete Confirmation Dialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="cursor-pointer shrink-0"
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete PDF</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete{" "}
                                        <strong>{pdf.fileName}</strong>? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive hover:bg-destructive/80 cursor-pointer"
                                        onClick={() => handleDelete(pdf.id, pdf.fileName)}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="mt-auto">
                        <span className="text-xs text-muted-foreground">
                            {pdf.createdAt
                                ? `Created On: ${new Date(pdf.createdAt).toLocaleDateString(
                                    undefined,
                                    { day: "2-digit", month: "short", year: "numeric" }
                                )}`
                                : "Created On: N/A"}
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default Recents