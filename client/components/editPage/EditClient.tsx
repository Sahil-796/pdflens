'use client'

import { usePdfStore } from '@/app/store/usePdfStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import DownloadPDF from '@/components/editPage/DownloadPDF'
import PDFPreview from '@/components/editPage/PDFPreview'
import { toast } from 'sonner'
import SaveChanges from './SaveChanges'
import EditPDF from './EditPDF'
import { Input } from '../ui/input'
import { Dot, Menu, X } from 'lucide-react'
import { useEditPdfStore } from '@/app/store/useEditPdfStore'
import { Button } from '../ui/button'
import { useSidebar } from '../ui/sidebar'

interface Pdf {
  id: string
  fileName: string
  htmlContent: string
  createdAt: string | null
}

export default function EditClient({ id }: { id: string }) {
  const router = useRouter()
  const { htmlContent, setPdf, fileName } = usePdfStore()
  const [editPdf, setEditPdf] = useState<Pdf | null>(null)
  const [contextFiles, setContextFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [initialName, setInitialName] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const { status } = useEditPdfStore()
  const { state } = useSidebar()

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
          const newPdf = data.pdf
          setEditPdf(newPdf)
          setPdf({
            htmlContent: newPdf.htmlContent,
            fileName: newPdf.fileName
          })
          setPdf({ fileName: newPdf.fileName })
          setInitialName(newPdf.fileName)
        } else {
          toast.error("PDF not found")
          router.push("/dashboard")
        }
      } catch (err) {
        console.error(err)
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

  // Auto-close sidebar when AI response is ready or status changes
  useEffect(() => {
    if (status === 'aiResult' || status === 'prompt') {
      setShowSidebar(false)
    }
  }, [status])

  return (
    <div className='flex-1 flex overflow-hidden relative'>
      {/* Mobile Toggle Button */}
      <Button
        variant='secondary'
        onClick={() => setShowSidebar(!showSidebar)}
        className={`lg:hidden fixed bottom-4 left-4 lg:left-4 z-20 p-3 rounded-full transition-all ${state === 'collapsed' ? 'sm:left-15' : 'sm:left-67'}`}
      >
        {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Left Panel - Edit Tools */}
      <div className={`
                ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                fixed lg:relative
                left-0 lg:left-auto
                w-80 max-w-[85vw] lg:max-w-none
                h-[calc(100%-var(--header-height,0px))]
                lg:h-full
                border-r border-border bg-card
                flex flex-col
                transition-transform duration-300 ease-in-out
                z-40
                overflow-hidden
            `}>
        <div className="flex-1 overflow-y-auto p-4">
          <EditPDF onSidebarToggle={() => setShowSidebar(prev => !prev)} />
        </div>

        {/* Context Files - Moved Down */}
        <div className="p-4 mb-4 border-t border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
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
        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="filename" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                File Name:
              </label>
              <div className="relative flex items-center">
                <Input
                  id="filename"
                  placeholder="Enter file name..."
                  value={fileName}
                  disabled={loading}
                  onChange={(e) => setPdf({ fileName: e.target.value })}
                  className="font-medium text-sm w-64"
                />
                {fileName !== initialName && (
                  <Dot className="absolute right-3 text-primary scale-140 animate-caret-blink" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SaveChanges filename={fileName} onSaveSuccess={() => setInitialName(fileName)} />
              <DownloadPDF />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            <div className="flex items-center gap-2">
              <label htmlFor="filename-mobile" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                File Name:
              </label>
              <div className="relative flex items-center flex-1">
                <Input
                  id="filename-mobile"
                  placeholder="Enter file name..."
                  value={fileName}
                  disabled={loading}
                  onChange={(e) => setPdf({ fileName: e.target.value })}
                  className="pr-10 font-medium text-sm w-full"
                />
                {fileName !== initialName && (
                  <Dot className="absolute right-3 text-primary scale-140 animate-caret-blink" />
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center justify-end">
              <SaveChanges filename={fileName} onSaveSuccess={() => setInitialName(fileName)} />
              <DownloadPDF />
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 h-full overflow-hidden"
        >
          <PDFPreview
            loading={loading}
            html={editPdf?.htmlContent || htmlContent}
            pdfId={id}
            onTextSelect={() => setShowSidebar(true)}
          />
        </motion.div>
      </div>
    </div>
  )
}
