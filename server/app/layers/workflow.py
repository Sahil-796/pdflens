from .prompt_refine import extract_formatting_and_content
from .formatting import generate_formatting_kwargs
from .content_draft import create_draft
from .refine_structure import refine_structure
from .renderer import create_html
from pydantic import BaseModel
from config import index, embeddings, INDEX_NAME

class PromptRequest(BaseModel):
    user_prompt: str
    pdfname: str
    user_id: str

from langchain_pinecone import PineconeVectorStore
vector_store = PineconeVectorStore(
    embedding=embeddings,
    index=index
)




async def workflow(req = PromptRequest) -> str:

    try:
        user_id = req.user_id
        user_input = req.user_prompt
        pdfname = req.pdfname

        if req.isContext:
            context = ""
            results = vector_store.similarity_search(
                req.user_prompt,
                k=10,
                filter={"userId": user_id, "pdfname": pdfname}
            )
            context = "\n\n".join([doc.page_content for doc in results])

        extractor = await extract_formatting_and_content(user_input)
        draft = await create_draft(extractor[0])
        # tags = extract_tags_from_md(draft)/
        formatting = await generate_formatting_kwargs(extractor[1])
        content = await refine_structure(extractor[0], draft)

        html = create_html(content, formatting)

        return html    
    except Exception as e:
        return f"error in workflow : {e}"