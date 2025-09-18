from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from app.layers import workflow
from dotenv import load_dotenv
load_dotenv()
import os
secret = os.getenv("secret")

# from langchain_pinecone import PineconeVectorStore


class PromptRequest(BaseModel):
    user_prompt: str
    pdfId: str
    user_id: str
    isContext: bool


router = APIRouter(
    prefix='/ai',
    tags=["ai"]
)

@router.post('/generate')
async def generate(req: PromptRequest, secret1: str = Header(...)):

    print(req, secret1, secret)
    print("here")
    if secret1 != secret:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        html = await workflow(req)
        return html
    except Exception as e:
        return f"Error : {e}"

    


# @router.post('/edit')
# async def edit(req: EditRequest):
    
#     context = ""
#     if req.iscontext:
#         results = vector_store.similarity_search(
#             req.user_prompt,
#             k=5,
#             filter={"userId": req.user_id}
#         )

#         context = "\n\n".join([doc.page_content for doc in results])

#     prompt = PromptTemplate(
#             input_variables=["context","goal", "toEdit"],
#             template="""
#                 You are an AI document editor. 
#                 You will modify the provided HTML block according to the user's goal while keeping the HTML valid and preserving:
#                 - Tailwind CSS classes
#                 - inline styles
#                 - data-* attributes
#                 - the general formatting and indentation

#                 Relevant reference material (use only if helpful for the edit):
#                 {context}

#                 User's goal:
#                 {goal}

#                 HTML block to edit:
#                 {toEdit}

#                 Important rules:
#                 - Make changes only inside the given HTML block.
#                 - If the reference material is unrelated to the goal, ignore it.
#                 - Do not add extra explanatory text or unrelated HTML outside the given block.
#                 - Keep semantic HTML tags unless the change specifically requires altering them.

#                 Return ONLY the modified HTML block.
#                 """
#                     )
#     chain = LLMChain(llm=llm, prompt=prompt)
#     output = await chain.ainvoke({
#             "context": context,
#             "goal": req.user_prompt
#         })

#     cleaned_html = output['text'].replace('\n', '').replace('\\"', '"')


#     return {"document": cleaned_html} 
