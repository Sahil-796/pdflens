import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form
from dotenv import load_dotenv

from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()
router = APIRouter(
    prefix='/upload',
    tags=["upload"]
)

pc = Pinecone(
    api_key=os.environ.get("PINECONE_API_KEY"),
)

INDEX_NAME = os.getenv("PINECONE_INDEX")

if not pc.has_index(INDEX_NAME):
    pc.create_index(
        name=INDEX_NAME,
        dimension=3072,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
index = pc.Index(INDEX_NAME)  

embeddings = GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-001')

# vector = embeddings.embed_query("hello world!")


@router.post('/')
async def upload_context(file: UploadFile = File(...), userId: str = Form(...)):

    extension = file.filename.split('.')[-1].lower()
    

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    if extension == 'pdf':
        loader = PyPDFLoader(tmp_path)
    elif (extension == 'doc') or (extension == 'docx'):
        return {"message":"doc or docx"}
    else:
        return {"error":"Unsupported file type"}
    
    
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    for i, chunk in enumerate(chunks):
        chunk.metadata.update({
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