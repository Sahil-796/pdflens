import json
import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()


llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

def generate_formatting_kwargs(formatting_instructions: str) -> dict:
    
    system = (
        "You are an assistant that generates valid formatting arguments for a PDF using WeasyPrint. "
        "Based on the provided formatting instructions, create a set of CSS-compatible formatting parameters that can be applied to style a PDF document. "
        "Your result should be a valid JSON dictionary where keys are CSS selectors "
        "(like 'body', 'p', 'h1', 'blockquote', etc. for global styles) OR numbered selectors (like 'p-1', 'h2-3') "
        "to represent element-specific styles. "
        "Only provide the JSON dictionary, excluding all other text. Ensure the JSON is properly formatted and valid. "
        "If the user asks for a background or theme, include 'background-color' and a complementary 'color' for text."
    )

    human = (
    "Convert the following formatting instructions into a valid CSS-style JSON dictionary for WeasyPrint:\n\n{text}\n\n"
    "Use global selectors (e.g., 'body', 'p', 'h1') for general styles. "
    "For element-specific styles, use '{{tag}}-{{n}}' (e.g., 'p-2' means the 2nd paragraph)."
    )


    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm
    response = chain.invoke({"text": formatting_instructions})
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
    

print(generate_formatting_kwargs("font: helvetica, text: black, third paragrph blue, heading: bold and large"))