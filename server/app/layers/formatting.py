import json
import re
from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

async def generate_formatting_kwargs(formatting_instructions: str) -> dict:
    
    system = ("""
You are an assistant that generates valid formatting arguments for a PDF using WeasyPrint. 
Your output must be a valid JSON object with CSS-compatible formatting parameters.

ESSENTIAL REQUIREMENTS:
1. Always include basic spacing: margin-bottom for p/h1/h2/h3, padding for tables
2. Provide reasonable defaults for body, headings, and paragraphs
3. Use proper CSS property names with hyphens (margin-bottom, not margin_bottom)
4. Maintain visual hierarchy for headings (h1 > h2 > h3 in size/weight)
5. Ensure readability with proper line-height and font sizes

DEFAULT STRUCTURE (always include these basics):
- 'body': page margins, font-family, background, color
- 'p': margin-bottom for spacing
- 'h1', 'h2', 'h3': font-size, font-weight, margin-bottom
- Add element-specific styles only if user requests them

Keys must be plain strings. Use 'tag-n' format for specific elements (e.g., 'p-2' for 2nd paragraph).
Output only the JSON object, no explanations or markdown formatting.
""")

    human = (
        "Convert the following formatting instructions into a valid JSON object for WeasyPrint:\n\n{text}\n\n"
        "Include proper spacing and visual hierarchy. If no specific instructions given, use clean professional defaults."
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system),
        ("human", human)
    ])
    chain = prompt | llm
    response = await chain.ainvoke({"text": formatting_instructions})

    kwargs_json = response.content.strip()

    try:
        match = re.search(r"\{.*\}", kwargs_json, re.DOTALL)
        if match:
            kwargs_dict = match.group(0)
            formatting_kwargs = json.loads(kwargs_dict)
            
            # Apply smart defaults if missing
            formatting_kwargs = ensure_quality_formatting(formatting_kwargs)
            return formatting_kwargs
        else:
            raise ValueError("No valid dictionary found in the response")
    except Exception as e:
        print(f"Error parsing formatting kwargs: {e}")
        # Return safe defaults instead of empty dict
        return get_default_formatting()

def ensure_quality_formatting(formatting_dict: dict) -> dict:
    """Ensure essential formatting elements are present"""
    
    # Essential defaults that should always exist
    essential_defaults = {
        'body': {
            'font-family': 'Arial, sans-serif',
            'line-height': '1.6',
            'color': 'black',
            'background-color': 'white',
            'margin': '1in'
        },
        'p': {
            'margin-bottom': '12px',
            'font-size': '11pt'
        },
        'h1': {
            'font-size': '18pt',
            'font-weight': 'bold',
            'margin-bottom': '10px',
            'margin-top': '20px'
        },
        'h2': {
            'font-size': '16pt',
            'font-weight': 'bold',
            'margin-bottom': '8px',
            'margin-top': '16px'
        },
        'h3': {
            'font-size': '14pt',
            'font-weight': 'bold',
            'margin-bottom': '6px',
            'margin-top': '12px'
        },
        'ul': {'margin-bottom': '10px'},
        'ol': {'margin-bottom': '10px'},
        'li': {'margin-bottom': '3px'},
        'table': {
            'border-collapse': 'collapse',
            'margin-bottom': '12px',
            'width': '100%'
        },
        'td': {'padding': '6px', 'border': '1px solid #ddd'},
        'th': {'padding': '8px', 'border': '1px solid #ddd', 'font-weight': 'bold'}
    }
    
    # Merge defaults with user preferences (user preferences take priority)
    for tag, defaults in essential_defaults.items():
        if tag not in formatting_dict:
            formatting_dict[tag] = {}
        
        # Only add missing properties, don't override user choices
        for prop, value in defaults.items():
            if prop not in formatting_dict[tag]:
                formatting_dict[tag][prop] = value
    
    return formatting_dict

def get_default_formatting() -> dict:
    """Fallback formatting if everything fails"""
    return {
        'body': {
            'font-family': 'Arial, sans-serif',
            'line-height': '1.6',
            'margin': '1in',
            'color': 'black'
        },
        'p': {'margin-bottom': '12px'},
        'h1': {'font-size': '18pt', 'font-weight': 'bold', 'margin-bottom': '10px'},
        'h2': {'font-size': '16pt', 'font-weight': 'bold', 'margin-bottom': '8px'},
        'h3': {'font-size': '14pt', 'font-weight': 'bold', 'margin-bottom': '6px'}
    }