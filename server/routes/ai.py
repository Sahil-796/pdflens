import json
from fastapi import APIRouter
from dotenv import load_dotenv
from config import index, embeddings
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
- Root: <div class="pdf-root selectable p-8 bg-white text-gray-900 max-w-4xl mx-auto" data-block-id="b_root">...</div>. Do not wrap the code inside html. use this root settings
- Wrap each section (title, para, list, table, image, header/footer) in <div class="selectable" data-block-id="bX">...</div> with unique IDs.
- Headings: h1 → text-3xl font-bold mb-4, h2 → text-xl font-semibold mb-2.
- Paragraphs: text-base leading-relaxed mb-4.
- Tables: w-full border border-gray-300 border-collapse text-sm, style="page-break-inside: avoid;".
- Images: max-w-full h-auto rounded-lg mx-auto my-4. Use urls specified in the Goal and if not use sample urls if asked by the goal to use images.
- Footer: text-sm text-gray-500 text-center mt-8, print-friendly.z (dont add if not told in the goal)
- Add page-break support where you thing its necessary and page would break atp:
  @media print curlyBraces
    @page curclyBraces margin: 2cm; curlyBraces
    .page-break curclyBraces break-after: page; margin-top: 2cm; curclyBraces
  curclyBraces
- No JS, no placeholders, no markdown, ``` before and after the code. Output raw HTML only.

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