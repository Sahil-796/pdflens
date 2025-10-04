'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import TitleNav from '@/components/bars/title-nav'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import DownloadPDF from '@/components/editPage/DownloadPDF'
import PDFPreview from '@/components/editPage/PDFPreview'
import { toast } from 'sonner'
import SaveChanges from './SaveChanges'
import EditPDF from './EditPDF'

interface Pdf {
    id: string
    fileName: string
    htmlContent: string
    createdAt: string | null
}

export default function EditClient({ id }: { id: string }) {
    const router = useRouter()
    const { htmlContent, fileName, setPdf } = usePdfStore()
    const [editPdf, setEditPdf] = useState<Pdf | null>(null)
    const [contextFiles, setContextFiles] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setPdf({ pdfId: id })

        const fetchPdf = async () => {
            try {
                const res = await fetch('/api/getPdf', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pdfId: id })
                })
                if (!res.ok) throw new Error("Failed to fetch PDF")
                const data = await res.json()
                if (data.pdf) {
                    setEditPdf(data.pdf)
                } else {
                    toast.error("PDF not found")
                    router.push("/dashboard")
                }
            } catch (err) {
                toast.error(err || "Error fetching PDF")
                router.push('/dashboard')
            }
        }

        const fetchContextFiles = async () => {
            try {
                const res = await fetch('/api/getContext', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pdfId: id })
                })
                if (!res.ok) throw new Error("Failed to fetch context files")
                const data = await res.json()
                setContextFiles(data.files || [])
            } catch (err) {
                console.error("Error fetching context files:", err)
                toast.error("Error fetching context files")
            }
        }

        Promise.all([fetchPdf(), fetchContextFiles()]).finally(() => setLoading(false))
    }, [id, router, setPdf])

    return (
        <div className='h-screen flex flex-col bg-background'>
            {/* Standalone Title Navigation */}
            <TitleNav text={editPdf?.fileName || "Untitled"} />

            <div className='flex-1 flex overflow-hidden'>
                {/* Left Panel - Edit Tools */}
                <div className='w-80 border-r border-border bg-card flex flex-col'>
                    {/* Edit Tools - More Space */}
                    <div className="flex-1 p-4">
                        <h2 className="text-sm font-medium text-muted-foreground mb-3">Edit Tools</h2>
                        <EditPDF />
                    </div>
                    
                    {/* Context Files - Moved Down */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-muted-foreground">Context Files</h3>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {contextFiles.length}
                            </span>
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                            {loading ? (
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-muted animate-pulse" />
                                    <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                                </div>
                            ) : contextFiles.length > 0 ? (
                                <ul className="space-y-1">
                                    {contextFiles.map((file, i) => (
                                        <li key={i} className="text-xs text-muted-foreground truncate px-2 py-1 rounded bg-muted/50 hover:bg-muted/70 transition-colors">
                                            {file}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-muted-foreground">No context files</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main PDF View with Action Buttons */}
                <div className='flex-1 flex flex-col min-w-0'>
                    {/* Action Buttons on Top of PDF */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Actions</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <SaveChanges />
                            <DownloadPDF html={editPdf?.htmlContent || htmlContent} pdfName={fileName} />
                        </div>
                    </div>

                    {/* PDF Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 h-full overflow-hidden"
                    >
                        <PDFPreview loading={loading} html={editPdf?.htmlContent || htmlContent} pdfId={id} />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}