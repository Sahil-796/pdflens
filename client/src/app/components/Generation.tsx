'use client'
import React, { useState } from 'react'
import { generateHTML } from '../api/generateHTML/route'

const Generation = () => {
    const [input, setInput] = useState('')
    const [html, setHtml] = useState("")

    const handleSend = async () => {
        if (!input.trim()) return
        const generated = await generateHTML(input)
        setHtml(generated)
    }

    return (
        <>
            <input
                id='inputMessage'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Enter here joking'
                className='border w-full'
            />
            <button onClick={handleSend}>Generate PDF</button>

            <h1>PDF generated:</h1>
            <div
                className="mx-auto my-4 w-[800px] min-h-[1000px] bg-white p-8 shadow-lg border rounded-md text-black"
                dangerouslySetInnerHTML={{ __html: html }} />
        </>
    )
}

export default Generation