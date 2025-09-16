import {NextResponse} from 'next/server'
import {createPdf} from '@/db/pdfs'
import {createContextFile, addContextFile} from '@/db/context'
//api to crarte pdfs call on 1st context upload or generate button hit

export async function Post(req: Request){

    const {id, userId, pdfName, html} = await req.json()
    const html_content = html ?? ""
    createPdf(id, userId, pdfName, html_content)
    
}