import tempfile
from fastapi import APIRouter, FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from pdf2docx import Converter
from io import BytesIO
from pathlib import Path
import subprocess
import os
router = APIRouter(
    prefix='/tools',
    tags=["tools"]
)
import logging
logger = logging.getLogger(__name__)



@router.post("/pdf_to_docx")
async def convert_pdf_to_docx(file: UploadFile = File(...)):
    try:

        ext = file.filename.lower().split('.')[-1]
        name = file.filename.rsplit('.', 1)[0]
        if ext != "pdf" or file.content_type != "application/pdf":
            return JSONResponse(status_code=400, content={"message": "Only PDF files are allowed"})
        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})
        file.file.seek(0)

        # Save PDF temporarily
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
            temp_pdf.write(await file.read())
            temp_pdf_path = temp_pdf.name

        # Temporary output DOCX
        with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as temp_docx:
            temp_docx_path = temp_docx.name

        # Convert PDF → DOCX
        cv = Converter(temp_pdf_path)
        cv.convert(temp_docx_path)
        cv.close()

        # Read DOCX bytes
        with open(temp_docx_path, "rb") as f:
            docx_bytes = f.read()

        # Cleanup temp files
        os.remove(temp_pdf_path)
        os.remove(temp_docx_path)

        return StreamingResponse(
            BytesIO(docx_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={name}.docx"}
        )

    except Exception as e:    
        logger.error(
            f"Error converting pdf to docx: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})

@router.post("/docx_to_pdf")
async def convert_docx_to_pdf(file: UploadFile = File(...)):
    try:

        ext = file.filename.lower().split('.')[-1]
        name = file.filename.rsplit('.', 1)[0] 
        if ext not in ["doc", "docx"] or file.content_type not in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
            return JSONResponse(status_code=400, content={"message": "Only DOC/DOCX files are allowed"})
        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})
        file.file.seek(0)


        # Save uploaded DOCX temporarily
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_docx:
            temp_docx.write(await file.read())
            temp_docx_path = Path(temp_docx.name)

        # Output PDF path
        temp_pdf_path = temp_docx_path.with_suffix(".pdf")

        # Convert DOCX → PDF using LibreOffice
        subprocess.run([
            "libreoffice",
            "--headless",
            "--convert-to", "pdf",
            "--outdir", str(temp_pdf_path.parent),
            str(temp_docx_path)
        ], check=True)

        # Read PDF bytes
        with open(temp_pdf_path, "rb") as f:
            pdf_bytes = f.read()

        # Cleanup temp files
        os.remove(temp_docx_path)
        os.remove(temp_pdf_path)

        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name}.pdf"}
        )

    except Exception as e:    
        logger.error(
            f"Error converting doc/docx to pdf: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})

@router.post("/pptx_to_pdf")
async def convert_pptx_to_pdf(file: UploadFile = File(...)):
    try:

        ext = file.filename.lower().split('.')[-1]
        name = file.filename.rsplit('.', 1)[0] 
        if ext not in ["ppt", "pptx"] or file.content_type not in ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.ms-powerpoint"]:
            return JSONResponse(status_code=400, content={"message": "Only PPT/PPTX files are allowed"})
        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})
        file.file.seek(0)


        # Save uploaded PPTX temporarily
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as temp_pptx:
            temp_pptx.write(await file.read())
            temp_pptx_path = Path(temp_pptx.name)

        # Output PDF path
        temp_pdf_path = temp_pptx_path.with_suffix(".pdf")

        # Convert PPTX → PDF using LibreOffice
        subprocess.run([
            "libreoffice",
            "--headless",
            "--convert-to", "pdf",
            "--outdir", str(temp_pdf_path.parent),
            str(temp_pptx_path)
        ], check=True)

        # Read PDF bytes
        with open(temp_pdf_path, "rb") as f:
            pdf_bytes = f.read()

        # Cleanup temp files
        os.remove(temp_pptx_path)
        os.remove(temp_pdf_path)

        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name}.pdf"}
        )

    except Exception as e:    
        logger.error(
            f"Error converting ppt/pptx to pdf: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})