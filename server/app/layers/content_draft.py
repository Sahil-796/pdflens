from dotenv import load_dotenv
load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

import re

def clean_markdown(text: str) -> str:
    """
    Cleans LLM output to remove accidental Markdown code fences.
    """
    # Remove leading/trailing triple backticks with or without language hints
    text = re.sub(r"^```[a-zA-Z]*\n", "", text.strip())
    text = re.sub(r"\n```$", "", text)
    return text.strip()

async def create_draft(content_description: str, instructions: str, context: str) -> str: 
    
    # Generates detailed content based on the content description.  
    
    system = (
        "You are an adaptive content expert who creates targeted, valuable content based on specific user needs. "
        "Your role changes based on the content type requested - you become the appropriate domain expert. "
        
        "CONTENT ANALYSIS FIRST:"
        "1. Identify the content type (how-to guide, explanation, comparison, reference, troubleshooting, etc.)"
        "2. Determine the appropriate expertise level and tone from the request"
        "3. Assess what specific value the user is seeking"
        
        "CONTENT CREATION RULES:"
        "- Create 300-500 words by default unless specific length requested"
        "- Lead with the most valuable information first"
        "- Include specific, actionable details rather than generic statements"
        "- Use concrete examples from the provided context when available"
        "- Structure content logically with clear headings and flow"
        "- Add practical insights, tips, or warnings where relevant"
        
        "OUTPUT FORMAT:"
        "- Clean, valid Markdown ONLY (no code fences, no ``` blocks)"
        "- Use proper heading hierarchy (#, ##, ###)"
        "- Include bullet points, numbered lists, and tables where they add clarity"
        "- Ensure content flows naturally and provides genuine value"
        
        "AVOID:"
        "- Generic filler content or obvious statements"
        "- Repetitive information"
        "- Vague advice without specifics"
        "- System information or meta-commentary"
    )

    human = (
        "Create valuable, well-structured Markdown content for this request: {text}\n\n"
        
        "AVAILABLE CONTEXT (use this to add specific details, examples, and accuracy):\n"
        "{context}\n\n"
        
        "INSTRUCTIONS:\n"
        "1. Analyze what type of content this request needs\n"
        "2. Determine the most valuable information to include\n"
        "3. Create content that someone would genuinely find useful and actionable\n"
        "4. Use context information to add specific details and examples\n"
        "5. Structure it clearly with appropriate headings and formatting\n\n"
        
        "Focus on delivering genuine value - what would an expert in this field actually tell someone who asked this question?"
    )


    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])
    chain = prompt | llm 
    response = await chain.ainvoke({"text": content_description, "context": context, "instructions": instructions})
    raw_content = response.content.strip()
    content = clean_markdown(raw_content)
    print(f"LLM-Content:\n{content}\n")
    return content