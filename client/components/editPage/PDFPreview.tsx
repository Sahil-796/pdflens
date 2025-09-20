import React from 'react'
import { TextShimmerWave } from '../motion-primitives/text-shimmer-wave'

const PDFPreview = ({ loading, html }: { loading: boolean, html: string }) => {
    return (
        <div className="relative flex-1 bg-card rounded-xl p-6 overflow-auto">
            {loading ? (
                <TextShimmerWave duration={1} className='left-1/2 -translate-x-1/2'>
                    Loading the PDF...
                </TextShimmerWave>
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
                            // target.textContent = "AI generated"
                        }
                    }}
                    className="mx-auto flex-1 w-full overflow-y-scroll rounded-md px-6 pb-6 bg-white text-black"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            )}
        </div>
    )
}

export default PDFPreview