from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text_smart
from scorer import calculate_ats_score
from advisor import get_ai_advice, get_rewrite_suggestions, generate_interview_questions
from scraper import scrape_jd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd_text: str = Form(None),
    jd_url: str = Form(None)
):
    # 1. Get JD text — either from URL or direct input
    if jd_url:
        jd = scrape_jd(jd_url)
    elif jd_text:
        jd = jd_text
    else:
        return {"error": "Provide either a job description or a URL"}

    # 2. Extract resume text
    resume_text = extract_text_smart(resume.file)

    # 3. Score
    score = calculate_ats_score(resume_text, jd)

    # 4. All three AI calls
    advice = get_ai_advice(resume_text, jd, score["missing_skills"])
    rewrites = get_rewrite_suggestions(resume_text, score["missing_skills"])
    questions = generate_interview_questions(jd, score["missing_skills"])

    return {
        "score": score,
        "advice": advice,
        "rewrites": rewrites,
        "interview_questions": questions
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd_text: str = Form(None),
    jd_url: str = Form(None)
):
    # Add this debug line
    print(f"JD received: '{jd_text[:100] if jd_text else None}'")
    print(f"JD length: {len(jd_text) if jd_text else 0}")