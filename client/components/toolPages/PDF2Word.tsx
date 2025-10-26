'use client'

import React, { useState } from 'react'
import { Upload, FileText, X, File, Download, ArrowLeftCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { toast } from 'sonner'

const PDF2Word = () => {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)

  const handleInvalidFileType = () => toast.info("Invalid File Type")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        handleInvalidFileType()
        e.target.value = ''
        return
      }
      if (selected.size > 5 * 1024 * 1024) {
        toast.info("File size too large")
        e.target.value = ""
        return
      }
      setFile(selected)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (!droppedFile.name.toLowerCase().endsWith('.pdf')) {
        handleInvalidFileType()
        return
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.info("File size too large")
        return
      }
      setFile(droppedFile)
    }
  }

  const handleConvert = async () => {
    if (!file) {
      toast.info("No File Selected")
      return
    }

    setIsConverting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/tools/pdf-to-docx`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to convert PDF")

      const blob = await res.blob()
      setConvertedBlob(blob)
      setSuccess(true)

      // Auto-download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace('.pdf', '.docx')
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error('Conversion Failed')
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedBlob) return
    const url = window.URL.createObjectURL(convertedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = file?.name.replace('.pdf', '.docx') || 'converted.docx'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 items-center justify-center h-full px-4 py-6">
      {success ? (
        <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-md space-y-6">
          {/* Success Message */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-blue-300 font-medium text-center sm:text-left text-lg sm:text-xl">
            <CheckCircle2 className="size-5 sm:size-6" />
            <span>Your PDF has been converted successfully!</span>
          </div>

          {/* File Icon */}
          <div className="flex flex-col items-center space-y-2">
            <FileText size={48} className="text-blue-300" />
            <div>
              <p className="font-semibold text-lg sm:text-xl text-foreground">
                {file?.name.replace('.pdf', '.docx')}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
            <Button
              onClick={() => {
                setFile(null)
                setSuccess(false)
                setConvertedBlob(null)
              }}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-6 text-base sm:text-lg w-full sm:w-auto justify-center cursor-pointer"
            >
              <ArrowLeftCircle className="size-5" /> Convert More
            </Button>

            <Button
              onClick={handleDownload}
              variant="default"
              size="lg"
              className="flex items-center gap-2 px-6 text-base sm:text-lg w-full sm:w-auto justify-center bg-gradient-to-br from-blue-300 to-blue-200 cursor-pointer"
            >
              <Download className="size-5" /> Download
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-sm">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl w-full py-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${dragActive
                ? 'border-blue-300 bg-blue-100 scale-[1.02]'
                : 'border-border hover:bg-muted/30'
                }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload className="text-blue-300 mb-3" size={40} />
              <p className="text-sm sm:text-base text-blue-300 text-center">
                Drop your PDF here or click to upload
              </p>
              <p className='text-muted-foreground text-sm'>
                (Max File Size: 5MB)
              </p>
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-5 w-full">
              <FileText size={44} className="text-blue-300" />
              <div>
                <p className="text-lg sm:text-xl font-medium text-foreground">{file.name}</p>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              {isConverting ? (
                <Empty className="w-full">
                  <EmptyHeader>
                    <EmptyMedia variant="icon" className="text-blue-300">
                      <Spinner />
                    </EmptyMedia>
                    <EmptyTitle className="text-blue-300 text-lg sm:text-xl">Converting to Word</EmptyTitle>
                    <EmptyDescription className="text-sm sm:text-base">
                      Please wait while PDF is converted to Word. Do not refresh the page.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full items-center justify-center">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => setFile(null)}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
                  >
                    <X size={16} /> Change File
                  </Button>
                  <Button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gradient-to-br from-blue-300 to-blue-200 cursor-pointer scale-97 hover:scale-100"
                    size="lg"
                  >
                    <File size={16} /> Convert to Word
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

export default PDF2Word
