from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from app.layers import editWorkflow
from dotenv import load_dotenv
load_dotenv()
import os
secret = os.getenv("secret")


class EditRequest(BaseModel):
    userPrompt: str
    html: str
    pdfId: str
    isContext: bool
    userId: str

router = APIRouter(
    prefix='/ai',
    tags=["ai"]
)

@router.post('/edit')
async def edit(req:EditRequest, secret1: str = Header(...)) -> str:
    if secret1 != secret:
        raise Exception("Unauthorized")

    try:
        html = await editWorkflow(req)
        return html
    except Exception as e:
        return f"Error : {e}"