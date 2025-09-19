from fastapi import APIRouter, Header, HTTPException
from langchain_pinecone import PineconeVectorStore
from pydantic import BaseModel
from app.config import index, embeddings, INDEX_NAME
from dotenv import load_dotenv

load_dotenv()
import os
secret = os.getenv("secret")



vector_store = PineconeVectorStore(
    embedding=embeddings,
    index=index
)

router = APIRouter(
    prefix='/context',
    tags=["context"]
)


class RemoveRequest(BaseModel):
    filname: str
    pdfId: str
    userId: str

@router.post('/remove')
async def generate(req: RemoveRequest, secret1: str = Header(...)):
    if secret1 != secret:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        query = f"filename:{req.filname} AND pdfId:{req.pdfId} AND userId:{req.userId}"
        vector_store.delete(query)
        return {"message": "Context removed successfully"}
    except Exception as e:    
        raise HTTPException(status_code=500, detail=f"Error removing context: {e}")
