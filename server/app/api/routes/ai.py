import json
from fastapi import APIRouter
from dotenv import load_dotenv
from server.app.config import index, embeddings
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

class EditRequest(BaseModel):
    user_prompt: str
    text_to_edit: str
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


@router.post('/edit')
async def edit(req: EditRequest):
    
    context = ""
    if req.iscontext:
        results = vector_store.similarity_search(
            req.user_prompt,
            k=5,
            filter={"userId": req.user_id}
        )

        context = "\n\n".join([doc.page_content for doc in results])

    prompt = PromptTemplate(
            input_variables=["context","goal", "toEdit"],
            template="""
                You are an AI document editor. 
                You will modify the provided HTML block according to the user's goal while keeping the HTML valid and preserving:
                - Tailwind CSS classes
                - inline styles
                - data-* attributes
                - the general formatting and indentation

                Relevant reference material (use only if helpful for the edit):
                {context}

                User's goal:
                {goal}

                HTML block to edit:
                {toEdit}

                Important rules:
                - Make changes only inside the given HTML block.
                - If the reference material is unrelated to the goal, ignore it.
                - Do not add extra explanatory text or unrelated HTML outside the given block.
                - Keep semantic HTML tags unless the change specifically requires altering them.

                Return ONLY the modified HTML block.
                """
                    )
    chain = LLMChain(llm=llm, prompt=prompt)
    output = await chain.ainvoke({
            "context": context,
            "goal": req.user_prompt
        })

    cleaned_html = output['text'].replace('\n', '').replace('\\"', '"')


    return {"document": cleaned_html} 




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
You are an expert HTML generator for PDF export.

Task:
Create a full standalone HTML fragment that:
- Uses Tailwind CSS (assume available).
- Root must be:
  <div class="pdf-root selectable p-8 bg-white text-black max-w-4xl mx-auto" data-block-id="b_root">...</div>
  (Do not wrap with <html>, <head>, or <body>.)
- Wrap each section (title, paragraph, list, table, image, header, footer) inside:
  <div class="selectable" data-block-id="bX">...</div>
  where each block-id is unique.
- Headings:
  • h1 → class="text-3xl font-bold mb-4"
  • h2 → class="text-xl font-semibold mb-2"
- Paragraphs: class="text-base leading-relaxed mb-4"
- Tables:
  • class="w-full border border-gray-300 border-collapse text-sm"
  • Always add style="page-break-inside: avoid;"
- Images:
  • class="max-w-full h-auto rounded-lg mx-auto my-4"
  • Use URLs provided in the Goal, otherwise sample URLs if Goal requests sample images.
- Footer:
  • class="text-sm text-gray-500 text-center mt-8 print-friendly"
  • Only include if explicitly requested in the Goal.
- Header:
  • class="text-sm text-gray-500 text-center mt-8 print-friendly"
  • Only include if explicitly requested in the Goal.
- Page-break support:
  Include this CSS at the top:
    <style>
    @media print {
      @page { margin: 2cm; }
      .page-break { break-after: page; margin-top: 2cm; }
    }
    </style>
  By default:
    • Insert at least one <div class="page-break"></div> after every 2–3 major sections (h1, table, or image) to ensure readability in PDF.
    • If the Goal specifies custom page-breaks, follow those instructions exactly instead of defaults.

Constraints:
- Do not generate JavaScript.
- Do not generate placeholders or markdown formatting.
- Output raw HTML only (wrapped in ``` for code fencing).

Context:
{context}

Goal:
{goal}

            """
                )
        
    chain = LLMChain(llm=llm, prompt=prompt)
    output = await chain.ainvoke({
            "context": context,
            "goal": req.user_prompt
        })

    text = output['text']

    # cleaned_html = output['text'].replace('\n', '').replace('\\"', '"')
    try: 
        cleaned_html = json.loads(f'"{text}"')
        print("here")
    except: 
        cleaned_html = output['text'].replace('\n', '').replace('\"', '"')
    
    return {"document": cleaned_html} 