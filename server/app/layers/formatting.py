import re
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import ast

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

def generate_formatting_kwargs(formatting_instructions: str) -> dict:
    
    system = (
        "You are an assistant that generates valid formatting arguments for a PDF. "
        "Based on the provided formatting instructions, create a set of formatting parameters that can be used to style a PDF document. "
        "Your result should be a valid JSON dictionary which could be passed directly to the reportlab library. "
        "Only provide the JSON dictionary, excluding all other text. Ensure the JSON is properly formatted and valid."
        "NOTE: If the user asks for a background/theme then you must include 'backColor': [Your response] with the correct color code, also provide the complementary text color to match the background/theme."
        "Ensure that the syntax for colors is valid for the reportlab library"
    )
    human = "Convert the following formatting instructions into a valid JSON dictionary for the reportlab library:\n\n{text}"

    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm
    response = chain.invoke({"text": formatting_instructions})
    kwargs_json = response.content.strip()


    try:
        match = re.search(r"\{.*\}", kwargs_json, re.DOTALL) #regex to search {} in the response
        if match:
            kwargs_dict = match.group(0)
            formatting_kwargs = ast.literal_eval(kwargs_dict) #basically json.parse()
            return formatting_kwargs
        else:
            raise ValueError("No valid dictionary found in the response")
    except Exception as e:
        print(f"Error parsing formatting kwargs: {e}")
        return {}
