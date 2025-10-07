from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.routes import ai_router, edit_router, remove_router, upload_router, edit_pdf_router, pdf_to_docx_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def base():
    return {"message": "Hello developer!"}

app.include_router(ai_router)
app.include_router(edit_router)
app.include_router(remove_router)
app.include_router(upload_router)
app.include_router(edit_pdf_router)
app.include_router(pdf_to_docx_router)