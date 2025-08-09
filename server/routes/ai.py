from fastapi import APIRouter, UploadFile, File, Form
from dotenv import load_dotenv
from config import index, embeddings, INDEX_NAME
from pydantic import BaseModel

from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

class PromptRequest(BaseModel):
    user_prompt: str
    iscontext: bool
    user_id: str

vector_store = PineconeVectorStore(
    embedding=embeddings,
    index=index
)

load_dotenv()
router = APIRouter(
    prefix='/ai',
    tags=["ai"]
)




@router.post('/generate')
async def generate(req: PromptRequest):

    context = ""
    if req.iscontext:
        results = vector_store.similarity_search(
            req.user_prompt,
            k=5,
            filter={"userId": req.user_id}
        )

        context = "\n\n".join([doc.page_content for doc in results])

    
    prompt = PromptTemplate(
        input_variables=["context","goal"],
        template="""
           You are an expert LaTeX document generator.  
           Generate complete, well-structured LaTeX documents including preamble and document environment, based on user context and goal.

            Context:  
            {context}

            Goal:  
            {goal}

            Produce the full LaTeX source code for a standalone document fulfilling the user’s goal using the given context.
            Use appropriate sections, subsections, lists, tables, and include necessary packages
            Output the LaTeX code as raw text without escapes or string formatting make sure it is ready to compile without errors and dont add anything in the output just pure code.
            """
                )
        
    chain = LLMChain(llm=llm, prompt=prompt)
    output = await chain.ainvoke({
            "context": context,
            "goal": req.user_prompt
        })



    return {"document": output} 