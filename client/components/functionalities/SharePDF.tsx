import React from 'react'

const SharePDF = () => {
    const handleShare = () => {
        // const shareLink = `${window.location.origin}/pdf/${encodeURIComponent(pdfName)}`
        // navigator.clipboard.writeText(shareLink)
        // alert("Share link copied to clipboard!")
    }
    return (
        <button
            onClick={handleShare}
            className="bg-muted text-muted-foreground rounded-md py-2 px-4 hover:bg-muted/90 transition cursor-pointer"
        >
            Share
        </button>
    )
}

export default SharePDF