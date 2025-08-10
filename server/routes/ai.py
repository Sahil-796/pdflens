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
           You are an expert HTML and PDF layout designer.  
Generate a complete, professional HTML document that is visually optimized for direct PDF export.  

Core Requirements:
1. Include the full HTML structure:
   - `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`.
   - A `<meta charset="UTF-8">` tag in `<head>`.

2. Styling:
   - Use inline `<style>` inside the `<head>` (no external CSS or fonts).
   - Default font: Arial, Helvetica, or a clean sans-serif.
   - Maintain consistent margins (e.g., 1 inch on all sides), spacing, and line height.
   - All text should be left-aligned unless specified.
   - Tables, lists, and headings must be cleanly styled and visually distinct.
   - ensure theres enough padding/margin for the content to be visible.
3. PDF-Specific Layout:
   - Use `page-break-before`, `page-break-after`, or `page-break-inside: avoid;` to control page flow.
   - Ensure no awkward cuts for headings, images, or tables.
   - Avoid content overflow by wrapping text.


5. Content:
   - Follow semantic HTML (`<h1>` for title, `<h2>` for subtitles, `<p>` for paragraphs, `<ul>/<ol>` for lists, `<table>` for tabular data).
   - Support images with `<img>` using inline `max-width: 100%; height: auto;`.
   - Bold/italic text where appropriate for emphasis.
   - Ensure all styles and assets are embedded — output must be fully self-contained.

6. Output:
   - Output only raw HTML, no explanations or comments. dont include the code insoide '''html ''', just give pure ready to run code
   - The HTML must be production-ready and require no further cleanup for PDF conversion.

Context:
{context}

Goal:
{goal}

Now generate the HTML document and dont write anything else just pure usable HTML. dont write any extra info other thanwhats asked like any placeholder info too. ignore it.

            """
                )
        
    chain = LLMChain(llm=llm, prompt=prompt)
    output = await chain.ainvoke({
            "context": context,
            "goal": req.user_prompt
        })

    cleaned_html = output['text'].replace('\n', '')

    return {"document": cleaned_html} 