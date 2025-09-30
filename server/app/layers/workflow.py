from .prompt_refine import extract_formatting_and_content
from .formatting import generate_formatting_kwargs
from .content_draft import create_draft
from .refine_structure import refine_structure
from .renderer import create_html
from pydantic import BaseModel
from app.config import index, embeddings, INDEX_NAME

class PromptRequest(BaseModel):
    userPrompt: str
    pdfId: str
    userId: str
    isContext: bool


from langchain_pinecone import PineconeVectorStore
vector_store = PineconeVectorStore(
    embedding=embeddings,
    index=index
)

# layers/workflow.py - The NEW, "Error-Proofed" Way

async def workflow(req = PromptRequest) -> str:
    # No more try...except block. Let errors bubble up!
    userId = req.userId
    user_input = req.userPrompt
    pdfId = req.pdfId

    print({"userId": userId, "pdfId": pdfId})
    if not user_input.strip():
        # Instead of returning a string, you raise the specific error.
        raise ValueError("User input is empty")

    # This function will now raise a ValueError if it fails, which is perfect.
    extractor = await extract_formatting_and_content(user_input)

    if not extractor or len(extractor) < 3:
        # This also raises a specific error.
        raise ValueError("Could not extract formatting/content")

    # ... rest of your workflow logic ...
    
    context = ""
    if req.isContext:
        results = vector_store.similarity_search(
            extractor[0],
            k=10,
            filter={"userId": userId, "pdfId": pdfId}
        )
        context = "\n\n".join([doc.page_content for doc in results])

    draft = await create_draft(extractor[0], extractor[2], context)
    print({"context": context})
    content = await refine_structure(extractor[0] + " " + context, draft, extractor[2])
    formatting = await generate_formatting_kwargs(extractor[1], content)

    html = create_html(content, formatting)
    return html
