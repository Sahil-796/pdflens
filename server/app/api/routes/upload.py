import os
import tempfile
import logging
from fastapi import APIRouter, UploadFile, File, Form, Header
from fastapi.responses import JSONResponse
from langchain_text_splitters import MarkdownTextSplitter
from langchain_pinecone import PineconeVectorStore
from app.config import cfEmbeddings, INDEX_NAME
import pymupdf4llm  # for PDF → Markdown conversion

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/context', tags=["context"])

@router.post('/upload')
async def upload_context(
    secret1: str = Header(...),
    file: UploadFile = File(...),
    userId: str = Form(...),
    pdfId: str = Form(...),
):

    contents = await file.read()
    filename = file.filename
    if not filename.endswith(".pdf") and file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"message": "Only PDF files are allowed"})
    if not contents.startswith(b"%PDF"):
        return JSONResponse(status_code=400, content={"message": "Uploaded file is not a valid PDF"})


    tmp_path = None
    try:
        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp_path = tmp_file.name
        tmp_file.write(contents)
        tmp_file.close()

        # Process PDF and index
        process_and_index_pdf(tmp_path, file.filename, pdfId, userId)
        return JSONResponse(content={"message": "Context Pdf uploaded"})

    except Exception as e:
        logger.error(f"Error processing PDF {pdfId}: {str(e)}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                logger.exception("Failed to remove temp file %s", tmp_path)


def process_and_index_pdf(tmp_path, filename: str, pdfId: str, userId: str):
    """
    Converts PDF → Markdown → chunks → Pinecone indexing.
    """
    try:
        logger.info(f"Starting processing for PDF: {pdfId}")

        # PDF → Markdown
        md_text = pymupdf4llm.to_markdown(tmp_path)

        # Split Markdown into manageable chunks
        chunk_size = 250
        chunk_overlap = 30
        splitter = MarkdownTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        docs = splitter.create_documents([md_text])

        # Add metadata
        for i, doc in enumerate(docs):
            doc.metadata.update({
                "pdfId": pdfId,
                "userId": userId,
                "filename": filename,
                "chunkId": i
            })

        # Index in Pinecone
        PineconeVectorStore.from_documents(
            documents=docs,
            embedding=cfEmbeddings,
            index_name=INDEX_NAME
        )

        logger.info(f"Successfully indexed PDF: {pdfId}")

    except Exception as e:
        logger.error(f"Failed processing PDF {pdfId}: {str(e)}", exc_info=True)
        raise e
