'use client'
import { useState } from "react"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"
import { usePdfStore } from "@/app/store/usePdfStore"
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-wave"

interface UploadedFile {
    name: string
}

export default function UploadFiles() {
    const { pdfId, setPdf, fileName, isContext } = usePdfStore()
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const uploadFile = async (newFile: File) => {
        if (!newFile || loading) return
        setLoading(true)

        let createdPdfId: string | null = null

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
                createdPdfId = currentPdfId
                setPdf({ pdfId: currentPdfId })
            }

            if (!currentPdfId) throw new Error("PDF ID is missing")

            // Decide API: addContext for first file, updateContext for subsequent files
            const apiEndpoint = files.length === 0 ? "/api/addContext" : "/api/updateContext"

            const formData = new FormData()
            formData.append("file", newFile, newFile.name)
            formData.append("pdfId", currentPdfId)

            const res = await fetch(apiEndpoint, { method: "POST", body: formData })
            if (!res.ok) {
                const errText = await res.text()
                console.error("Upload failed:", errText)

                // If we created a new PDF but addContext failed, delete that PDF
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
        <div className="w-full">
            <label className="block font-medium mb-2">Upload Files</label>

            <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition 
          ${dragActive ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:bg-muted/50"}
          ${loading ? "opacity-50 cursor-wait" : ""}`} // disable interaction
                onDragOver={(e) => { if (!loading) { e.preventDefault(); setDragActive(true) } }}
                onDragLeave={() => { if (!loading) setDragActive(false) }}
                onDrop={handleDrop}
                onClick={() => { if (!loading) document.getElementById("fileInput")?.click() }}
            >
                <Upload className="mx-auto mb-2 text-muted-foreground" size={28} />
                <p className="text-sm text-muted-foreground">
                    Drag & drop a file here, or <span className="text-primary font-medium">browse</span>
                </p>
                <input
                    disabled={loading}
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
                />
            </div>

            {loading && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <TextShimmerWave duration={1.2}>Uploading file...</TextShimmerWave>
                </div>
            )}

            {files.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground border rounded-md p-2 bg-muted/30">
                    {files.map((fileItem, idx) => (
                        <li key={idx} className="flex items-center justify-between truncate">
                            <span className="flex items-center gap-2 truncate">📄 <span className="truncate">{fileItem.name}</span></span>
                            <button
                                onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
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