from pydantic import BaseModel
from .refine_prompt import refine_prompt
class PromptRequest(BaseModel):
    userPrompt: str
    pdfId: str
    userId: str
    isContext: bool



async def workflow(req: PromptRequest):
    user_input = req.userPrompt
    
    answer = await refine_prompt(user_input)
    
    return answer