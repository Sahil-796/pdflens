# import os
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
    styles: Dict[str, str]


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
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
        To ensure a professional look, you must strictly enforce:
        1. **Color Palette**: Use ONLY `#000000` (Black) and `#2b2b2b` (Dark Grey). **NEVER use blue** for headings.
        2. **Font Hierarchy**: 
           - H1 must be significantly larger (e.g., 24pt+) than H2.
           - H2 must be distinct (e.g., 18pt) from body text.
        3. **Spacing**: Use CSS margins to create "breath" between sections.
        
        ### CSS JSON REQUIREMENTS
        - Keys: HTML tags (h1, h2, h3, p, ul, li, table, th, td, blockquote).
        - Values: Valid CSS strings (kebab-case).
        
        ### REQUIRED STYLE SPECS (Incorporate these into your JSON):
        - **@page**: { "size": "A4", "margin": "2.5cm" } (Note: Put this in the CSS logic if possible, or assume global default).
        - **body**: font-family: "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; font-size: 11pt;
        - **h1**: font-size: 26pt; font-weight: 700; color: #111; margin-bottom: 0.8em; border-bottom: 2px solid #000; padding-bottom: 0.3em;
        - **h2**: font-size: 18pt; font-weight: 600; color: #333; margin-top: 1.5em; margin-bottom: 0.6em;
        - **h3**: font-size: 14pt; font-weight: 600; color: #444; margin-top: 1.2em; margin-bottom: 0.5em; text-transform: uppercase; letter-spacing: 0.5px;
        - **p**: margin-bottom: 1em; text-align: justify;
        - **ul**: margin-bottom: 1em; padding-left: 1.5em;
        - **li**: margin-bottom: 0.4em;
        - **table**: width: 100%; border-collapse: collapse; margin: 2em 0; font-size: 10pt;
        - **th**: background-color: #f0f0f0; border-bottom: 2px solid #333; padding: 10px; text-align: left; font-weight: bold;
        - **td**: border-bottom: 1px solid #ddd; padding: 8px; vertical-align: top;
        - **blockquote**: border-left: 4px solid #333; padding-left: 1em; font-style: italic; color: #555; background: #f9f9f9; padding: 1em;
    
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