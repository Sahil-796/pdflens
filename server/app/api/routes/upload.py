import os
import re
import tempfile
import logging
from fastapi import APIRouter, UploadFile, File, Form, Header
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

import pymupdf4llm  # PDF → Markdown
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import cfEmbeddings, INDEX_NAME

logger = logging.getLogger(__name__)
load_dotenv()

router = APIRouter(prefix='/context', tags=["context"])


@router.post('/upload')
async def upload_context(
    secret1: str = Header(...),
    file: UploadFile = File(...),
    userId: str = Form(...),
    pdfId: str = Form(...)
):
    tmp_path = None 
    try:
        contents = await file.read()
        filename = file.filename
        
        if not filename or not isinstance(filename, str):
            return JSONResponse(status_code=400, content={"message": "Missing filename"})

        if not filename.endswith(".pdf") or not contents.startswith(b"%PDF"):
            return JSONResponse(status_code=400, content={"message": "Invalid PDF file"})

        tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        tmp_path = tmp_file.name
        tmp_file.write(contents)
        tmp_file.close()

        # Process + index
        process_and_index_pdf(tmp_path, filename, pdfId, userId)

        return JSONResponse(content={"message": "Context PDF uploaded successfully"})

    except Exception as e:
        logger.error(f"Error processing PDF {pdfId}: {str(e)}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                logger.exception("Failed to remove temp file %s", tmp_path)


def process_and_index_pdf(tmp_path: str, filename: str, pdfId: str, userId: str):

    try:
        logger.info(f"Processing PDF {pdfId}")

        md_text = pymupdf4llm.to_markdown(tmp_path)

        
        md_text = clean_markdown(md_text)

        try:
            index = PineconeVectorStore.from_existing_index(
                INDEX_NAME, embedding=cfEmbeddings
            )
            index.delete(filter={"pdfId": pdfId, "userId": userId})
        except Exception:
            pass  # (first upload case)

        # smart chunking
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=600,
            chunk_overlap=80,
            separators=["\n## ", "\n### ", "\n", " ", ""]
        )

        docs = splitter.create_documents([md_text])


        for i, doc in enumerate(docs):
            doc.metadata = {
                "pdfId": pdfId,
                "userId": userId,
                "filename": filename,
                "chunkId": i,
            }

        PineconeVectorStore.from_documents(
            documents=docs,
            embedding=cfEmbeddings,
            index_name=INDEX_NAME
        )

        logger.info(f"Successfully indexed PDF {pdfId}")

    except Exception as e:
        logger.error(f"PDF processing failed {pdfId}: {str(e)}", exc_info=True)
        raise e

def clean_markdown(md: str) -> str:

    md = md.replace("\x00", "")

    # Remove common page headers/footers
    md = re.sub(r"Page\s+\d+\s+of\s+\d+", "", md, flags=re.IGNORECASE)
    md = re.sub(r"^\s*\d+\s*$", "", md, flags=re.MULTILINE)

    # Remove repeated blank lines
    md = re.sub(r"\n{3,}", "\n\n", md)

    return md.strip()