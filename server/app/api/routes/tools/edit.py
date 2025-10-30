import os
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response
import logging
import tempfile
import pymupdf4llm

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tools", tags=["tools"])


@router.post('/pdf-to-md')
async def edit_tool(file: UploadFile = File(...)):
    contents = await file.read()

    # Save temp file
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp_path = tmp_file.name
    tmp_file.write(contents)
    tmp_file.close()

    try:
        # Process PDF and index
        md_text = pymupdf4llm.to_markdown(tmp_path)
        return Response(content=md_text, media_type="text/markdown")

    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        return Response(content=str(e), status_code=500, media_type="text/plain")
    finally:
        # Ensure temp file is deleted
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
