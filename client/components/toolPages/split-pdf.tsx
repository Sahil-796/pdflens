'use client'

import React, { useState } from 'react'
import { Upload, X, Download, ArrowLeftCircle, CheckCircle2, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { toast } from 'sonner'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null)
  const [splitPagesString, setSplitPagesString] = useState("")
  const [splitRangeString, setSplitRangeString] = useState("")
  const [errors, setErrors] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null)

  const handleInvalidFileType = () => toast.info("Invalid File Type")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.pdf') && !selected.name.toLowerCase().endsWith('.pdf')) {
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
      if (!droppedFile.name.toLowerCase().endsWith('.pdf') && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
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

  const handlePagesConvert = async () => {
    if (!file) {
      toast.info("No File Selected")
      return
    }

    setIsConverting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('exclude', splitPagesString)

      const res = await fetch(`/api/tools/split-pages`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to split PDF")

      const blob = await res.blob()
      setConvertedBlob(blob)
      setSuccess(true)
      setSplitPagesString("")
      setSplitRangeString("")

      // Auto-download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      toast.error('Conversion Failed')
    } finally {
      setIsConverting(false)
    }
  }


  const handleRangeConvert = async () => {
    if (!file) {
      toast.info("No File Selected")
      return
    }

    if (!splitRangeString.trim()) {
      toast.info("Enter a range like 1-3,4-6")
      return
    }

    setIsConverting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("ranges", splitRangeString)
      const shouldZip = splitRangeString.split(",").length > 1

      const res = await fetch(`/api/tools/split-range`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to split PDF")

      const blob = await res.blob()
      setConvertedBlob(blob)
      setSuccess(true)
      setSplitPagesString("")
      setSplitRangeString("")

      const zipName = file.name.split(" ").join("_").replace(".pdf", `${shouldZip ? ".zip" : ".pdf"}`)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = zipName
      a.click()
      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error(err)
      toast.error("Conversion Failed")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!convertedBlob) return
    const url = window.URL.createObjectURL(convertedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = file?.name
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 items-center justify-center h-full px-4 py-6">

      <Tabs defaultValue="pages">
        <TabsList className='w-full mx-auto'>
          <TabsTrigger value="pages" disabled={!!file}>Exclude Pages</TabsTrigger>
          <TabsTrigger value="range" disabled={!!file}>Range</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">
          {success ? (
            <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-md space-y-6">
              {/* Success Message */}
              <div className="flex flex-col sm:flex-row items-center gap-2 text-orange-300 font-medium text-center sm:text-left text-lg sm:text-xl">
                <CheckCircle2 className="size-5 sm:size-6" />
                <span>Your PDF file has been converted splitted!</span>
              </div>

              {/* PanelLeftOpen Icon */}
              <div className="flex flex-col items-center space-y-2">
                <PanelLeftOpen size={48} className="text-orange-300" />
                <div>
                  <p className="font-semibold text-lg sm:text-xl text-foreground text-center">
                    {file?.name.replace('.pdf', '.zip')}
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
                  className="flex items-center gap-2 px-6 text-base sm:text-lg w-full sm:w-auto justify-center bg-gradient-to-br from-orange-300 to-orange-200 cursor-pointer"
                >
                  <Download className="size-5" /> Download
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-sm">
              {!file ? (
                <div className="flex w-full flex-col gap-6">
                  <div
                    className={`border-2 border-dashed rounded-xl w-full py-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${dragActive
                      ? 'border-orange-300 bg-orange-100 scale-[1.02]'
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
                    <Upload className="text-orange-300 mb-3" size={40} />
                    <p className="text-sm sm:text-base text-orange-300 text-center">
                      Drop your PDF file here or click to upload<br />to split by pages
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
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-5 w-full">
                  <PanelLeftOpen size={44} className="text-orange-300" />
                  <div>
                    <p className="text-lg sm:text-xl font-medium text-foreground">{file.name}</p>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {isConverting ? (
                    <Empty className="w-full">
                      <EmptyHeader>
                        <EmptyMedia variant="icon" className="text-orange-300">
                          <Spinner />
                        </EmptyMedia>
                        <EmptyTitle className="text-orange-300 text-lg sm:text-xl">Splitting PDF</EmptyTitle>
                        <EmptyDescription className="text-sm sm:text-base">
                          Please wait while PDF is being splitted. Do not refresh the page.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div className=' flex flex-col gap-4'>
                      <Label htmlFor='exclude-pages'>Enter pages to exclude (comman separated)</Label>
                      <Input type='text' name='exclude-pages' placeholder='1,4,6,...' className='-mt-2'
                        value={splitPagesString} onChange={(e) => {
                          const value = e.target.value
                          const valid = /^[0-9,]*$/.test(value);
                          if (!valid) {
                            setErrors("Don't include extra characters.")
                          } else {
                            setErrors("")
                            setSplitPagesString(value)
                          }
                        }} />
                      {
                        errors && <div className='text-destructive text-sm'> {errors}</div>
                      }
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
                          onClick={handlePagesConvert}
                          disabled={isConverting}
                          className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gradient-to-br from-orange-300 to-orange-200 cursor-pointer"
                          size="lg"
                        >
                          <PanelLeftOpen size={16} /> Split PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
          }
        </TabsContent>
        <TabsContent value="range">
          {success ? (
            <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-md space-y-6">
              {/* Success Message */}
              <div className="flex flex-col sm:flex-row items-center gap-2 text-orange-300 font-medium text-center sm:text-left text-lg sm:text-xl">
                <CheckCircle2 className="size-5 sm:size-6" />
                <span>Your PDF file has been converted splitted!</span>
              </div>

              {/* PanelLeftOpen Icon */}
              <div className="flex flex-col items-center space-y-2">
                <PanelLeftOpen size={48} className="text-orange-300" />
                <div>
                  <p className="font-semibold text-lg sm:text-xl text-foreground text-center">
                    {file?.name.replace('.pdf', '.zip')}
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
                  className="flex items-center gap-2 px-6 text-base sm:text-lg w-full sm:w-auto justify-center bg-gradient-to-br from-orange-300 to-orange-200 cursor-pointer"
                >
                  <Download className="size-5" /> Download
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl border-border bg-background p-6 sm:p-8 flex flex-col items-center justify-center rounded-2xl shadow-sm">
              {!file ? (
                <div className="flex w-full flex-col gap-6">
                  <div
                    className={`border-2 border-dashed rounded-xl w-full py-16 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${dragActive
                      ? 'border-orange-300 bg-orange-100 scale-[1.02]'
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
                    <Upload className="text-orange-300 mb-3" size={40} />
                    <p className="text-sm sm:text-base text-orange-300 text-center">
                      Drop your PDF file here or click to upload <br /> to split by range
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
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-5 w-full">
                  <PanelLeftOpen size={44} className="text-orange-300" />
                  <div>
                    <p className="text-lg sm:text-xl font-medium text-foreground">{file.name}</p>
                    <p className="text-base sm:text-lg text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  {isConverting ? (
                    <Empty className="w-full">
                      <EmptyHeader>
                        <EmptyMedia variant="icon" className="text-orange-300">
                          <Spinner />
                        </EmptyMedia>
                        <EmptyTitle className="text-orange-300 text-lg sm:text-xl">Splitting PDF</EmptyTitle>
                        <EmptyDescription className="text-sm sm:text-base">
                          Please wait while PDF is being splitted. Do not refresh the page.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div className=' flex flex-col gap-4'>
                      <Label htmlFor='include-range'>Enter range of pages to include (comman separated)</Label>
                      <Input type='text' name='include-range' placeholder='1-4,5-7,...' className='-mt-2'
                        value={splitRangeString} onChange={(e) => {
                          const value = e.target.value
                          const valid = /^[0-9,\-]*$/.test(value);
                          if (!valid) {
                            setErrors("Don't include extra characters.")
                          } else {
                            setErrors("")
                            setSplitRangeString(value)
                            console.log(splitRangeString)
                          }
                        }} />
                      {
                        errors && <div className='text-destructive text-sm'> {errors}</div>
                      }
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
                          onClick={handleRangeConvert}
                          disabled={isConverting}
                          className="flex items-center gap-2 w-full sm:w-auto justify-center bg-gradient-to-br from-orange-300 to-orange-200 cursor-pointer"
                          size="lg"
                        >
                          <PanelLeftOpen size={16} /> Split PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
          }
        </TabsContent>
      </Tabs>
    </div >
  )
}

export default SplitPDF
