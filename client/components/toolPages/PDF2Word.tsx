'use client'

import React, { useState } from 'react'
import { Upload, FileText, X, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface UploadedFile {
    name: string
    size: string
}

const PDF2Word = () => {
    const [file, setFile] = useState<UploadedFile | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [isConverting, setIsConverting] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) {
            const sizeMB = (selected.size / (1024 * 1024)).toFixed(2)
            setFile({ name: selected.name, size: `${sizeMB} MB` })
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            const sizeMB = (droppedFile.size / (1024 * 1024)).toFixed(2)
            setFile({ name: droppedFile.name, size: `${sizeMB} MB` })
        }
    }

    const handleConvert = () => {
        setIsConverting(true)
        setTimeout(() => {
            setIsConverting(false)
            // placeholder for conversion logic
        }, 2000)
    }

    return (
        <div className="flex flex-1 items-center justify-center h-full bg-background px-4 py-6">
            <Card className="w-full max-w-xl border-border bg-card p-8 flex flex-col items-center justify-center rounded-2xl shadow-sm">
                {!file ? (
                    <div
                        className={`border-2 border-dashed rounded-xl w-full py-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${dragActive
                                ? 'border-primary bg-primary/5 scale-[1.02]'
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
                        <Upload className="text-muted-foreground mb-3" size={40} />
                        <p className="text-sm text-muted-foreground">
                            Drop your PDF here or click to upload
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
                    <div className="flex flex-col items-center text-center space-y-5">
                        <FileText size={40} className="text-primary" />
                        <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setFile(null)}
                                className="flex items-center gap-2"
                            >
                                <X size={16} /> Remove File
                            </Button>
                            <Button
                                onClick={handleConvert}
                                disabled={isConverting}
                                className="flex items-center gap-2"
                            >
                                {isConverting ? (
                                    <>
                                        <span className="animate-spin rounded-full border-2 border-t-transparent border-background size-4" />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        <File size={16} /> Convert to Word
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default PDF2Word