import json
import re
from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

async def generate_formatting_kwargs(formatting_instructions: str) -> dict:
    
    system = (
    "You are an assistant that generates valid formatting arguments for a PDF using WeasyPrint. "
    "Your output must be a valid Python dictionary of CSS-compatible formatting parameters. "
    "Keys must be plain strings (no '.' or '#').\n\n"
    "Follow this process:\n"
    "1. Always establish global styles for standard tags (at minimum: 'body', 'p', 'h1', 'h2', 'blockquote').\n"
    "   - Include reasonable defaults unless overridden:\n"
    "     background-color: 'white', color: 'black', font-family: 'Helvetica', line-height: '1.5', margin: '1in'.\n"
    "   - If the user provides broad instructions like 'all h1 tags blue', put that under the global key 'h1'.\n\n"
    "2. Then, add element-specific overrides only if the user explicitly targets a single element. "
    "   Use the format 'tag-n' (e.g., 'p-3' means the 3rd paragraph).\n\n"
    "Only return a Python dictionary literal. Do not output explanations, quotes around the entire dict, or JSON. "
    "Example keys: 'body', 'p', 'h1', 'p-2', 'h1-3'."
    "Your output must be a valid JSON object of CSS-compatible formatting parameters. "
    "Keys must use double quotes. Do not output Python dict syntax."

)

    human = (
    "Convert the following formatting instructions into a valid Python dictionary for WeasyPrint:\n\n{text}\n\n"
    "Rules:\n"
    "- Always include global defaults for 'body', 'p', 'h1', etc.\n"
    "- If the user says 'all h1 tags blue', apply that under 'h1'.\n"
    "- If the user says 'make only the 3rd paragraph red', add 'p-3': {{'color': 'red'}}.\n"
    "- Use plain keys only, no '.' or '#' prefixes."
    )


    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm
    response = await chain.ainvoke({"text": formatting_instructions})
    kwargs_json = response.content.strip()


    try:
        match = re.search(r"\{.*\}", kwargs_json, re.DOTALL) #regex to search {} in the response
        if match:
            kwargs_dict = match.group(0)
            formatting_kwargs = json.loads(kwargs_dict) #basically json.parse()
            return formatting_kwargs
        else:
            raise ValueError("No valid dictionary found in the response")
    except Exception as e:
        print(f"Error parsing formatting kwargs: {e}")
        return {}
    