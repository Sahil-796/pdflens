'use client'
import React, { useState } from 'react'
import DownloadPDF from './generatePage/DownloadPDF'
import SavePDF from './generatePage/SavePDF'
import PDFPreview from './generatePage/PDFPreview'
import {createPdfPending} from '../db/pdfs'
import { createContextFile, addContextFile } from '../db/context'
import { v4 as uuidv4 } from 'uuid'


const Generate = () => {
  const [input, setInput] = useState('')
  const [html, setHtml] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [pdfName, setPdfName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/generateHTML", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 'sahil7',
          user_prompt: input,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate HTML")
      }

      const data = await res.json()
      setHtml(data ?? "<p>Failed to generate HTML</p>")
    } catch (err) {
      console.error("Error in handleSend:", err)
      setHtml("<p>Error occurred while generating HTML</p>")
    } finally {
      setLoading(false)
    }
  }


// handles uploading files to py server on change
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // if (!e.target.files || e.target.files.length === 0) return;

  // const file = e.target.files[0]; // only one file per selection

  // try {
  //   let newPdf = null
  //   if (files.length === 0) {
  //       const id = uuidv4()
  //       newPdf = await createPdfPending(id, userId, pdfName)  
  //   }
  //   // 1. Upload to Python server
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("userId", userId); // replace with your current user
  //   formData.append("pdfId", pdfId);   // replace with your current PDF

  //   const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_URL}/upload`, {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (!res.ok) {
  //     console.error("Upload failed for", file.name);
  //     return;
  //   }

  //   // 2. Update SQL context row
  //   if (files.length === 0) {
  //     await createContextFile(pdfId, userId, file.name); // first file → create row
  //   } else {
  //     await addContextFile(pdfId, userId, file.name);    // subsequent files → append
  //   }

  //   // 3. Update UI state
  //   setFiles((prev) => [...prev, file]);
  // } catch (err) {
  //   console.error("Error uploading file:", file.name, err);
  // }

  // // 4. Reset the input so user can select the same file again if needed
  // e.target.value = "";
};


  return (
    <div className="flex p-4 text-foreground gap-6 bg-background h-full">
      {/* Left Side: Inputs */}
      <div className="w-1/3 bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border">
        <h2 className="text-xl font-semibold">Generate PDF</h2>

        {/* PDF Name */}
        <input
          type="text"
          value={pdfName}
          onChange={(e) => setPdfName(e.target.value)}
          placeholder="Enter PDF name"
          className="bg-muted border border-border rounded-md p-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Prompt */}
        <textarea
          id="inputMessage"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here..."
          className="bg-muted border border-border rounded-md p-3 w-full h-40 resize-none 
                     focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
        />

        {/* Actions */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <div className="flex gap-2">

          <DownloadPDF html={html} pdfName={pdfName} />

          <SavePDF html={html} pdfName={pdfName} />

        </div>

        {/* File Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-muted file:text-foreground
                       hover:file:bg-accent
                       cursor-pointer"
          />
          {files.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {files.map((file, idx) => (
                <li key={idx} className="truncate">📄 {file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Side: Output */}
      <PDFPreview loading={loading} html={html} />
    </div>
  )
}

export default Generate