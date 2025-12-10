import os
import logging
from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from app.layers.v2.workflow import PromptRequest
from app.layers.v2.workflow import workflow
logger = logging.getLogger(__name__)
load_dotenv()
secret = os.getenv("secret")

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
        return JSONResponse(
            status_code=400,
            content={"message": str(ve)}
        )


    except HTTPException:
        raise


    except Exception as e:
        logger.error(
            f"Error processing request for user {req.userId}: {str(e)}",
            exc_info=True
        )
        return JSONResponse(
            status_code=500,
            content={"message": str(e)}
        )
