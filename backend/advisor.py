from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def _call_groq(system: str, user: str) -> str:
    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user}
        ]
    )
    return res.choices[0].message.content

def get_ai_advice(resume_text: str, jd_text: str, missing_skills: list) -> str:
    return _call_groq(
        system="You are a Senior Technical Recruiter. Give punchy, actionable resume advice.",
        user=f"Resume: {resume_text}\n\nJob Description: {jd_text}\n\nMissing Skills: {missing_skills}"
    )

def get_rewrite_suggestions(resume_text: str, missing_skills: list) -> str:
    return _call_groq(
        system="You are an expert resume writer.",
        user=f"""Rewrite weak bullet points in this resume to better highlight these missing skills: {missing_skills}.
Format each suggestion as:
ORIGINAL: ...
REWRITTEN: ...

Resume: {resume_text}"""
    )

def generate_interview_questions(jd_text: str, missing_skills: list) -> str:
    return _call_groq(
        system="You are a senior technical interviewer.",
        user=f"""Generate 10 interview questions for this job.
Mix: 3 technical (focus on {missing_skills}), 4 conceptual, 3 behavioral.
For each add a one-line answering tip.
JD: {jd_text}"""
    )