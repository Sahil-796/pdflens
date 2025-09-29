from fastapi import APIRouter, Header, JSONResponse
import logging
logger = logging.getLogger(__name__)
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
    filename: str
    pdfId: str
    userId: str

@router.post('/remove')
async def remove(req: RemoveRequest, secret1: str = Header(...)):
    # if secret1 != secret:
    #     raise JSONResponse(status_code=401, detail="Unauthorized")

    try:
        query = f"filename:{req.filename} AND pdfId:{req.pdfId} AND userId:{req.userId}"
        vector_store.delete(query)
        return {"message": "Context removed successfully"}
    except Exception as e:    
        logger.error(
            f"Error processing request in remove context: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})