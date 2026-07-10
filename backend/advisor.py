from groq import Groq
from dotenv import load_dotenv
import os
import json

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
         system="""You are an expert resume editor for one-page technical resumes.
 
ABSOLUTE RULE - NEVER VIOLATE THIS: You must NEVER invent numbers, percentages, metrics, user counts,
or outcomes that are not explicitly stated in the original resume text. Do not write "20% increase",
"500+ users", "90% accuracy", "30% reduction" or ANY other number unless that exact number already
appears in the original resume. Fabricated metrics are a serious resume integrity problem - the
candidate could be asked about that number in an interview and would have no real answer. If you do
not know the real outcome, do NOT make one up. Improve clarity and specificity using only TRUE
information already present in the resume or naturally inferable from listed tech stacks.
 
Your job is to make bullet points more specific and clear, not to add fake achievements.
You ONLY rewrite bullets that have a genuine weakness:
- vague action verbs (Built, Worked on, Helped with, Developed) with no real specificity
- tech stack used in the project but not mentioned in this particular bullet, when it IS listed elsewhere
  in the resume (e.g. in a tech stack tag or skills section) for that same project
- generic phrasing that could describe any project, when a more specific true detail is available elsewhere in the resume
 
If a bullet already names the project, the tech stack, and is specific - it is ALREADY STRONG. Skip it
entirely, do not touch it, do not invent achievements to "improve" it further.
 
Do NOT repeat the project name inside the rewritten bullet text if that project name is already used as a
heading or title directly above the bullet in the resume. Stating the project name twice (once as the
heading, once again inside the bullet) is redundant and looks unpolished. The bullet should describe the
work and tech stack, not restate the title that's already visible right above it.
 
Length should follow naturally from what's needed - do not artificially shorten or lengthen.""",
        user=f"""Review this resume and identify ONLY bullets that are genuinely weak (vague verbs, missing tech
stack that IS mentioned elsewhere for that project, generic phrasing). Skip bullets that are already strong,
even if that means returning very few rewrites or none at all.
 
You may incorporate these missing skills ONLY if there is real evidence elsewhere in the resume that the
candidate has used them for that specific project (e.g. listed in a tech stack tag): {missing_skills}
Do NOT add a skill to a project's bullet if there's no evidence the candidate used it there.
 
NEVER add specific numbers, percentages, or metrics unless that exact number is already present in the
original resume text.
 
Format strictly as repeating blocks, nothing else:
ORIGINAL: [exact original line from the resume]
REWRITTEN: [improved line - using only true information, no fabricated metrics]
REASON: [one short phrase, e.g. "vague verb" or "tech stack listed but not mentioned in bullet"]
 
Resume: {resume_text}"""
    )


def generate_interview_questions(jd_text: str, missing_skills: list) -> str:
    return _call_groq(
        system="You are a senior technical interviewer.",
        user=f"""Generate exactly 10 interview questions for this job.
Mix: 3 technical (focus on {missing_skills}), 4 conceptual, 3 behavioral.
For each question add a one-line answering tip.

Format each question EXACTLY like this, nothing else:
QUESTION: <question text>
TIP: <one-line tip>
CATEGORY: <Technical|Conceptual|Behavioral>

No intro sentence, no numbering, no extra text.
JD: {jd_text}"""
    )

def predict_job_roles(resume_text: str) -> list:
    response = _call_groq(
        system="You are a career counselor. Respond ONLY with a JSON array of strings. No explanation, no markdown, no backticks.",
        user=f"""Based on this resume, predict the top 5 most suitable job roles this person should apply for.
Return ONLY a JSON array like: ["Full Stack Developer", "React Developer", "Frontend Engineer"]
Resume: {resume_text[:2000]}"""
    )
    try:
        # Clean response just in case
        clean = response.strip().replace("```json", "").replace("```", "").strip()
        roles = json.loads(clean)
        return roles[:5] if isinstance(roles, list) else []
    except:
        # Fallback if parsing fails
        return ["Software Engineer", "Full Stack Developer", "Frontend Developer"]