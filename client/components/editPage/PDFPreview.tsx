import React from 'react'

const PDFPreview = ({loading, html}: {loading: boolean, html: string}) => {
    return (
        <div className="flex-1 flex flex-col bg-card rounded-xl p-6 overflow-auto border border-border">
            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    ⏳ Generating...
                </div>
            ) : (
                <div
                    onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (target.id) {
                            console.log("Clicked ID:", target.id)
                            console.log(target.innerText)

                            document.querySelectorAll(".selected").forEach(el => {
                                el.classList.remove("selected")
                            })
                            target.classList.add("selected")
                            target.textContent = "AI generated"
                        }
                    }}
                    className="mx-auto flex-1 w-full overflow-y-scroll border border-border rounded-md p-6 bg-white text-black"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            )}
        </div>
    )
}

export default PDFPreview