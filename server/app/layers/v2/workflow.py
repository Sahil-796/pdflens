from pydantic import BaseModel
from .refine_prompt import refine_prompt
from .generate_content import generate_content

class PromptRequest(BaseModel):
    userPrompt: str
    pdfId: str
    userId: str
    isContext: bool



async def workflow(req: PromptRequest):
    user_input = req.userPrompt
    
    content_description, formatting_instructions, general_instructions, rag_query = await refine_prompt(user_input)
    
    answer = await generate_content(content_description, formatting_instructions, general_instructions, "")
    
    return answer