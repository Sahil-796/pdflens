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
                toast.error("Error fetching PDF")
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
        <div className='h-screen flex flex-col'>
            <TitleNav text={editPdf?.fileName || "Untitled"} />
            <div className='flex-1 overflow-hidden flex gap-6 p-6'>

                <div className='flex flex-col gap-6 w-1/3'>
                    <EditPDF />

                    {/* Context Files */}
                    <div className="max-h-46 bg-card border border-border rounded-xl p-4 shadow overflow-y-auto">
                        <h2 className="font-medium mb-2">Context Files</h2>

                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded bg-muted relative overflow-hidden animate-pulse" />
                                <div className="h-4 w-3/4 rounded bg-muted relative overflow-hidden animate-pulse" />
                                <div className="h-4 w-2/3 rounded bg-muted relative overflow-hidden animate-pulse" />
                            </div>
                        ) : contextFiles.length > 0 ? (
                            // Files list
                            <ul className="space-y-2">
                                {contextFiles.map((file, i) => (
                                    <li
                                        key={i}
                                        className="p-2 rounded bg-muted text-sm flex items-center justify-between"
                                    >
                                        <span className="truncate">{file}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            // Empty state
                            <p className="text-muted-foreground text-sm">
                                No context files uploaded
                            </p>
                        )}
                    </div>
                </div>

                <div className='flex-1 flex flex-col gap-4'>
                    <div className='flex items-center justify-between gap-3 px-10'>
                        <SaveChanges />
                        <DownloadPDF html={editPdf?.htmlContent || htmlContent} pdfName={fileName} />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 overflow-y-auto bg-card border border-border rounded-xl shadow-lg p-4"
                    >
                        <PDFPreview loading={loading} html={editPdf?.htmlContent || htmlContent} pdfId={id} />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}