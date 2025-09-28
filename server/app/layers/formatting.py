import json
import logging
logger = logging.getLogger(__name__)
import re
from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

async def generate_formatting_kwargs(formatting_instructions: str, content: str) -> dict:
    
    try:
        system = ("""
            You are an assistant that generates valid formatting arguments for a PDF using WeasyPrint. 
            Your output must be a valid Python dictionary of CSS-compatible formatting parameters. 
            Keys must be plain strings (no '.' or '#').
            Content in markdown format will be provided to you, this markdown would be converted to html using other workflows using markdownIT. Your job is to match the formattings you generate according to the to be converted markdown. 
                        
            Follow this process:
            1. Always establish global styles for standard tags (at minimum: 'body', 'p', 'h1', 'h2', 'blockquote').
            - Include reasonable defaults unless overridden:
                background-color: 'white', color: 'black', font-family: 'Helvetica', line-height: '1.5', margin: '1in'.
            - If the user provides broad instructions like 'all h1 tags blue', put that under the global key 'h1'.

            2. Then, add element-specific overrides only if the user explicitly targets a single element. 
            Use the format 'tag-n' (e.g., 'p-3' means the 3rd paragraph).

            Only return a Python dictionary literal. Do not output explanations, quotes around the entire dict, or JSON. 
            Example keys: 'body', 'p', 'h1', 'p-2', 'h1-3'.
            Use proper CSS keywords with hyphens; don't use underscores.
            Use perfect styles and sizes for heading tags, maintaining visual hierarchy; don't give colors other than black and white unless the user specifies so. You can make it bold and light-colored for good visuals.
            For tables use borders and keep everything centered or left aligned. Match the alignment of cells with headings.
            Set appropriate gap between each element so it doesnt stick to each other
            Your output must be a valid JSON object (not Python dict). 
            Keys must use double quotes. 
            Maintain required spacing between each elements
            """
        )

        human = (
            """
            Convert the following formatting instructions into a valid Python dictionary for WeasyPrint:\n\n{text}\n\n
            Here's the content in md format : \n\n{content}\n\n
            Rules:\n
            - Always include global defaults for 'body', 'p', 'h1', etc.\n
            - If the user says 'all h1 tags blue', apply that under 'h1'.\n
            - If the user says 'make only the 3rd paragraph red', add 'p-3': {{'color': 'red'}}.\n
            - Use plain keys only, no '.' or '#' prefixes.
            """
        )


        prompt = ChatPromptTemplate.from_messages([
            ("system", system),
            ("human", human)
            ])
        chain = prompt | llm
        response = await chain.ainvoke({"text": formatting_instructions, "content": content})

        kwargs_json = response.content.strip()

    
        match = re.search(r"\{.*\}", kwargs_json, re.DOTALL) #regex to search {} in the match
        if match:
            kwargs_dict = match.group(0)
            formatting_kwargs = json.loads(kwargs_dict) #basically json.parse()
            return formatting_kwargs
        else:
            raise ValueError("No valid dictionary found in the response")
    except Exception as e:
        logging.error(f"Error in formatting: {str(e)}", exc_info=True)
        raise