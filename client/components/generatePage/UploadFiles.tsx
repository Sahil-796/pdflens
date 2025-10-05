'use client'
import { useState } from "react"
import { toast } from "sonner"
import { LoaderCircle, Upload, X } from "lucide-react"
import { usePdfStore } from "@/app/store/usePdfStore"

interface UploadedFile {
    name: string
}

export default function UploadFiles() {
    const { pdfId, setPdf, fileName } = usePdfStore()
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)

    const uploadFile = async (newFile: File) => {
        if (!newFile || loading) return
        setLoading(true)

        let createdPdfId: string | null = null

        try {
            let currentPdfId = pdfId

            // Step 1: Create PDF if missing
            if (!currentPdfId) {
                const createRes = await fetch('/api/createPdf', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ html: '', pdfName: fileName }),
                })

                if (!createRes.ok) throw new Error("Failed to create PDF")
                const createData = await createRes.json()
                currentPdfId = createData.id
                createdPdfId = currentPdfId
                setPdf({ pdfId: currentPdfId })
            }

            if (!currentPdfId) throw new Error("PDF ID is missing")

            const apiEndpoint = files.length === 0 ? "/api/addContext" : "/api/updateContext"

            const formData = new FormData()
            formData.append("file", newFile, newFile.name)
            formData.append("pdfId", currentPdfId)

            const res = await fetch(apiEndpoint, { method: "POST", body: formData })
            if (!res.ok) {
                const errText = await res.text()
                console.error("Upload failed:", errText)

                if (createdPdfId) {
                    try {
                        await fetch(`/api/deletePdf`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pdfId: createdPdfId }),
                        })
                        setPdf({ pdfId: null, isContext: false })
                    } catch (delErr) {
                        console.error("Failed to delete orphan PDF:", delErr)
                    }
                }

                throw new Error("Upload failed")
            }

            await res.json()

            setFiles(prev => [...prev, { name: newFile.name }])
            setPdf({ isContext: true })
            toast.success(`${newFile.name} uploaded successfully`)
        } catch (err) {
            console.error("Upload error:", err)
            toast.error("Upload failed")
        } finally {
            setLoading(false)
        }
    }

    const removeFile = async (fileName: string, idx: number) => {
        if (!pdfId) return
        try {
            setIsRemoving(true)
            const res = await fetch("/api/removeContext", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pdfId, filename: fileName }),
            })

            if (!res.ok) {
                const errText = await res.text()
                console.error("Remove failed:", errText)
                throw new Error("Remove failed")
            }

            await res.json()
            setFiles(prev => prev.filter((_, i) => i !== idx))

            if (files.length === 1) {
                setPdf({ isContext: false })
            }

            toast.success(`${fileName} removed successfully`)

        } catch (err) {
            console.error("Remove error:", err)
            toast.error("Failed to remove file")
        } finally {
            setIsRemoving(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (loading) return // block drop while uploading
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadFile(e.dataTransfer.files[0])
            e.dataTransfer.clearData()
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Reference Files</label>
                <span className="text-xs text-muted-foreground">{files.length} uploaded</span>
            </div>

            {/* Drag & Drop Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                    min-h-[160px] flex flex-col items-center justify-center
                    ${dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:bg-muted/30"}
                    ${loading ? "opacity-50 cursor-wait" : ""}
                    `}
                onDragOver={(e) => {
                    if (!loading) {
                        e.preventDefault()
                        setDragActive(true)
                    }
                }}
                onDragLeave={() => {
                    if (!loading) setDragActive(false)
                }}
                onDrop={handleDrop}
                onClick={() => {
                    if (!loading) document.getElementById("fileInput")?.click()
                }}
            >
                <Upload
                    className={`mx-auto mb-2 text-muted-foreground transition-transform ${loading ? "animate-bounce" : "group-hover:scale-110"
                        }`}
                    size={28}
                />
                <p className="text-sm text-muted-foreground">
                    {loading ? "Uploading..." : "Drop files here or click to browse"}
                </p>
                <input
                    disabled={loading}
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
                />
            </div>

            {/* Files List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Uploaded Files:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {files.map((fileItem, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-sm"
                            >
                                <span className="flex items-center gap-2 truncate">
                                    📄 <span className="truncate">{fileItem.name}</span>
                                </span>
                                <button
                                    onClick={() => removeFile(fileItem.name, idx)}
                                    className="text-destructive hover:bg-destructive/10 p-1 rounded transition"
                                >
                                    {isRemoving ? (
                                        <LoaderCircle size={14} className="animate-spin" />
                                    ) : (
                                        <X size={14} />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}