import re
from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
# for extracting formatting and content details from the user prompt.
async def extract_formatting_and_content(user_input: str) -> tuple:
    system = (
        "You are an assistant that helps in providing instructions for another LLM based on the user inputs (Prompt) for creating PDFs. "
        "Your task is to separate the given (Prompt) into three parts: "
        "1. Description of the content to be included in the PDF based on the topic provided by the user."
        "2. Formatting instructions for the PDF provided by user."
        "3. General instructions for both. Example scenario: if user tells you to use a table or any specific details regarding the structure include it here. Include any specific details regarding the structure of the content or formatting here. And do not miss any details."
        "Your response should be in this format:"
        "Formatting Instructions: [Your response]\nContent Description: [Your response]\nGeneral Instructions: [Your Response]"
        "Only write formatting instructions for those specified in the input and if not specified, decide best possible instructions for the content"
    )
    human = "Separate the formatting instructions, the content description and general instructiojs from the following input:\n\n{text}\n\nFormatting Instructions:\nContent Description:"

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