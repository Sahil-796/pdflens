import tempfile
from fastapi import APIRouter, FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from pdf2docx import Converter

router = APIRouter(
    prefix='/tools',
    tags=["tools"]
)

@router.post("/pdf_to_docx")
async def convert_pdf_to_docx(file: UploadFile = File(...)):
    # Save PDF temporarily
    with tempfile.NamedTemporaryFile(suffix=".pdf") as temp_pdf:
        temp_pdf.write(await file.read())
        temp_pdf.flush()  # make sure all bytes are written

        # Temporary output DOCX file
        with tempfile.NamedTemporaryFile(suffix=".docx") as temp_docx:
            cv = Converter(temp_pdf.name)
            cv.convert(temp_docx.name)
            cv.close()

            # Read DOCX bytes
            temp_docx.seek(0)
            docx_bytes = temp_docx.read()

    # Send as streaming response
    from io import BytesIO
    return StreamingResponse(
        BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=converted.docx"}
    )
