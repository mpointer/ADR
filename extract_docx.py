import zipfile
import re
import os

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml_content = z.read('word/document.xml').decode('utf-8')
            # Replace paragraph endings with newlines
            xml_content = xml_content.replace('</w:p>', '\n')
            xml_content = xml_content.replace('<w:tab/>', '\t')
            xml_content = xml_content.replace('<w:br/>', '\n')
            xml_content = xml_content.replace('<w:cr/>', '\n')
            text = re.sub('<[^<]+?>', '', xml_content)
            return text
    except Exception as e:
        return f"Error reading {path}: {str(e)}"

if __name__ == "__main__":
    files = [
        r"c:\Users\micha\Documents\GitHub\Antigravity\ADR\ADR Ref Architecture - High Level.docx",
        r"c:\Users\micha\Documents\GitHub\Antigravity\ADR\ADR Solutionizer - Prompt V3.docx",
        r"c:\Users\micha\Documents\GitHub\Antigravity\ADR\ADR Ref Architecture - Low Level.docx"
    ]
    with open("extracted_text.txt", "w", encoding="utf-8") as out:
        for f in files:
            out.write(f"--- START {os.path.basename(f)} ---\n")
            out.write(get_docx_text(f))
            out.write(f"\n--- END {os.path.basename(f)} ---\n\n")
