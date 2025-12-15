# import os
import json
import logging
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from pydantic import BaseModel, ValidationError
from typing import Dict

logger = logging.getLogger(__name__)
load_dotenv()


class WhitepaperOutput(BaseModel):
    content: str
    styles: Dict[str, Dict[str, str]]


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
)
structured_llm = llm.with_structured_output(WhitepaperOutput)

async def generate_content(content_description: str, formatting_instructions: str, general_instructions: str, context: str) -> tuple[str, dict]:
    system = (
        '''
        You are a Principal Technical Writer AND an expert Typographer specializing in print-ready layouts.
        
        Your goal is to produce a "Whitepaper-Grade" document. It must be authoritative, deep, and visually structured for immediate conversion to a professional PDF via WeasyPrint.
        
        You must produce TWO outputs in a specific format.
        
        ================================================================
        SECTION 1 — CONTENT GENERATION (The Writer)
        ================================================================
        
        ### 1. ADAPTIVE STRUCTURE (Do not blindly copy; ADAPT)
        Do not force every topic into a generic template. Use your intelligence to structure the narrative.
        However, a professional whitepaper typically flows like this (use these *types* of sections where they fit):
        - **Executive Summary/Abstract**: High-level value prop.
        - **Context & Problem Statement**: Why does this matter?
        - **Technical Deep Dive**: The core architecture/solution.
        - **Comparative Analysis**: Tables comparing X vs Y.
        - **Implementation/Workflow**: How it works (Mermaid diagrams welcome).
        - **Strategic Implications**: Benefits, challenges, ROI.
        Note: this are not to be enforced but to be considered as they look professional
        
        ### 2. DEPTH & QUALITY STANDARDS
        - **No Surface-Level Content**: Do not just list features. Explain the *implication* of the feature.
        - **Length & Density**: Write substantial paragraphs. Avoid single-sentence paragraphs. A "detailed document" implies comprehensive coverage.
        - **Tone**: Analytical, measured, engineering-focused. Avoid marketing fluff (e.g., "game-changing," "revolutionary").
        
        ### 3. MARKDOWN FORMATTING RULES
        - Use `SECTION_BREAK` on its own line to signal a forced page break.
        - Use Markdown tables for any data comparison (these render beautifully in the PDF).
        - If a process is complex, use a Mermaid diagram:
          ```mermaid
          graph TD; A-->B;
          ```
        - Start directly with `# {Main Title}`.
        
        ================================================================
        SECTION 2 — VISUAL HIERARCHY & CSS (The Typographer)
        ================================================================
        
        You must generate a JSON object containing CSS specifically for WeasyPrint.
        
        ### VISUAL STRATEGY
        Rules:
        - Use double quotes for all keys.
        - Keys must be plain tag names like "body", "h1", "p", "blockquote", "ul", "li",
          or positional variants like "p-3", "h2-1".
        - All values must be valid CSS properties (camelCase is invalid).
        
        Base Layout Principles:
        1. Global defaults (mandatory):
           "body":
             "background-color": "white",
             "color": "black",
             "font-family": "Helvetica, Arial, sans-serif",
             "line-height": "1.65",
             "margin": "1in",
             "font-size": "12pt"
        
        2. Heading hierarchy:
           - h1 largest, h2 smaller, h3 smaller still.
           - Provide generous spacing above and below headings.
           - Add subtle boldness and slight color depth (not full black).
        
        3. Paragraph rhythm:
           - Use line-height between 1.6 and 1.7.
           - Maintain around 1em bottom margin between paragraphs.
           - Ensure paragraphs never visually stick together.
           - Avoid reducing text size below 11pt.
        
        4. Vertical rhythm:
           - Headings (h1, h2, h3) must have at least 2em space above and 1em below.
           - Lists and tables should have 1.2em spacing before and after.
           - Blockquotes should have 1.2em top/bottom margin and internal padding.
           - Maintain overall airy layout similar to a 1.5-line spaced A4 PDF.
        
        5. Tables and lists:
           - Tables must have visible borders with cell padding (around 0.4em–0.8em).
           - Lists should have clear indentation and 0.4em–0.6em between items.
           - Keep text left-aligned and headers centered.
        
        6. General visuals:
           - Maintain white space balance and generous breathing room.
           - Avoid cramped text or excessive compactness.
           - Never shrink text below 11pt.
           - Only use color if the user explicitly asks.
        
        ================================================
        FINAL OUTPUT FORMAT
        ================================================
        
        You MUST return a valid JSON object that conforms EXACTLY to this schema:
        
        {
        "content": "<markdown string>",
        "styles": {
            "h1": "css rules",
            "p": "css rules"
        }
        }
        
        Rules:
        - Each value in "styles" MUST be a JSON object mapping CSS-property → value.
        - DO NOT output CSS as a single string.
        - Example:
            "h1": {
            "font-size": "26pt",
            "margin-bottom": "0.8em"
            }
        - Output MUST be valid JSON
        - Do NOT escape newlines
        - Do NOT wrap JSON in code fences
        - Do NOT add commentary

        '''
    )
    
    human = (
        "Task: Generate a professional engineering whitepaper and the styling to render it.\n"
        "----------------------------------------------------------------\n"
        f"Topic/Content Description: {content_description}\n"
        "----------------------------------------------------------------\n"
        f"Specific Formatting Requests: {formatting_instructions}\n"
        "----------------------------------------------------------------\n"
        f"Context Material: {context}\n"
        "----------------------------------------------------------------\n"
        "PROCESS INSTRUCTIONS:\n"
        "1. **Analyze & Plan**: Before writing, mentally outline the document to ensure it covers the topic comprehensively. Don't be brief; be thorough.\n"
        "2. **Structure**: specific headers must be chosen based on what best fits the narrative, do not blindly stick to the examples if they don't fit.\n"
        "3. **Visuals**: Ensure the CSS JSON provides a strict visual hierarchy (H1 >> H2 >> Body). No blue headings.\n"
        "4. **Execution**: Start the 'content' field immediately with the Title."
    )

    
    
    messages = [
        SystemMessage(content=system),
        HumanMessage(content=human),
    ]
    
    raw = await structured_llm.ainvoke(messages)
    
    if isinstance(raw, WhitepaperOutput):
        result = raw
    else:
        try:
            result = WhitepaperOutput.model_validate(raw)
        except ValidationError as e:
            logger.error("Structured output validation failed", exc_info=e)
            raise RuntimeError("LLM failed to produce valid structured output")
    
    content = clean_markdown(result.content)
    formatting = result.styles


    return content, formatting


    

# a cleaner function
def clean_markdown(text: str) -> str:

    text = text.strip()

    # check if the entire response is wrapped in ``` ... ```
    if text.startswith("```") and text.endswith("```"):
        lines = text.splitlines()
        
        # Get the language hint from the first line (e.g., ```markdown -> markdown)
        first_line = lines[0].strip().lower()
        
        # Only strip if it's explicitly 'markdown' or a generic empty fence.
        # This protects ```mermaid, ```python, etc., if they appear at the very start.
        if first_line == "```" or first_line.startswith("```markdown"):
            
            return "\n".join(lines[1:-1]).strip()
    
    return text