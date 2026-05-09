# from sentence_transformers import SentenceTransformer, util
# import spacy, json
# from dotenv import load_dotenv
# import os

# load_dotenv()

# nlp = spacy.load(os.getenv("MODEL_PATH"))
# # After loading the model, add this:
# print("Pipeline:", nlp.pipe_names)
# print("Patterns loaded:", len(ruler.patterns) if "entity_ruler" in nlp.pipe_names else "NO RULER")

# # After get_skills(), add this:
# def get_skills(text: str) -> set:
#     doc = nlp(text)
#     all_ents = [(e.text, e.label_, e.ent_id_) for e in doc.ents]
#     print("All entities found:", all_ents)
#     return set([e.ent_id_ for e in doc.ents if e.label_ == "SKILL" and e.ent_id_])

# # Re-attach EntityRuler with taxonomy
# if "entity_ruler" not in nlp.pipe_names:
#     ruler = nlp.add_pipe("entity_ruler", before="ner")
#     with open(os.path.join(os.getenv("MODEL_PATH"), "taxonomy.json")) as f:
#         taxonomy = json.load(f)
#     patterns = []
#     for cat in taxonomy["categories"].values():
#         for subcat in cat["subcategories"].values():
#             for skill in subcat.get("skills", []):
#                 patterns.append({"label": "SKILL", "pattern": skill["canonical_name"], "id": skill["id"]})
#                 for alias in skill.get("aliases", []):
#                     patterns.append({"label": "SKILL", "pattern": alias, "id": skill["id"]})
#     ruler.add_patterns(patterns)

# sbert = SentenceTransformer("all-MiniLM-L6-v2")

# def get_skills(text: str) -> set:
#     doc = nlp(text)
#     return set([e.ent_id_ for e in doc.ents if e.label_ == "SKILL" and e.ent_id_])

# def calculate_ats_score(resume_text: str, jd_text: str) -> dict:
#     resume_skills = get_skills(resume_text)
#     jd_skills = get_skills(jd_text)

#     matched = resume_skills & jd_skills
#     missing = jd_skills - resume_skills
#     keyword_score = (len(matched) / len(jd_skills) * 100) if jd_skills else 0

#     res_vec = sbert.encode(resume_text)
#     jd_vec = sbert.encode(jd_text)
#     semantic_score = util.cos_sim(res_vec, jd_vec).item() * 100

#     return {
#         "ats_score": round((keyword_score + semantic_score) / 2, 2),
#         "keyword_score": round(keyword_score, 2),
#         "semantic_score": round(semantic_score, 2),
#         "matched_skills": list(matched),
#         "missing_skills": list(missing),
#     }

from sentence_transformers import SentenceTransformer, util
import spacy, json
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR,"Resume_Parser_Model")
TAXONOMY_PATH = os.path.join(MODEL_PATH, "taxonomy.json")

# Load model
nlp = spacy.load(MODEL_PATH)

# Always add ruler fresh — no if check
ruler = nlp.add_pipe("entity_ruler", before="ner")

# Load taxonomy and build patterns
with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
    taxonomy = json.load(f)

patterns = []
for cat in taxonomy["categories"].values():
    for subcat in cat["subcategories"].values():
        for skill in subcat.get("skills", []):
            patterns.append({"label": "SKILL", "pattern": skill["canonical_name"], "id": skill["id"]})
            for alias in skill.get("aliases", []):
                patterns.append({"label": "SKILL", "pattern": alias, "id": skill["id"]})

ruler.add_patterns(patterns)
print(f"Pipeline: {nlp.pipe_names}")
print(f"Patterns loaded: {len(patterns)}")

sbert = SentenceTransformer("all-MiniLM-L6-v2")

def get_skills(text: str) -> set:
    doc = nlp(text)
    all_ents = [(e.text, e.label_, e.ent_id_) for e in doc.ents]
    print("Entities found:", all_ents)
    return set([e.ent_id_ for e in doc.ents if e.label_ == "SKILL" and e.ent_id_])

def calculate_ats_score(resume_text: str, jd_text: str) -> dict:
    print(f"JD text sample: '{jd_text[:100]}'") 
    resume_skills = get_skills(resume_text)
    jd_skills = get_skills(jd_text)
    matched = resume_skills & jd_skills
    missing = jd_skills - resume_skills
    keyword_score = (len(matched) / len(jd_skills) * 100) if jd_skills else 0
    res_vec = sbert.encode(resume_text)
    jd_vec = sbert.encode(jd_text)
    semantic_score = util.cos_sim(res_vec, jd_vec).item() * 100
    return {
        "ats_score": round((keyword_score + semantic_score) / 2, 2),
        "keyword_score": round(keyword_score, 2),
        "semantic_score": round(semantic_score, 2),
        "matched_skills": list(matched),
        "missing_skills": list(missing),
    }