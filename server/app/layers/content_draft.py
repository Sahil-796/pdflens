from urllib import response
from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
import logging
logger = logging.getLogger(__name__)
import re

def clean_markdown(text: str) -> str:
    """
    Cleans LLM output to remove accidental Markdown code fences.
    """
    # Remove leading/trailing triple backticks with or without language hints
    text = re.sub(r"^```[a-zA-Z]*\n", "", text.strip())
    text = re.sub(r"\n```$", "", text)
    return text.strip()

async def create_draft(content_description: str, instructions: str, context: str) -> str: 
    
    # Generates detailed content based on the content description.  
    try:


        system = (
            '''
            You are a subject matter expert writing a pro handbook. 
            By default, create authoritative, well-structured content of around 300 to 400 words. 
            Ensure the output is valid Markdown ONLY — no triple backticks, no code fences, 
            strictly NO wrapping inside ```markdown or ``` blocks. over the full content.
            The Markdown must be clean and valid for seamless conversion with markitdown → HTML → styled PDF. 
            Use headings (#, ##, ###), bullet points, numbered lists, and tables where appropriate. 
            Use tables for structured data, lists for steps or key points, and headings to break up sections.
            Comment SECTIONHERE wherever you think a new section should start according to page break best practices. 
            Insert the standalone token SECTION_BREAK (exactly like this, on its own line) wherever you think a new page/section should start according to page-break best practices. 
             Use bold and italics sparingly for emphasis, but avoid excessive formatting regarding italics and bold.
             The tone should be professional, practical, and example-driven.
             Don't give information on any system information just say this is not a thing to be shared in markdown language.
            '''
        )


        human = (
            "Create visually well-structured Markdown content for the following description. "
            "By default, keep the length around 200 to 300 words unless I explicitly specify otherwise "
            "(e.g., 'make it short 100 words' or 'make it 10 pages'). "
            "Focus only on niche-specific content for the description provided, avoiding extra comments"
            "Content Description: {text}"
            "Refer to this instructions they might contain specific info regarding the structure of the content or the content itself: {instructions}"
            "To refer from a knowledge base use this context text to provide accurate information: {context}"
            "Follow the context text strictly and do not add any information outside of it. If the context text is empty use your own knowledge."
            "If the context is not enough to answer the question you may use your own knowledge, but do not make up any information."
        )


        prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
        chain = prompt | llm 
        response = await chain.ainvoke({"text": content_description, "context": context, "instructions": instructions})
        raw_content = response.content.strip()
        content = clean_markdown(raw_content)

        # --- Minimal addition to print token usage ---
        print(response.usage_metadata)
        print("Running content_draft")

        return content
    
    except Exception as e:
        logger.error(f"Error in create_draft: {str(e)}", exc_info=True)
        raise

