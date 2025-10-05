'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
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
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { toast } from "sonner"
import { FileText, Trash2, Calendar, Plus } from "lucide-react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { usePdf } from '@/hooks/usePdf';

interface Pdf {
    id: string
    fileName: string
    createdAt: string | null
    htmlContent: string
}

interface PdfListProps {
    limit?: number
    showDelete?: boolean
    showViewMore?: boolean
    emptyTitle?: string
    emptyDescription?: string
    emptyActionText?: string
    emptyActionPath?: string
    onPdfClick?: (pdf: Pdf) => void
    className?: string
}

const PdfList: React.FC<PdfListProps> = ({
    limit = 8,
    showDelete = true,
    showViewMore = true,
    emptyTitle = "No PDFs Yet",
    emptyDescription = "Create or upload one to get started!",
    emptyActionText = "Create PDF",
    emptyActionPath = "/generate",
    onPdfClick,
    className = ""
}) => {
    const { pdfs, loading, handleDelete, handleViewMore, showAll, totalCount } = usePdf(limit);
    const router = useRouter();

    const handlePdfClick = (pdf: Pdf) => {
        if (onPdfClick) {
            onPdfClick(pdf)
        } else {
            router.push(`/edit/${pdf.id}`)
        }
    }

    if (loading)
        return (
            <div className={`space-y-6 ${className}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="h-28 rounded-lg border border-border bg-card p-4 flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-muted animate-pulse" />
                                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                            </div>
                            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        )

    if (pdfs.length === 0)
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FileText className="size-10 text-muted-foreground p-2" />
                    </EmptyMedia>
                    <EmptyTitle>{emptyTitle}</EmptyTitle>
                    <EmptyDescription>{emptyDescription}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2 cursor-pointer">
                        <Button onClick={() => router.push(emptyActionPath)}>
                            <Plus /> {emptyActionText}
                        </Button>
                    </div>
                </EmptyContent>
            </Empty>
        )

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                    {pdfs.map((pdf, idx) => (
                        <motion.div
                            key={pdf.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: idx * 0.03, duration: 0.2, ease: "easeOut" }}
                            whileHover={{ y: -2 }}
                        >
                            <Card
                                onClick={() => handlePdfClick(pdf)}
                                className="group h-28 border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer"
                            >
                                <CardContent className="p-4 h-full flex flex-col justify-between">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="p-1.5 rounded-md bg-muted/50 group-hover:bg-muted transition-colors">
                                                <FileText className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-sm text-foreground truncate">
                                                    {pdf.fileName}
                                                </h3>
                                            </div>
                                        </div>

                                        {showDelete && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete PDF</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete <strong>{pdf.fileName}</strong>? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive hover:bg-destructive/80"
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
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {pdf.createdAt
                                                ? new Date(pdf.createdAt).toLocaleDateString(undefined, { 
                                                    day: "2-digit", 
                                                    month: "short" 
                                                })
                                                : "N/A"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {showViewMore && !showAll && pdfs.length < totalCount && (
                <div className="flex justify-center pt-2">
                    <Button
                        onClick={handleViewMore}
                        variant="outline"
                        className="px-6 py-2 rounded-lg hover:bg-muted transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : `View All (${totalCount})`}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default PdfList
