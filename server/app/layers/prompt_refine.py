import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

# for extracting formatting and content details from the user prompt.
async def extract_formatting_and_content(user_input: str) -> tuple:
    system = (
        "You are an assistant that helps in providing instructions for another LLM based on the user inputs (Prompt) for creating PDFs. "
        "Your task is to separate the given (Prompt) into two parts: "
        "1. Description of the content to be included in the PDF based on the topic provided by the user. "
        "2. Formatting instructions for the PDF provided by hey user."
        "Your response should be in this format:"
        "Formatting Instructions: [Your response]\nContent Description: [Your response]"
    )
    human = "Separate the formatting instructions and the content description from the following input:\n\n{text}\n\nFormatting Instructions:\nContent Description:"

    prompt = ChatPromptTemplate([("system", system), ("human", human)])
    chain = prompt | llm # take this prompt and pipe it into the llm. | -> is pipe
    response = chain.invoke({"text": user_input})
    result = response.content.strip()

    # regex for matching required content 
    content_desc_match = re.search(r'Content Description:\s*(.*?)\s*(?=Formatting Instructions:|$)', result, re.DOTALL)
    formatting_instructions_match = re.search(r'Formatting Instructions:\s*(.*?)\s*(?=Content Description:|$)', result, re.DOTALL)

    if content_desc_match and formatting_instructions_match:
        content_description = content_desc_match.group(1).strip()
        formatting_instructions = formatting_instructions_match.group(1).strip()
        return content_description, formatting_instructions
    else:
        raise ValueError("Could not parse content description and formatting instructions from input.")