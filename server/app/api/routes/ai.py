from fastapi import APIRouter, Header, HTTPException
import logging
logger = logging.getLogger(__name__)
from fastapi.responses import JSONResponse
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
    
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}", exc_info=True)
        raise JSONResponse(status_code=400, content={"message": str(ve)})
    
    except HTTPException:
        # Re-raise 
        raise

    except Exception as e:
        logger.error(
            f"Error processing request for user {req.userId}: {str(e)}", 
            exc_info=True
        )
        return JSONResponse(status_code=500, content={"message": str(e)})