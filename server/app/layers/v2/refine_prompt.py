import os
import re
import logging
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

logger = logging.getLogger(__name__)
load_dotenv()

HF_API_KEY = os.getenv("HF_TOKEN")

# HuggingFace Hosted Inference Client
client = InferenceClient(
    api_key=HF_API_KEY,
)

MODEL_ID = "Qwen/Qwen2-7B-Instruct"


async def refine_prompt(user_input: str) -> tuple:
    try:
        system = """
            You are a world-class AI specializing in preparing user requests for a PDF-generation RAG pipeline. 
            Your job is to separate the user’s request into FOUR powerful components that improve retrieval, formatting, and structure.
            
            Your output MUST strictly follow this schema:
            
            ────────────────────────────────────────────
            1. Content Description  
            Describe WHAT the document is about in generalized semantic terms.
            This will be used for retrieval, so expand the meaning beyond surface words.
            Example: “My assignment on cloud” → “cloud computing fundamentals, distributed systems, virtualization, cloud architecture overview”.
            IMPORTANT SEMANTIC INTERPRETATION RULE:
            
            When the user asks to "make a PDF on <X>" or "write a document on <X>":
            
            - Interpret <X> as the SUBJECT MATTER of the document.
            - The document must explain, describe, or teach <X> itself.
            
            Do NOT reinterpret <X> as:
            - A tool used to generate PDFs
            - A workflow, pipeline, or automation mechanism
            - An application domain unless explicitly stated
            
            Only interpret <X> as an instrument or method if the user explicitly uses
            phrases such as:
            - "using <X>"
            - "with <X>"
            - "via <X>"
            - "PDF generation using <X>"

            ────────────────────────────────────────────
            2. Formatting Instructions  
            Only VISUAL details.  
            Colors, fonts, alignments, spacing, theme, styles, margins.
            Do NOT include structural instructions like lists, tables, sections, order, or hierarchy.
            
            ────────────────────────────────────────────
            3. General Instructions  
            STRUCTURE + ORGANIZATION + BEHAVIOR.
            Do NOT introduce document components (e.g., Table of Contents, appendices, summaries)
            unless explicitly requested or clearly required by document length.

            ────────────────────────────────────────────
            4. RAG Query Expansion (critical for high recall)  
            Generate 10–20 keywords & semantic expansions that improve vector search.
            Goal: Even if the user says “solve my assignment” and the uploaded document does NOT contain the word “assignment”, retrieval should still work.
            
            Expand into synonyms, academic equivalents, topic families, inferred concepts, and requirement-like phrases.
            
            Examples:
            - “assignment” → “homework, coursework, academic tasks, exercises, study sheet, written task”
            - “cloud” → “virtualization, distributed computing, AWS, Azure, serverless, cloud infrastructure”
            - “research summary” → “review, literature survey, paper analysis, academic overview”
            - “networking” → “OSI model, TCP/IP, routers, switching, LAN/WAN, packet flow”
            
            ────────────────────────────────────────────
            
            Your output MUST be formatted exactly:
            
            Content Description: …
            Formatting Instructions: …
            General Instructions: …
            RAG Query Expansion: …
            """

        human = f"Analyze the following user request:\n\n{user_input}\n\n"

        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": human},
        ]

        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=messages,
            max_tokens=1024,
            temperature=0.2,
        )

        result = response.choices[0].message["content"].strip()

        # Extract structured parts using regex
        def extract(section):
            pattern = rf"{section}:\s*(.*?)(?=Content Description:|Formatting Instructions:|General Instructions:|RAG Query Expansion:|$)"
            match = re.search(pattern, result, re.DOTALL | re.IGNORECASE)
            return match.group(1).strip() if match else ""

        return (
            extract("Content Description"),
            extract("Formatting Instructions"),
            extract("General Instructions"),
            extract("RAG Query Expansion"),
        )

    except Exception as e:
        logger.error(f"Error refining prompt: {e}", exc_info=True)
        raise
