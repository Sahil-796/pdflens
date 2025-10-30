import re
from dotenv import load_dotenv
load_dotenv()
import logging
logger = logging.getLogger(__name__)
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")

# for extracting formatting and content details from the user prompt.

async def extract_formatting_and_content(user_input: str) -> tuple:

    try:
        system = (
                "You are an expert at parsing user requests for a PDF generator. Your task is to accurately separate the request into three distinct categories:\n\n"
                "1. **Content Description**: What is the document about? Summarize the core topic and the information to be included. This will also be used to search the vector database so use such keywords that might help\n\n"
                "2. **Formatting Instructions**: Purely VISUAL and STYLISTIC requests. This includes colors (e.g., 'text should be blue'), fonts ('use Arial'), text alignment ('center the title'), spacing, and margins. **DO NOT** include instructions about content structure like tables or lists here. Include structure information but make sure it is in genral instructions too.\n\n"
                "3. **General Instructions**: Instructions about the STRUCTURE, LAYOUT, and ORGANIZATION of the content. This includes requests for specific elements like **tables**, bulleted lists, numbered lists, or a specific order of sections. For example, 'use a table to compare X and Y' or 'include a bulleted list' belongs here.\n\n"
                "Your response must strictly follow this format:\n"
                "Content Description: [Your response]\n"
                "Formatting Instructions: [Your response]\n"
                "General Instructions: [Your response]"
            
        )
        human = "Separate the formatting instructions, the content description and general instructions from the following input:\n\n{text}\n\n"

        prompt = ChatPromptTemplate([("system", system), ("human", human)])
        chain = prompt | llm # take this prompt and pipe it into the llm. | -> is pipe
        response = await chain.ainvoke({"text": user_input})
        result = response.content.strip()

        # --- Minimal addition to print token usage ---
        print(response.usage_metadata)
        print("Running prompt_refine")


        # regex for matching required content 
        content_desc_match = re.search(
            r'Content Description:\s*(.*?)\s*(?=Formatting Instructions:|General Instructions:|$)',
            result, re.DOTALL
        )

        formatting_instructions_match = re.search(
            r'Formatting Instructions:\s*(.*?)\s*(?=Content Description:|General Instructions:|$)',
            result, re.DOTALL
        )

        general_instructions_match = re.search(
            r'General Instructions:\s*(.*?)\s*(?=Content Description:|Formatting Instructions:|$)',
            result, re.DOTALL
        )


        if content_desc_match and formatting_instructions_match:
            content_description = content_desc_match.group(1).strip()
            formatting_instructions = formatting_instructions_match.group(1).strip()
            general_instructions = general_instructions_match.group(1).strip()
            
            return content_description, formatting_instructions, general_instructions
        else:
            raise ValueError("Could not parse content description and formatting instructions from input.")
    except Exception as e:
        logger.error(f"Error in extract_formatting_and_content: {str(e)}", exc_info=True)
        raise