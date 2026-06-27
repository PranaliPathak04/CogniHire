from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text_smart
from scorer import calculate_ats_score
from advisor import get_ai_advice, get_rewrite_suggestions, generate_interview_questions
from scraper import scrape_jd
from job_search import search_all_roles
from advisor import predict_job_roles

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

    questions_list = [block.strip() for block in questions.strip().split("\n\n") if block.strip()]
    rewrites_list = [block.strip() for block in rewrites.strip().split("\n\n") if block.strip()]

    return {
        "score": score,
        "advice": advice,
        "rewrites": rewrites_list,
        "interview_questions": questions_list
    }

@app.get("/health")
def health():
    return {"status": "ok"}





@app.post("/jobs")
async def get_jobs(
    resume: UploadFile = File(...),
    location: str = Form("India")
):
    resume_text = extract_text_smart(resume.file)

    # Step 1 — LLM predicts roles
    predicted_roles = predict_job_roles(resume_text)
    print(f"Predicted roles: {predicted_roles}")

    # Step 2 — Search jobs for each role
    jobs = search_all_roles(predicted_roles, location)

    return {
        "jobs": jobs,
        "predicted_roles": predicted_roles
    }