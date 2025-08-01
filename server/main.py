import os
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv

from pinecone import Pinecone
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()
app = FastAPI()

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY"),
)
index_name = os.getenv("PINECONE_INDEX")
index = pc.Index(index_name)  


embeddings = GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-001')

# vector = embeddings.embed_query("hello world!")


@app.get('/')
def root():
    return {"message": "Welcome to the FastAPI server!"}

@app.post('/upload')
async def upload_file(file: UploadFile = File(...)):
    print(file)
    return {"filename":file.filename}