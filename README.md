# CogniHire — AI Based Resume Analyser

> Upload your resume. Paste a job description. Get your ATS score, skill gaps, rewritten bullet points, and interview prep — in seconds.

![Tech Stack](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=flat-square)
![spaCy](https://img.shields.io/badge/spaCy-Custom_NER-09A3D5?style=flat-square&logo=spacy)

---

## What It Does

Most resume tools do keyword matching. CogniHire goes further:

- **ATS Scoring** — Hybrid score combining keyword match + semantic similarity (sentence-transformers)
- **Skill Gap Analysis** — Custom-trained spaCy NER model extracts skills from both resume and JD, identifies what's missing
- **AI Feedback** — Groq (Llama 3.3 70B) gives actionable recruiter-style feedback
- **Resume Rewrites** — Weak bullet points rewritten to better highlight missing skills
- **Interview Prep** — 10 role-specific questions (technical + behavioral) with answering tips
- **JD Scraping** — Paste a LinkedIn/Naukri URL instead of copying the job description manually

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| NLP | Custom spaCy NER model + EntityRuler + skill taxonomy |
| Embeddings | `all-MiniLM-L6-v2` via sentence-transformers |
| LLM | Llama 3.3 70B via Groq API |
| PDF Parsing | PyPDF2 + Tesseract OCR (fallback for scanned PDFs) |
| JD Scraping | BeautifulSoup + Requests |

---

## Architecture

```
User uploads PDF + JD
        │
        ▼
┌─────────────────────────────────────────┐
│              FastAPI Backend            │
│                                         │
│  parser.py  →  extract_text_smart()    │
│      PyPDF2 → OCR fallback (Tesseract) │
│                                         │
│  scorer.py  →  calculate_ats_score()   │
│      spaCy NER + EntityRuler           │
│      → skill extraction (resume + JD)  │
│      → cosine similarity (SBERT)       │
│      → hybrid ATS score               │
│                                         │
│  advisor.py →  3 Groq API calls        │
│      → AI feedback                     │
│      → bullet point rewrites           │
│      → interview questions             │
│                                         │
│  scraper.py →  BeautifulSoup           │
│      → LinkedIn / Naukri / Indeed      │
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│            React Frontend               │
│  Score rings · Skill badges            │
│  Rewrite cards · Interview accordion   │
│  Dark / Light mode                     │
└─────────────────────────────────────────┘
```

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Tesseract OCR installed ([Windows](https://github.com/UB-Mannheim/tesseract/wiki) / [Mac](https://formulae.brew.sh/formula/tesseract))
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:
```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Project Structure

```
CogniHire/
├── backend/
│   ├── Resume_Parser_Model/     # Custom trained spaCy NER model
│   │   ├── ner/
│   │   ├── tok2vec/
│   │   ├── vocab/
│   │   ├── taxonomy.json        # Skill taxonomy with aliases
│   │   └── config.cfg
│   ├── main.py                  # FastAPI routes
│   ├── parser.py                # PDF text extraction + OCR
│   ├── scorer.py                # ATS scoring engine
│   ├── advisor.py               # Groq LLM calls
│   ├── scraper.py               # JD URL scraper
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx              # Full UI — single file
│       └── index.css
└── README.md
```

---

## API Reference

### `POST /analyze`

| Field | Type | Description |
|---|---|---|
| `resume` | File | PDF resume (required) |
| `jd_text` | Form | Job description as plain text |
| `jd_url` | Form | Job posting URL (LinkedIn, Naukri, Indeed) |

**Response:**
```json
{
  "score": {
    "ats_score": 79.54,
    "keyword_score": 87.50,
    "semantic_score": 71.59,
    "matched_skills": ["react", "nodejs", "python"],
    "missing_skills": ["mongodb", "docker"]
  },
  "advice": "...",
  "rewrites": "...",
  "interview_questions": "..."
}
```

---

## What Makes This Different

Most resume analysers are just keyword matchers wrapped in a UI. CogniHire uses a **custom-trained spaCy NER model** with a hand-curated skill taxonomy to extract and normalize skills across different aliases (`React`, `React.js`, `ReactJS` → same skill). Combined with semantic similarity scoring, it understands *meaning*, not just exact words.

---

## Author

**Pranali Pathak**
[GitHub](https://github.com/PranaliPathak04)

---

*Built from scratch — from a Google Colab notebook to a full-stack production-ready web app.*
