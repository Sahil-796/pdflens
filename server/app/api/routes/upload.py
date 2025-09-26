import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form
from dotenv import load_dotenv
from app.config import embeddings, INDEX_NAME

from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# schema for metadata 
                # "pdfId": 
                # "userId": 
                # "filename": 
                # "chunkId": 

load_dotenv()
router = APIRouter(
    prefix='/context',
    tags=["context"]
)



@router.post('/upload')
async def upload_context(file: UploadFile = File(...), userId: str = Form(...), pdfId: str = Form(...)):

    try:
        extension = file.filename.split('.')[-1].lower()
        

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        if extension == 'pdf':
            loader = PyPDFLoader(tmp_path)
        else:
            return {"error":"Unsupported file type"}
        
        
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap=50)
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

        
        return {
            "message": "File uploaded and indexed",
        }
    
    except Exception as e:
        return f"Error at upload context : {e}"
