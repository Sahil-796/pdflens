import os
from fastapi import APIRouter, UploadFile, File, Form, Header
from fastapi.responses import JSONResponse
import logging
logger = logging.getLogger(__name__)
import tempfile
from langchain_pinecone import PineconeVectorStore

from app.config import cfEmbeddings, INDEX_NAME

import fitz  # this is  PyMuPDF
from langchain.text_splitter import MarkdownHeaderTextSplitter 

# from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter



router = APIRouter(prefix='/context', tags=["context"])


@router.post('/upload')
async def upload_context(
    secret1: str = Header(...),
    file: UploadFile = File(...),
    userId: str = Form(...),
    pdfId: str = Form(...)
):
    try:      

        await process_and_index_pdf(file, pdfId, userId)

        return {"message": "File uploaded and indexed"}
    
    except Exception as e:
        logger.error(
            f"Error processing request for user {userId}: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})
    

    # PDF TO MD FUNCTION. It uses PYMUPDF. 

async def process_and_index_pdf(file: UploadFile, pdfId: str, userId: str):
    """
     A function to do the heavy lifting i.e split/chunk and index pdf by converting it to markdown.
     did this to ensure formatting consistency as much as possible. 

    """
    try:
        logger.info(f"Starting background processing for PDF: {pdfId}")

        extension = file.filename.split('.')[-1].lower()

        if extension != "pdf":
            return {"error": "Unsupported file type"}

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name
        
        # PDF to Markdown
        doc = fitz.open(tmp_path)
        markdown_text = ""
        for page in doc:
            markdown_text += page.get_text("markdown")
        doc.close()

        # chunk the markdown 
        # This splitter is aware of Markdown headers and creates structured chunks.
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]
        
        splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        md_chunks = splitter.split_text(markdown_text) 

        chunk_size = 250
        chunk_overlap = 30
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )

        final_chunks = []
        for chunk in md_chunks: 
            if len(chunk) > chunk_size:
                sub_chunks = text_splitter.split_documents([chunk])
                final_chunks.extend(sub_chunks)
            else:
                final_chunks.append(chunk)

        # langchain metadata updates
        for i, chunk in enumerate(final_chunks):
            chunk.metadata.update({
                "pdfId": pdfId,
                "userId": userId,
                "filename": file.filename,
                "chunkId": i
            })

        PineconeVectorStore.from_documents(
            documents=final_chunks,
            embedding=embeddings,
            index_name=INDEX_NAME
        )
        logger.info(f"Successfully indexed PDF via Markdown: {pdfId}")

    except Exception as e:
        logger.error(f"Background task failed for pdfId {pdfId}: {str(e)}", exc_info=True)
    finally:
        # Clean up the temporary file
        os.unlink(tmp_path)
