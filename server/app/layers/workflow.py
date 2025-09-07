from .prompt_refine import extract_formatting_and_content
from .formatting import generate_formatting_kwargs
from .content_draft import create_draft
from .refine_structure import refine_structure
from .renderer import create_html

async def workflow(user_input: str) -> str:

    try:
        extractor = await extract_formatting_and_content(user_input)
        formatting = await generate_formatting_kwargs(extractor[1])
        draft = await create_draft(extractor[0])
        content = await refine_structure(extractor[0], draft)

        html = create_html(content, formatting)

        return html    
    except Exception as e:
        return f"{e}"