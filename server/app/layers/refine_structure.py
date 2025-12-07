from dotenv import load_dotenv
import logging
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
logger = logging.getLogger(__name__)
load_dotenv()
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    api_key=os.environ["GOOGLE_API_KEY3"]
)async def refine_structure(content_description: str, context: str, initial_content: str, instructions: str) -> str:

    try:
        system = (
                    "You are an expert editor refining technical documentation. "
                    "Your task is to improve the flow, clarity, and structure of the provided Markdown content.\n"
                    "RULES:\n"
                    "1. Remove conversational filler ('Here is the guide...', 'In conclusion...').\n"
                    "2. Ensure headings follow a logical hierarchy (#, ##, ###).\n"
                    "3. CRITICAL: DO NOT remove or alter any ```mermaid code blocks. Preserving diagrams is your top priority.\n"
                    "4. CRITICAL: DO NOT remove or alter Markdown tables.\n"
                    "5. CRITICAL: Keep citations exactly where they are.\n"
                    "6. Output ONLY the raw Markdown content. No wrapper text."
                )

        human = ("Refine and improve the following Markdown content based on the given content description and instructions. "
                "Ensure the final content is detailed, well-structured, and adheres to the structural requests:\n\n"
                "Content Description:\n{description}\n\n"
                "Structural Instructions:\n{instructions}\n\n"
                "Context/Knowledge base provided:\n{context}\n\n"
                "Initial Content:\n{content}")
        
        prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
        chain = prompt |llm 
        response = await chain.ainvoke({"description": content_description, "context":context, "content": initial_content, "instructions": instructions})
        refined_content = response.content.strip()

        # --- Minimal addition to print token usage ---
        print(response.usage_metadata)
        
        print("Running refine_structure")


        return refined_content

    except Exception as e:
        logger.error(f"Error in refine_structure: {str(e)}", exc_info=True)
        raise