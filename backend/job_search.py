import requests
import os
from dotenv import load_dotenv

load_dotenv()

JSEARCH_KEY = os.getenv("JSEARCH_API_KEY")

def search_jobs_by_role(role: str, location: str = "India") -> list:
    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": JSEARCH_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    params = {
        "query": f"{role} in {location}",
        "num_pages": "1",
        "page": "1",
        "date_posted": "month"
    }
    try:
        r = requests.get(url, headers=headers, params=params, timeout=10)
        data = r.json()
        jobs = data.get("data", [])
        result = []
        for job in jobs[:3]:  # 3 per role, 5 roles = 15 total
            result.append({
                "title": job.get("job_title", ""),
                "company": job.get("employer_name", ""),
                "location": job.get("job_city", "") or job.get("job_country", ""),
                "employment_type": job.get("job_employment_type", ""),
                "apply_url": job.get("job_apply_link", ""),
                "description": (job.get("job_description", "") or "")[:5000],
                "required_skills": job.get("job_highlights", {}).get("Qualifications", [])[:4],
                "matched_role": role,  # tag which role this came from
            })
        return result
    except Exception as e:
        print(f"JSearch error for role '{role}': {e}")
        return []

def search_all_roles(roles: list, location: str = "India") -> list:
    all_jobs = []
    seen_urls = set()
    for role in roles:
        jobs = search_jobs_by_role(role, location)
        for job in jobs:
            # Deduplicate by apply URL
            if job["apply_url"] not in seen_urls:
                seen_urls.add(job["apply_url"])
                all_jobs.append(job)
    return all_jobs