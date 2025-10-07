from pinecone import Pinecone, ServerlessSpec
from langchain_google_genai import GoogleGenerativeAIEmbeddings

import os
from dotenv import load_dotenv

load_dotenv()

# Pinecone setup
pc = Pinecone(
    api_key=os.environ.get("PINECONE_API_KEY"),
)

INDEX_NAME = os.getenv("PINECONE_INDEX")

if not pc.has_index(INDEX_NAME):
    pc.create_index(
        name=INDEX_NAME,
        dimension=1024,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
index = pc.Index(INDEX_NAME)  

embeddings = GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-exp-03-07')
embeddings = GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-001')

from langchain_cloudflare import CloudflareWorkersAIEmbeddings

account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
api_token = os.environ.get("CLOUDFLARE_AUTH_TOKEN")
model_name =  "@cf/baai/bge-m3"

cfEmbeddings = CloudflareWorkersAIEmbeddings(
    account_id=str(account_id),
    api_token=str(api_token),
    model_name=model_name
)