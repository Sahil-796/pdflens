from markdown_it import MarkdownIt
from bs4 import BeautifulSoup
import base64
import re

def add_styles(soup: BeautifulSoup, formatting: dict) -> str:
    tag_counters = {}

    for tag in soup.find_all(True):
        
        if tag.name == "div" and "pg-break" in tag.attrs.get("class", []):
            continue

        tagName = tag.name
        count = tag_counters[tagName] = tag_counters.get(tagName, 0) + 1

        classKey = f"{tagName}-{count}"

        global_style = formatting.get(tagName, {})
        tag_style = formatting.get(classKey, {})

        def merge_styles(global_styles: dict, elem_styles: dict) -> str:

            merged = {**global_styles, **elem_styles}
            return "; ".join(f"{k}: {v}" for k, v in merged.items())
        
        style_str = merge_styles(global_style, tag_style)

        tag["style"] = style_str
        tag["id"] = classKey

        # add "selectable" in class if applicable
        if tagName in ["p", "h1", "h2", "h3", "table", "pre", "ol", "ul", "blockquote"]:
            tag["class"] = "selectable"
        else:
            tag.attrs.pop("class", None)

    # Re-add styles and class for the page-break divs
    for br in soup.select("div.pg-break, section.pg-break"):
        br["style"] = "page-break-before: always; break-before: page; height:0; margin:0; padding:0;"
        br.attrs.pop("id", None)
        br["class"] = "pg-break"

    return str(soup)


def create_html(content: str, formatting: dict) -> str:
    try:
        
        content = process_mermaid_blocks(content)
        markdown = MarkdownIt().enable(['table'])
        html_content = markdown.render(content)
        soup = BeautifulSoup(html_content, 'html.parser')
        final_html = add_styles(soup, formatting)
        return final_html
    except Exception as e:
        print(f"An error occurred while creating the PDF: {e}")
        return ""
        
        

def process_mermaid_blocks(content: str) -> str:
    pattern = r"```mermaid\s+(.*?)```"  

    def replacer(match):
        graph_def = match.group(1).strip()
        b64 = base64.urlsafe_b64encode(graph_def.encode("utf8")).decode("ascii").rstrip("=")

        url = f"https://mermaid.ink/img/{b64}"

        return f"![Diagram]({url})"

    return re.sub(pattern, replacer, content, flags=re.DOTALL)
