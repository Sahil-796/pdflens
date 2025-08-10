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
           You are an expert HTML document generator optimized for PDF export and frontend editing.

Task:
Generate a complete, standalone HTML fragment that:
- Is production-ready and optimized for PDF conversion.
- Uses Tailwind CSS utility classes for layout and typography (assume Tailwind is available in the frontend).
- Wrap the entire document in a single root container: <div class="pdf-root ...">...</div>.
- Wrap every logical block (title, section, paragraph, list, table, image, code block) with a wrapper:
    <div class="selectable" data-block-id="BLOCK_ID"> ... </div>
  where BLOCK_ID is a short unique id (e.g., b1, b2). Ensure every selectable wrapper has a unique data-block-id.
- Use semantic HTML tags inside each selectable wrapper (h1, h2, p, ul, table, etc.).
- Include inline style attributes only when necessary; rely primarily on Tailwind utility classes for spacing, fonts, borders, and page-friendly layout.
- Include page-break-friendly classes/styles (e.g., using inline style `page-break-inside: avoid;` on large blocks and tables) so the content converts neatly to multi-page PDF.
- Do NOT include any external scripts. No explanations before/after the HTML — output only the raw HTML.

Context:
{context}

Goal:
{goal}

Requirements:
1. The root element must be:
   <div class="pdf-root selectable" data-block-id="b_root"> ... </div>
   Inside it, generate structured content wrapped in additional `.selectable[data-block-id="bX"]` blocks for each paragraph/section.
2. Each `data-block-id` must be unique and short (b1, b2, ...).
3. Use Tailwind classes for margins, padding, text size, fonts, borders and colors (e.g., `p-6`, `text-lg`, `font-semibold`, `border`, `bg-white`, `max-w-4xl`, `mx-auto`).
4. For tables, include `class="w-full border-collapse"` and inline `style="page-break-inside: avoid;"`.
5. For headings, use `h1` and `h2` inside selectable wrappers and use `page-break-after: avoid` for those wrappers.
6. Make the content print-friendly: set readable font sizes, consistent margins, and avoid interactive elements. Keep images using `class="max-w-full h-auto"`.
7. Output only raw HTML — no wrapping code blocks (no ```html), no commentary, nothing else.

Now generate the HTML document according to the above rules and the provided Context and Goal.


            """
                )
        
    chain = LLMChain(llm=llm, prompt=prompt)
    output = await chain.ainvoke({
            "context": context,
            "goal": req.user_prompt
        })

    cleaned_html = output['text'].replace('\n', '')

    return {"document": cleaned_html} 