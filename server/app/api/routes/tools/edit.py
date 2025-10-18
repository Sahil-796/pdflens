import os
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import fitz
import logging
import tempfile

from langchain_text_splitters import MarkdownTextSplitter
import pymupdf4llm

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tools", tags=["tools"])


@router.post('/pdf-to-md')
async def edit_tool(
    file: UploadFile = File(...),
):

    contents = await file.read()

    # Save temp file
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp_path = tmp_file.name
    tmp_file.write(contents)
    tmp_file.close()

    try:
        # Process PDF and index
        md_text = pymupdf4llm.to_markdown(tmp_path)
        return JSONResponse(status_code=200,
                            content={"message": "Pdf Converted to Md",
                                     "Md content": md_text
                                     })

    except Exception as e:
        logger.error(
            f"Error processing PDF in edit-tool: {str(e)}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})
    finally:
        # Ensure temp file is deleted
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
