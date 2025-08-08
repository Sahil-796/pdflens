from fastapi import APIRouter, UploadFile, File, Form
from dotenv import load_dotenv
from main import index, embeddings, INDEX_NAME

from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-pro")

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
async def edit_selection(user_prompt: str, user_id: str, context: bool):

    if context:
        results = vector_store.similarity_search(
            user_prompt,
            k=5,
            filter={"user_id": user_id}
        )

        context = "\n\n".join([doc.page_content for doc in results])

    prompt = PromptTemplate(
        input_variables=["context","goal"],
        template="""
You are an expert report generator.
Using following context, generate a detailed, well-structured document based on the user's goal.

Context:
{context}

Goal:
{goal}

Document:
"""
    )
        
    


    pass
 