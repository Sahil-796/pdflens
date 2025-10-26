'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Download, CheckCircle2, FileText, ArrowLeftCircle, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const MAX_FREE_FILES = 5

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isMerging, setIsMerging] = useState(false)
  const [success, setSuccess] = useState(false)
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const handleInvalidFileType = () => toast.info("Invalid File Type. Please upload PDF files only.")

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        handleInvalidFileType()
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.info(`${file.name} is too large. Max size: 10MB`)
        return false
      }
      return true
    })

    const currentCount = files.length
    const newCount = currentCount + validFiles.length

    if (newCount > MAX_FREE_FILES) {
      setShowUpgradeModal(true)
      const allowedFiles = validFiles.slice(0, MAX_FREE_FILES - currentCount)
      if (allowedFiles.length > 0) {
        setFiles(prev => [...prev, ...allowedFiles])
      }
      return
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length > 0) {
      addFiles(selected)
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= files.length) return

    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]]
    setFiles(newFiles)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.info("Please upload at least 2 PDF files to merge")
      return
    }

    setIsMerging(true)
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/tools/merge_pdf`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to merge PDFs")
      }

      const blob = await res.blob()
      setMergedBlob(blob)
      setSuccess(true)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Merge Failed')
    } finally {
      setIsMerging(false)
    }
  }

  const handleDownload = () => {
    if (!mergedBlob) return
    const url = window.URL.createObjectURL(mergedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'merged.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center h-full px-4 py-6">
        {success ? (
          <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-purple-600 font-medium text-center sm:text-left text-lg sm:text-xl">
              <CheckCircle2 className="size-5 sm:size-6" />
              <span>Your PDFs have been merged successfully!</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <FileText size={48} className="text-purple-600" />
              <div>
                <p className="font-semibold text-lg sm:text-xl text-foreground">
                  merged.pdf
                </p>
                <p className="text-sm text-muted-foreground">
                  {files.length} files merged
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
              <Button
                onClick={() => {
                  setFiles([])
                  setSuccess(false)
                  setMergedBlob(null)
                }}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-6 text-base sm:text-lg w-full sm:w-auto justify-center cursor-pointer"
              >
                <ArrowLeftCircle className="size-5" /> Merge More
              </Button>

              <Button
                onClick={handleDownload}
                variant="default"
                size="lg"
                className="flex items-center gap-2 px-6 text-base sm:text-lg w-full sm:w-auto justify-center bg-gradient-to-br from-purple-500 to-purple-400 cursor-pointer"
              >
                <Download className="size-5" /> Download
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-sm">
            {files.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-xl w-full py-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${dragActive
                  ? 'scale-[1.02]'
                  : 'border-border hover:bg-muted/30'
                  }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <Upload className="text-purple-600 mb-3" size={40} />
                <p className="text-sm sm:text-base text-purple-600 text-center">
                  Drop your PDFs here or click to upload
                </p>
                <p className='text-muted-foreground text-sm'>
                  (Max {MAX_FREE_FILES} files, 5MB each)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-5 w-full h-full">
                <div className='w-full flex items-center gap-4 justify-center'>
                  <FileText className="text-purple-600 h-7 w-7" />

                  <span className="text-lg sm:text-xl font-medium text-foreground">
                    {files.length} PDF{files.length > 1 ? 's' : ''} Ready to Merge
                  </span>
                </div>

                <Reorder.Group axis="y" values={files} onReorder={setFiles} className="w-full space-y-2 h-90 overflow-y-auto">
                  {files.map((file, index) => (
                    <Reorder.Item
                      key={file.name + file.size}
                      value={file}
                      className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 text-left cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-2 text-purple-600">
                        <GripVertical size={20} className="flex-shrink-0" />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronUp size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === files.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronDown size={16} />
                        </Button>
                      </div>

                      <div className="flex items-center justify-center bg-purple-100 rounded px-2 py-1 min-w-[2rem]">
                        <span className="text-sm font-semibold text-purple-600">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0"
                      >
                        <X size={16} />
                      </Button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {isMerging ? (
                  <Empty className="w-full">
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="text-purple-600">
                        <Spinner />
                      </EmptyMedia>
                      <EmptyTitle className="text-purple-600 text-lg sm:text-xl">Merging PDFs</EmptyTitle>
                      <EmptyDescription className="text-sm sm:text-base">
                        Please wait while your PDFs are being merged. Do not refresh the page.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full items-center justify-center">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={triggerFileInput}
                      disabled={files.length >= MAX_FREE_FILES}
                      className="flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                    >
                      <Upload size={16} /> Add More Files
                    </Button>
                    <Button
                      onClick={handleMerge}
                      disabled={isMerging || files.length < 2}
                      className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gradient-to-br from-purple-500 to-purple-400 cursor-pointer"
                      size="lg"
                    >
                      <FileText size={16} /> Merge PDFs
                    </Button>
                  </div>
                )}

                {files.length >= MAX_FREE_FILES && (
                  <p className="text-xs text-muted-foreground">
                    Free tier limit reached. Upgrade to merge more files.
                  </p>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Upgrade to Pro</DialogTitle>
            <DialogDescription>
              You've reached the free tier limit of <span className='text-purple-600 font-semibold'>{MAX_FREE_FILES} files per merge</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="font-medium text-foreground">
            Upgrade to Pro to unlock:
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Merge unlimited PDF files</li>
            <li>Larger file size limits</li>
            <li>Priority processing</li>
            <li>Advanced PDF tools</li>
          </ul>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1 cursor-pointer"
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-gradient-to-br from-purple-500 to-purple-400 cursor-pointer"
              onClick={() => {
                setShowUpgradeModal(false)
                router.push('/pricing')
              }}
            >
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MergePdf
