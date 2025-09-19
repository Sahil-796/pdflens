'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PDFPreview from './PDFPreview'
import { usePdfStore } from '@/app/store/usePdfStore'
import DownloadPDF from './DownloadPDF'

interface EditSectionProps {
    loading: boolean
}

const EditSection: React.FC<EditSectionProps> = ({ loading }) => {
    const { htmlContent, fileName } = usePdfStore()
    const [input, setInput] = useState('')
    return (
        <AnimatePresence>
            <div className={`w-1/3 bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border relative overflow-hidden`}>
                <h2 className="text-xl font-semibold">
                    Edit PDF
                </h2>

                <motion.div
                    key="editing"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Refine, shorten, or edit..."
                        className="bg-muted border border-border rounded-md p-3 w-full h-40 resize-none 
                         focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
                    />
                </motion.div>
                <DownloadPDF html={htmlContent} pdfName={fileName} />
            </div>
            <motion.div
                key="preview"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto"
            >
                <PDFPreview loading={loading} html={htmlContent} />
            </motion.div>
        </AnimatePresence>
    )
}

export default EditSection