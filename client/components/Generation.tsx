'use client'
import React, { useState } from 'react'

const Generation = () => {
  const [input, setInput] = useState('')
  const [html, setHtml] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handleSend = async () => {
    if (!input.trim()) return

    console.log("in handleSend")
    try {
      const res = await fetch("/api/generateHTML", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "shail7", // get from auth/session ideally
          user_prompt: input,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to generate HTML")
      }

      const data = await res.json()
      console.log("Generated:", data)

      // If your Python API returns { html: "<p>…</p>" }
      setHtml(data ?? "setHTML not happening")
    } catch (err) {
      console.error("Error in handleSend:", err)
      setHtml("Error occurred while generating HTML")
    }
    console.log("completed")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setFiles(Array.from(e.target.files))
  }

  return (
    <div className="flex p-6 pt-22 text-foreground gap-6 bg-background h-screen">
      {/* Left Side: Inputs */}
      <div className="w-1/3 bg-card p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-border">
        <h2 className="text-xl font-semibold">Generate PDF</h2>

        <textarea
          id="inputMessage"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here..."
          className="bg-muted border border-border rounded-md p-3 w-full h-40 resize-none 
                     focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
        />

        <button
          onClick={handleSend}
          className="bg-primary text-primary-foreground rounded-md py-2 px-4 hover:bg-primary/90 transition cursor-pointer"
        >
          Generate
        </button>

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
      <div className="preview flex-1 flex flex-col bg-card rounded-xl shadow-lg p-6 overflow-auto border border-border">
        <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
        <div
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.id) {
              console.log("Clicked ID:", target.id)

              // remove old highlights
              document.querySelectorAll(".selected").forEach(el => {
                el.classList.remove("selected")
              })

              // add new highlight
              target.classList.add("selected")
            }
          }}
          className="mx-auto flex-1 w-full overflow-y-scroll border border-border rounded-md p-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}

export default Generation