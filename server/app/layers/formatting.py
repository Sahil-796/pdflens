import json
import logging

logger = logging.getLogger(__name__)
import re
from dotenv import load_dotenv

load_dotenv()
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")


async def generate_formatting_kwargs(
    formatting_instructions: str, content: str, general: str
) -> dict:
    """Generate visually consistent CSS-like formatting kwargs for WeasyPrint.

    Focus on spacing harmony, readable margins, and consistent hierarchy.
    """
    try:
        system = """
You are an expert typographer and PDF layout designer generating CSS-compatible
style dictionaries for WeasyPrint. Your goal is to ensure a visually balanced,
well-spaced, and professional layout for converted markdown → HTML → PDF.

Output Rules:
- Output ONLY a valid JSON object (no markdown, comments, or text).
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

Return only the final JSON object.
"""

        human = """
Convert the following formatting instructions into a JSON dictionary for WeasyPrint:

Formatting instructions:
{text}

Markdown content to match:
{content}

General instructions for formatting:
{genreal_instructions}

Remember:
- Include default 'body', 'p', 'h1', 'h2', 'blockquote', 'ul', and 'table' styles.
- Respect the user's instructions but keep the layout visually balanced.
- Apply proper vertical spacing between headings, paragraphs, lists, and tables.
"""

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system),
                ("human", human),
            ]
        )

        chain = prompt | llm
        response = await chain.ainvoke(
            {
                "text": formatting_instructions,
                "content": content,
                "genreal_instructions": general,
            }
        )

        # Extract JSON safely
        kwargs_json = response.content.strip()
        match = re.search(r"\{[\s\S]*\}", kwargs_json)
        if not match:
            raise ValueError("No valid JSON object found in LLM output")

        formatting_kwargs = json.loads(match.group(0))
        return formatting_kwargs

    except Exception as e:
        logger.error("Error in generate_formatting_kwargs: %s", e, exc_info=True)
        raise
