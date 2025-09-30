from fastapi import APIRouter, UploadFile, File, Form, Header
from fastapi.responses import JSONResponse
import logging
logger = logging.getLogger(__name__)
import tempfile
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from app.config import embeddings, INDEX_NAME

router = APIRouter(prefix='/context', tags=["context"])

@router.post('/upload')
async def upload_context(
    secret1: str = Header(...),
    file: UploadFile = File(...),
    userId: str = Form(...),
    pdfId: str = Form(...)
):
    try:
        extension = file.filename.split('.')[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        if extension != "pdf":
            return {"error": "Unsupported file type"}

        loader = PyPDFLoader(tmp_path)
        documents = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(documents)

        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                "pdfId": pdfId,
                "userId": userId,
                "filename": file.filename,
                "chunkId": i
            })

        vectorStore = PineconeVectorStore.from_documents(
            documents=chunks,
            embedding=embeddings,
            index_name=INDEX_NAME
        )

        return {"message": "File uploaded and indexed"}
    
    except Exception as e:
        logger.error(
            f"Error processing request for user {userId}: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})