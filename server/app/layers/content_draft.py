from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
async def create_draft(content_description: str) -> str: 
    
    # Generates detailed content based on the content description.  

    system = (
        "You are a subject matter expert writing a pro handbook. "
        "By default, create authoritative, well-structured content of around 200–300 words. "
        "If the user specifies a target length (e.g., word count or number of pages), adjust the output accordingly "
        "(assume 1 page ≈ 400 words unless otherwise stated). "
        "Ensure strong visual hierarchy using Markdown: headings (#, ##, ###), subheadings, bullet points, numbered lists, "
        "and properly formatted tables. "
        "The Markdown must be clean and valid for seamless conversion with markitdown → HTML → styled PDF. "
        "The tone should be professional, practical, and example-driven, with actionable insights where relevant."
    )

    human = (
        "Create visually well-structured Markdown content for the following description. "
        "By default, keep the length around 200–300 words unless I explicitly specify otherwise "
        "(e.g., 'make it short 100 words' or 'make it 10 pages'). "
        "Focus only on niche-specific content for the description provided, avoiding extra comments:\n\n{text}"
    )


    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm 
    response = await chain.ainvoke({"text": content_description})
    content = response.content.strip()
    print(f"LLM-Content:\n{content}\n")
    return content