import asyncio
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

import re

def clean_markdown(text: str) -> str:
    """
    Cleans LLM output to remove accidental Markdown code fences.
    """
    # Remove leading/trailing triple backticks with or without language hints
    text = re.sub(r"^```[a-zA-Z]*\n", "", text.strip())
    text = re.sub(r"\n```$", "", text)
    return text.strip()

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

class EditRequest(BaseModel):
    userPrompt: str
    html: str
    pdfId: str
    userId: str

async def editWorkflow(req: EditRequest) -> str:
    user_input = req.userPrompt
    existing_content = req.html

    system = (
        "You are an expert CSS editor. "
        "Your task is to carefully edit the given HTML based on the user's requirements. "
        "Rules:\n"
        "- Only modify the content and CSS styling according to the requirements.\n"
        "- Never change the `id` attributes of any tags.\n"
        "- Never remove or modify the `class` name `selectable` if it exists.\n"
        "- If you need to change the styling of an element with `class='selectable'`, "
        "do it via inline `style` attributes only, without altering the class itself.\n"
        "- Keep the structure valid and consistent."
        "- Don't add any extra tags. Just use the tags that are provided in the user's requirements"
    )

    human = (
        "Here is the current HTML:\n\n"
        "{existing_content}\n\n"
        "User requirements:\n"
        "{requirements}\n\n"
        "Please only provide the updated HTML after applying these changes. Don't reply with anything else just the html string"
    )

    prompt = ChatPromptTemplate([("system", system), ("human", human)])
    chain = prompt | llm

    response = await chain.ainvoke(
        {"requirements": user_input, "existing_content": existing_content}
    )
    raw = response.content.strip()
    content = clean_markdown(raw)


    # --- Minimal addition to print token usage ---
    print(response.usage_metadata)

    return content


# ---- SAMPLE RUN ----
# async def main():
#     sample_req = EditRequest(
#         userPrompt="Change the heading color to red",
#         html="<html><body><h1 id='title' class='selectable'>Hello World</h1></body></html>",
#         pdfId="123",
#         userId="abc",
#     )

#     updated_html = await editWorkflow(sample_req)
#     print(updated_html)

# asyncio.run(main())