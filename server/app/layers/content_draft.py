from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
async def create_draft(content_description: str) -> str: 
    
    # Generates detailed content based on the content description.  

    system = (
        "Your job is to create detailed contents for PDFs including comprehensive information about the provided topic. "
        "Based on the provided description, generate in-depth and informative content about that topic which is to be included in a PDF document. "
        "Ensure the content is detailed, well-structured, and contains substantial information to satisfy the user's needs. "
        "You must also create tables/lists where relevant. "
        "NOTE: While creating tables and lists, make the markdown valid so that it could be converted to HTML tags using markdown2.markdown() in Python. "
        "Ensure the markdown for tables uses proper syntax to avoid conversion issues."
    )
    human = "Create detailed Markdown content for the following description. Only give niche-specific content for the description provided avoiding any extra comments:\n\n{text}"

    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm 
    response = await chain.ainvoke({"text": content_description})
    content = response.content.strip()
    print(f"LLM-Content:\n{content}\n")
    return content