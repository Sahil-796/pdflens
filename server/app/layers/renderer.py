import markdown2

# from weasyprint import HTML

# # Suppose html_content is generated from markdown
# # and formatting_css is generated from LLM as JSON
# css_styles = "\n".join([f"{k}: {v};" for k, v in formatting_css.items()])
# html_with_style = f"<html><head><style>{css_styles}</style></head><body>{html_content}</body></html>"

# pdf_bytes = HTML(string=html_with_style).write_pdf()
# # pdf_bytes can now be returned in FastAPI response directly


def create_html(content: str, formatting: str):
    
    # md -> html -> pdf using markdown2.markdown and reportLabs

    try:
        html_content = markdown2.markdown(content, extras=['tables', 'fenced-code-blocks'])

        pass
    except Exception as e:
        print(f"An error occurred while creating the PDF: {e}")
        return ""
