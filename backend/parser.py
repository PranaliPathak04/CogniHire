import PyPDF2
import pytesseract
from pdf2image import convert_from_path
import tempfile, os

def extract_text_smart(file) -> str:
    # Save uploaded file to a temp path
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.read())
        tmp_path = tmp.name

    text = ""
    with open(tmp_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""

    if len(text.strip()) < 50:
        print("Scanned PDF detected, running OCR...")
        images = convert_from_path(tmp_path)
        for i, image in enumerate(images):
            text += f"\n--- Page {i+1} ---\n"
            text += pytesseract.image_to_string(image)

    os.unlink(tmp_path)  # clean up temp file
    return text