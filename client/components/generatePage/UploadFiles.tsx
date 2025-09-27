'use client'
import { useState } from "react"
import { toast } from "sonner"

import { Upload, X } from "lucide-react"
import { usePdfStore } from "@/app/store/usePdfStore"
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave"

export default function UploadFiles() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const { pdfId, setPdf, fileName } = usePdfStore()

    const handleUpload = async (newFile: File) => {
        if (!newFile) return
        setLoading(true)
        try {
            let currentPdfId = pdfId

            // Create PDF if it doesn't exist
            if (!currentPdfId) {
                const createRes = await fetch('/api/createPdf', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ html: '', pdfName: fileName }),
                })
                if (!createRes.ok) throw new Error("Failed to create PDF")
                const createData = await createRes.json()
                currentPdfId = createData.id
                setPdf({ pdfId: currentPdfId })
            }

            // Upload file
            const formData = new FormData()
            formData.append("file", newFile, newFile.name)
            formData.append("pdfId", currentPdfId)

            const res = await fetch("/api/addContext", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const errText = await res.text()
                console.error("Upload failed response:", errText)
                throw new Error("Upload failed")
            }

            setFile(newFile)
            setPdf({ isContext: true })
            toast.success(`${newFile.name} uploaded successfully`)
        } catch (err) {
            console.error("Upload error:", err)
            toast.error("Upload failed")
        } finally {
            setLoading(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0])
            e.dataTransfer.clearData()
        }
    }

    return (
        <div className="w-full">
            <label className="block font-medium mb-2">Upload File</label>

            {/* Dropzone */}
            <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition 
          ${dragActive ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:bg-muted/50"}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <Upload className="mx-auto mb-2 text-muted-foreground" size={28} />
                <p className="text-sm text-muted-foreground">
                    Drag & drop a file here, or <span className="text-primary font-medium">browse</span>
                </p>
                <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                />
            </div>

            {loading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <TextShimmerWave duration={1.2}>Uploading file...</TextShimmerWave>
                </div>
            )}

            {file && (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                    <li className="flex items-center justify-between truncate">
                        <span className="flex items-center gap-2 truncate">📄 <span className="truncate">{file.name}</span></span>
                        <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive transition">
                            <X size={16} />
                        </button>
                    </li>
                </ul>
            )}
        </div>
    )
}