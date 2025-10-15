import tempfile
from fastapi import APIRouter, FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pdf2docx import Converter
from io import BytesIO
from pathlib import Path
import subprocess
import os
router = APIRouter(
    prefix='/tools',
    tags=["tools"]
)

@router.post("/pdf_to_docx")
async def convert_pdf_to_docx(file: UploadFile = File(...)):
    try:
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
            headers={"Content-Disposition": "attachment; filename=converted.docx"}
        )

    except Exception as e:
        return {"error": str(e)}

@router.post("/docx_to_pdf")
async def convert_docx_to_pdf(file: UploadFile = File(...)):
    try:
        # Save uploaded DOCX temporarily
        with tempfile.NamedTemporaryFile(suffix=".docx", delete=False) as temp_docx:
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
            headers={"Content-Disposition": "attachment; filename=converted.pdf"}
        )

    except Exception as e:
        return {"error": str(e)}