import logging
from tempfile import TemporaryDirectory
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from pdf2docx import Converter
from io import BytesIO
from pathlib import Path
import fitz
import subprocess
import logging
import re

router = APIRouter(prefix="/tools", tags=["tools"])
logger = logging.getLogger(__name__)

# regex for sanitizing filenames
def safe_filename(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_-]", "_", name.strip().replace(" ", "_"))



@router.post("/pdf_to_docx")
async def convert_pdf_to_docx(file: UploadFile = File(...)):
    try:
        ext = file.filename.lower().split('.')[-1]
        name = safe_filename(file.filename.rsplit('.', 1)[0])

        if ext != "pdf" or file.content_type != "application/pdf":
            return JSONResponse(status_code=400, content={"message": "Only PDF files are allowed"})

        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})

        with TemporaryDirectory() as td:
            temp_pdf_path = Path(td) / f"{name}.pdf"
            temp_docx_path = Path(td) / f"{name}.docx"
            temp_pdf_path.write_bytes(contents)

            cv = Converter(str(temp_pdf_path))
            try:
                cv.convert(str(temp_docx_path))
            finally:
                cv.close()

            docx_bytes = temp_docx_path.read_bytes()

        return StreamingResponse(
            BytesIO(docx_bytes),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={name}.docx"}
        )

    except Exception as e:
        logger.error(f"Error converting PDF to DOCX: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})


@router.post("/docx_to_pdf")
async def convert_docx_to_pdf(file: UploadFile = File(...)):
    try:
        ext = file.filename.lower().split('.')[-1]
        name = safe_filename(file.filename.rsplit('.', 1)[0])

        if ext not in ["doc", "docx"]:
            return JSONResponse(status_code=400, content={"message": "Only DOC/DOCX files are allowed"})

        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})

        with TemporaryDirectory() as td:
            temp_docx_path = Path(td) / f"{name}.{ext}"
            temp_pdf_path = Path(td) / f"{name}.pdf"

            temp_docx_path.write_bytes(contents)

            subprocess.run([
                "libreoffice", "--headless",
                "--convert-to", "pdf",
                "--outdir", str(temp_pdf_path.parent),
                str(temp_docx_path)
            ], check=True)

            if not temp_pdf_path.exists():
                raise FileNotFoundError(f"Conversion failed, PDF not found at {temp_pdf_path}")

            pdf_bytes = temp_pdf_path.read_bytes()

        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name}.pdf"}
        )

    except Exception as e:
        logger.error(f"Error converting DOC/DOCX to PDF: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})


@router.post("/pptx_to_pdf")
async def convert_pptx_to_pdf(file: UploadFile = File(...)):
    try:
        ext = file.filename.lower().split('.')[-1]
        name = safe_filename(file.filename.rsplit('.', 1)[0])

        if ext not in ["ppt", "pptx"]:
            return JSONResponse(status_code=400, content={"message": "Only PPT/PPTX files are allowed"})

        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})

        with TemporaryDirectory() as td:
            temp_pptx_path = Path(td) / f"{name}.{ext}"
            temp_pdf_path = Path(td) / f"{name}.pdf"
            temp_pptx_path.write_bytes(contents)

            subprocess.run([
                "libreoffice", "--headless",
                "--convert-to", "pdf",
                "--outdir", str(temp_pdf_path.parent),
                str(temp_pptx_path)
            ], check=True)

            if not temp_pdf_path.exists():
                raise FileNotFoundError(f"Conversion failed, PDF not found at {temp_pdf_path}")

            pdf_bytes = temp_pdf_path.read_bytes()

        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name}.pdf"}
        )

    except Exception as e:
        logger.error(f"Error converting PPT/PPTX to PDF: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})


@router.post("/merge_pdfs")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    try:
        if len(files) < 2:
            return JSONResponse(status_code=400, content={"message": "At least two PDFs required"})

        merged_pdf = fitz.open()
        with TemporaryDirectory() as td:
            for i, f in enumerate(files):
                if not f.filename.lower().endswith(".pdf"):
                    return JSONResponse(status_code=400, content={"message": f"{f.filename} is not a PDF"})
                contents = await f.read()
                temp_path = Path(td) / f"file_{i}.pdf"
                temp_path.write_bytes(contents)
                doc = fitz.open(temp_path)
                merged_pdf.insert_pdf(doc)
                doc.close()

            merged_path = Path(td) / "merged.pdf"
            merged_pdf.save(merged_path)
            merged_pdf.close()

            pdf_bytes = merged_path.read_bytes()

        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged.pdf"}
        )

    except Exception as e:
        logger.error(f"Error merging PDFs: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})


@router.post("/split_pdf_by_range")
async def split_pdf_by_range(file: UploadFile = File(...), ranges: str = Form(...)):
    """
    Split PDF into separate files based on ranges.
    Example: ranges="1-3,4-6"
    Returns ZIP if multiple ranges, else a single PDF.
    """
    try:
        if not file.filename.lower().endswith(".pdf"):
            return JSONResponse(status_code=400, content={"message": "Only PDF files are allowed"})

        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})

        name = safe_filename(file.filename.rsplit('.', 1)[0])
        with TemporaryDirectory() as td:
            pdf_path = Path(td) / f"{name}.pdf"
            pdf_path.write_bytes(contents)
            doc = fitz.open(pdf_path)
            total_pages = len(doc)
            output_files = []

            for idx, r in enumerate(ranges.split(","), 1):
                try:
                    start, end = map(int, r.split("-"))
                except:
                    return JSONResponse(status_code=400, content={"message": f"Invalid range format: {r}"})
                if start < 1 or end > total_pages or start > end:
                    return JSONResponse(status_code=400, content={"message": f"Invalid range: {r}"})

                new_pdf = fitz.open()
                new_pdf.insert_pdf(doc, from_page=start - 1, to_page=end - 1)
                out_path = Path(td) / f"split_{idx}.pdf"
                new_pdf.save(out_path)
                new_pdf.close()
                output_files.append(out_path)

            doc.close()

            if len(output_files) > 1:
                zip_path = Path(td) / "split_results.zip"
                subprocess.run(["zip", "-j", zip_path, *output_files], check=True)
                return StreamingResponse(
                    BytesIO(zip_path.read_bytes()),
                    media_type="application/zip",
                    headers={
                        "Content-Disposition": "attachment; filename=split_results.zip"}
                )

            return StreamingResponse(
                BytesIO(output_files[0].read_bytes()),
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={name}_split.pdf"}
            )

    except Exception as e:
        logger.error(f"Error splitting PDF by range: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})


@router.post("/split_pdf_by_pages")
async def split_pdf_by_pages(
    file: UploadFile = File(...),
    exclude: str | None = Form(None)
):
    """
    Exclude specific pages from a PDF.
    Example: exclude="2,4,6"
    """
    try:
        if not file.filename.lower().endswith(".pdf"):
            return JSONResponse(status_code=400, content={"message": "Only PDF files are allowed"})
        if not exclude:
            return JSONResponse(status_code=400, content={"message": "Provide exclude parameter"})

        contents = await file.read()
        if not contents:
            return JSONResponse(status_code=400, content={"message": "Uploaded file is empty"})

        name = safe_filename(file.filename.rsplit('.', 1)[0])
        with TemporaryDirectory() as td:
            pdf_path = Path(td) / f"{name}.pdf"
            pdf_path.write_bytes(contents)
            doc = fitz.open(pdf_path)
            total_pages = len(doc)

            selected_pages = set(range(1, total_pages + 1))
            excluded = set(int(p.strip()) for p in exclude.split(",") if p.strip().isdigit())
            selected_pages -= excluded

            new_pdf = fitz.open()
            for p in sorted(selected_pages):
                new_pdf.insert_pdf(doc, from_page=p - 1, to_page=p - 1)

            out_path = Path(td) / "filtered.pdf"
            new_pdf.save(out_path)
            new_pdf.close()
            doc.close()

            return StreamingResponse(
                BytesIO(out_path.read_bytes()),
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={name}_filtered.pdf"}
            )

    except Exception as e:
        logger.error(f"Error splitting PDF by pages: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"message": str(e)})
