from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from app.layers import workflow
from dotenv import load_dotenv
load_dotenv()
import os
secret = os.getenv("secret")

# from langchain_pinecone import PineconeVectorStore


class PromptRequest(BaseModel):
    userPrompt: str
    pdfId: str
    userId: str
    isContext: bool


router = APIRouter(
    prefix='/ai',
    tags=["ai"]
)

@router.post('/generate')
async def generate(req: PromptRequest, secret1: str = Header(...)):


    if secret1 != secret:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        html = await workflow(req)
        return html
    except Exception as e:
        return f"Error : {e}"