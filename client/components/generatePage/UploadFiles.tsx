'use client'
import { useState } from "react"
import { toast } from "sonner"
import { LoaderCircle, Upload, X } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePdfStore } from "@/app/store/usePdfStore"
import Link from "next/link"

interface UploadedFile {
  name: string
}

export default function UploadFiles() {
  const { pdfId, setPdf, fileName } = usePdfStore()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [, setDragActive] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [limitFilesModalOpen, setLimitFilesModalOpen] = useState(false)

  const uploadFile = async (newFile: File) => {
    if (!newFile || loading) return
    if (files.length >= 5) {
      console.log(files.length)
      setLimitFilesModalOpen(true)
      return
    }
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
    if (loading) return
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-medium">Reference Files</label>
        <span className="text-xs text-muted-foreground">{files.length} uploaded</span>
      </div>

      {/* Layout changes dynamically based on file presence */}
      <div className={`flex flex-col sm:flex-row gap-4 transition-all`}>
        {/* Upload Area */}
        <div
          className={`flex-1
                            ${files.length > 0 ? "sm:w-1/2" : "w-full"}
                        `}
        >
          <div
            className={`border-2 border-dashed  rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-200
                                    min-h-[140px] sm:min-h-[180px] flex flex-col items-center justify-center
                                    hover:border-primary hover:bg-primary/5 hover:scale-[1.02] border-border hover:bg-muted/30"
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
              className={`mx-auto mb-2 text-primary transition-transform ${loading ? "animate-bounce" : "group-hover:scale-110"
                }`}
              size={28}
            />
            <p className="text-sm text-primary max-w-[80%] sm:max-w-none mx-auto">
              {loading ? "Uploading..." : "Drop files here or tap to browse"}
            </p>
            <input
              disabled={loading}
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
            />
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="sm:w-1/2 flex flex-col">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
            <div className="flex-1 max-h-[150px] overflow-y-auto pr-1 space-y-1">
              {files.map((fileItem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-sm gap-2"
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
                      <X className="h-4 w-4 cursor-pointer" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {
        <AlertDialog open={limitFilesModalOpen} onOpenChange={setLimitFilesModalOpen}>
          <AlertDialogContent className="bg-gradient-to-br from-card to-background border-border w-[92%] sm:w-[480px] rounded-2xl shadow-xl">
            <AlertDialogHeader className="space-y-2">
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xl">⚠️</span>
                </div>
              </div>
              <AlertDialogTitle className="text-center text-lg font-semibold text-foreground">
                File Upload Limit Reached
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm text-muted-foreground">
                You can upload <span className="font-medium text-foreground">5 files per document</span>.
                Upgrade to <span className="font-medium text-primary">Premium</span> to upload
                <span className="font-medium text-foreground"> 10 files per document</span> and more benefits.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
              <AlertDialogCancel className="border-border w-full sm:w-auto">
                Close
              </AlertDialogCancel>
              <Link href="/pricing" className="w-full sm:w-auto">
                <AlertDialogAction className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition cursor-pointer">
                  View Pricing
                </AlertDialogAction>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </div >
  )
}
