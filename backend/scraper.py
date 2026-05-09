import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0"}

def scrape_jd(url: str) -> str:
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")

        # Try LinkedIn first, then Naukri, then fallback
        selectors = [
            ".description__text",        # LinkedIn
            ".job-desc",                  # Naukri
            ".jobsearch-jobDescriptionText",  # Indeed
            "article",                    # generic fallback
        ]
        for selector in selectors:
            el = soup.select_one(selector)
            if el:
                return el.get_text(separator=" ", strip=True)

        return soup.get_text(separator=" ", strip=True)[:3000]
    except Exception as e:
        return f"Error scraping URL: {str(e)}"