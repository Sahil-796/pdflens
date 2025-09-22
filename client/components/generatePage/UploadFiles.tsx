'use client'
import { useState } from "react"
import { toast } from "sonner"
import { TextShimmerWave } from "../motion-primitives/text-shimmer-wave"
import { Upload, X } from "lucide-react"
import { usePdfStore } from "@/app/store/usePdfStore"

export default function UploadFiles() {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const {pdfId} = usePdfStore()

    const handleUpload = async (newFiles: File[]) => {
        if (!pdfId) {
            toast.error("No PDF ID provided")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            for (const file of newFiles) {
                formData.append("files", file)
            }
            formData.append("pdfId", pdfId)

            const res = await fetch("/api/addContext", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Upload failed")

            const data = await res.json()
            setFiles((prev) => [...prev, ...newFiles])
            toast.success(`${newFiles.length} file(s) uploaded successfully`)
            console.log("Upload response:", data)
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
            handleUpload(Array.from(e.dataTransfer.files))
            e.dataTransfer.clearData()
        }
    }

    return (
        <div className="w-full">
            <label className="block font-medium mb-2">Upload Files</label>

            {/* Dropzone */}
            <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition 
          ${dragActive ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:bg-muted/50"}`}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <Upload className="mx-auto mb-2 text-muted-foreground" size={28} />
                <p className="text-sm text-muted-foreground">
                    Drag & drop files here, or <span className="text-primary font-medium">browse</span>
                </p>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files) {
                            handleUpload(Array.from(e.target.files))
                        }
                    }}
                />
            </div>

            {/* Loading shimmer */}
            {loading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <TextShimmerWave duration={1.2}>Uploading files...</TextShimmerWave>
                </div>
            )}

            {/* File list */}
            {files.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                    {files.map((file, idx) => (
                        <li
                            key={idx}
                            className="flex items-center justify-between truncate"
                        >
                            <span className="flex items-center gap-2 truncate">
                                📄 <span className="truncate">{file.name}</span>
                            </span>
                            <button
                                onClick={() =>
                                    setFiles((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="text-muted-foreground hover:text-destructive transition"
                            >
                                <X size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}