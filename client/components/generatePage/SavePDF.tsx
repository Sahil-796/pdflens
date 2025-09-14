import React from 'react'
import { v4 as uuidv4 } from 'uuid';

const SavePDF = ({html, pdfName}: {html:string, pdfName: string}) => {
    const handleSave = () => {
        alert(`Saved "${pdfName}"! (mock action)`)
    }
    return (
        <button
            onClick={handleSave}
            className="bg-accent text-accent-foreground rounded-md py-2 px-4 hover:bg-accent/90 transition cursor-pointer"
        >
            Save
        </button>
    )
}

export default SavePDF