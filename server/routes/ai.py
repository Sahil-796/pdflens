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
           You are an expert HTML document generator optimized for PDF export and interactive frontend editing.

            Task:
            Generate a complete, standalone HTML fragment that:
            - Is production-ready and optimized for PDF conversion.
            - Uses Tailwind CSS utility classes for layout, typography, and spacing (assume Tailwind is available in the frontend).
            - Wrap the entire document in a single root container: <div class="pdf-root ...">...</div>.
            - Wrap every logical block (title, section, paragraph, list, table, image, code block, header, footer) with:
                <div class="selectable" data-block-id="BLOCK_ID"> ... </div>
            where BLOCK_ID is a short unique id (b1, b2, etc.).
            - Ensure every selectable wrapper has a unique data-block-id.
            - Use semantic HTML tags inside each selectable wrapper (h1, h2, p, ul, table, etc.).
            - Include headers and/or footers if explicitly requested in the Goal. Footers should be styled to appear at the bottom of each printed page where possible.
            - Use page-break-friendly properties (`style="page-break-inside: avoid;"`, `page-break-after: avoid`) on large blocks and tables so the content converts neatly to multi-page PDF.
            - Avoid external scripts, styles, or fonts — rely solely on Tailwind utility classes.
            - Output only raw HTML — no wrapping code blocks, no commentary, no placeholders.

            Context:
            {context}

            Goal:
            {goal}

            Requirements:
            1. Root element:
            <div class="pdf-root selectable p-8 bg-white text-gray-900 max-w-4xl mx-auto" data-block-id="b_root"> ... </div>
            2. Each content section/paragraph/list/table/image must be wrapped in `.selectable[data-block-id="bX"]` where X increments sequentially (b1, b2, b3...).
            3. Headings: use Tailwind classes like `text-3xl font-bold mb-4` for h1, `text-xl font-semibold mb-2` for h2.
            4. Paragraphs: use `text-base leading-relaxed mb-4`.
            5. Tables: use `class="w-full border border-gray-300 border-collapse text-sm"` and `style="page-break-inside: avoid;"`. Include Tailwind table styling for borders and padding.
            6. Images: use `class="max-w-full h-auto rounded-lg mx-auto my-4"`.
            7. Maintain consistent margins/paddings so content looks professional when exported to PDF.
            8. If headers or footers are included, wrap them in `.selectable[data-block-id]` and ensure footer is styled with `text-sm text-gray-500 text-center mt-8` and positioned print-friendly.
            9. Do not include interactive elements or JavaScript. Output pure HTML.

            Now generate the HTML according to the above rules and the provided Context and Goal.


            """
                )
        
    chain = LLMChain(llm=llm, prompt=prompt)
    output = await chain.ainvoke({
            "context": context,
            "goal": req.user_prompt
        })

    cleaned_html = output['text'].replace('\n', '').replace('\\"', '"')


    return {"document": cleaned_html} 