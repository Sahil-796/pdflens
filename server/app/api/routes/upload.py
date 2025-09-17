import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form
from dotenv import load_dotenv
from server.app.config import embeddings, INDEX_NAME

from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

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
            "message": "File uplaoded and indexed",
        }
    
    except Exception as e:
        return f"Error at upload context : {e}"

# @router.post('/add-text')
# async def add_text_context(text: str = Form(...), title: str = Form(...), userId: str = Form(...)):
#     # Create document object (no file, no temp file needed)
#     fake_doc = Document(
#         page_content=text,
#         metadata={"source": "user_input"}
#     )
    
#     # Same splitting as your existing code
#     splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
#     chunks = splitter.split_documents([fake_doc])
    
#     # Same metadata update pattern
#     for i, chunk in enumerate(chunks):
#         chunk.metadata.update({
#             "userId": userId,
#             "filename": f"{title}_manual.txt",
#             "chunkId": i
#         })
    
#     # Same vectorstore creation
#     vectorStore = PineconeVectorStore.from_documents(
#         documents=chunks,
#         embedding=embeddings,
#         index_name=INDEX_NAME
#     )
    
#     return {"message": "Text added to context"}