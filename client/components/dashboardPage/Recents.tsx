'use client'

import React, { useEffect, useState } from 'react'
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
import { FileText, Trash2, Calendar } from "lucide-react"
import { useRouter } from 'next/navigation'

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null
    htmlContent: string
}

const Recents: React.FC = () => {
    const [pdfs, setPdfs] = useState<Pdf[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMore, setViewMore] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchPdfs = async (limit = 8) => {
            try {
                setLoading(true)
                const res = await fetch(`/api/getAll?limit=${limit}`)
                const data: Pdf[] = await res.json()
                data.forEach(pdf => {
                    if (pdf.htmlContent === '') {
                        handleDelete(pdf.id)
                    }
                });
                setPdfs(data)
            } catch (error) {
                console.error("Error fetching PDFs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPdfs(8)
    }, [])

    const handleViewMore = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/getAll`) // fetch all
            const data: Pdf[] = await res.json()
            data.forEach(pdf => {
                if (pdf.htmlContent === '') {
                    handleDelete(pdf.id)
                }
            });
            setPdfs(data)
            setViewMore(true)
        } catch (err) {
            console.error("Error fetching all PDFs:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (pdfId: string, pdfName?: string) => {
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

            if (pdfName) {
                toast.success(`${pdfName} deleted`)
            }
            setPdfs((prev) => prev.filter((p) => p.id !== pdfId))
        } catch (error) {
            console.error("Error deleting PDF:", error)
            toast.error("Failed to delete PDF")
        }
    }

    // Skeleton loader
    if (loading)
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border shadow-sm flex flex-col gap-3 overflow-hidden relative bg-card">
                        <div className="h-6 w-3/4 rounded bg-muted relative overflow-hidden animate-pulse" />
                        <div className="h-6 w-full rounded bg-muted relative overflow-hidden animate-pulse" />
                        <div className="h-4 w-1/2 rounded bg-muted relative overflow-hidden animte-pulse" />
                    </div>
                ))}
            </div>
        )

    // Empty state
    if (pdfs.length === 0)
        return (
            <div className="flex flex-col items-center justify-center text-center p-10 border rounded-xl bg-muted/30">
                <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium">No PDFs yet</p>
                <p className="text-sm text-muted-foreground">Create or upload one to get started!</p>
            </div>
        )

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
                {pdfs.map((pdf) => (
                    <Card
                        key={pdf.id}
                        onClick={() => router.push(`/edit/${pdf.id}`)}
                        className="flex flex-col group rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 cursor-pointer"
                    >
                        <CardHeader className="flex flex-row items-start justify-between gap-3">
                            <CardTitle className="truncate flex items-center gap-2 text-primary text-sm sm:text-base">
                                <FileText className="w-4 h-4 text-primary/80 shrink-0" />
                                {pdf.fileName}
                            </CardTitle>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                        onClick={(e) => e.stopPropagation()} // prevent card click
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete PDF</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete{" "}
                                            <strong>{pdf.fileName}</strong>? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive hover:bg-destructive/80 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(pdf.id, pdf.fileName)
                                            }}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardHeader>

                        <CardContent className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {pdf.createdAt
                                ? `Created: ${new Date(pdf.createdAt).toLocaleDateString(
                                    undefined,
                                    { day: "2-digit", month: "short", year: "numeric" }
                                )}`
                                : "Created: N/A"}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!viewMore && pdfs.length >= 8 && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleViewMore}
                        variant="outline"
                        className="cursor-pointer px-6 py-2 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "View More"}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Recents