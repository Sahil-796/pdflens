'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import TitleNav from '@/components/bars/title-nav'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import DownloadPDF from '@/components/editPage/DownloadPDF'
import PDFPreview from '@/components/editPage/PDFPreview'
import { toast } from 'sonner'

interface Pdf {
    id: string
    fileName: string
    htmlContent: string
    createdAt: string | null
}

export default function EditClient({ id }: { id: string }) {
    const router = useRouter()
    const { htmlContent, fileName, setPdf } = usePdfStore()
    const [editPrompt, setEditPrompt] = useState('')
    const [editPdf, setEditPdf] = useState<Pdf | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const res = await fetch('/api/getPdf', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pdfId: id
                    })
                })
                if (!res.ok) throw new Error("Failed to fetch PDF")
                const data = await res.json()
                if (data.pdf) {
                    setEditPdf(data.pdf)
                } else {
                    console.error("PDF not found")
                    toast.error("PDF not found")
                    router.push("/dashboard")
                }
            } catch (err) {
                toast.error("Error fetching PDF")
                console.error("Error fetching PDF:", err)
                router.push('/dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetchPdf()
    }, [id, router])

    return (
        <div className='h-screen flex flex-col'>
            <TitleNav text={editPdf?.fileName || "Untitled"} />
            <div className='flex-1 overflow-hidden flex flex-col gap-6 p-6'>

                <DownloadPDF html={editPdf?.htmlContent || htmlContent} pdfName={fileName} />

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
    )
}