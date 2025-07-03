import requests
from bs4 import BeautifulSoup

# Strapi ayarları
STRAPI_URL = "https://senin-strapi-domainin.com/api/tables"  # <-- Burayı kendi Strapi API adresinle değiştir
STRAPI_TOKEN = "STRAPI_API_TOKEN"  # <-- Burayı kendi Strapi API token'ınla değiştir

# Scraping yapılacak sayfa
url = "https://womensleague.ge/"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

table = soup.find("table")
rows = table.find_all("tr")[1:]  # Başlık hariç

for row in rows:
    cols = row.find_all("td")
    if not cols or len(cols) < 11:
        continue

    # Takım logo ve adı
    club_img = cols[1].find("img")["src"] if cols[1].find("img") else ""
    club_name = cols[1].text.strip().replace('\n', '').replace('\r', '')

    # Sonraki maç
    next_match_a = cols[10].find("a")
    next_match_name = next_match_a.text.strip() if next_match_a else ""
    next_match_link = "https://womensleague.ge" + next_match_a["href"] if next_match_a else ""

    data = {
        "position": int(cols[0].text.strip().replace('.', '')),
        "club_logo": club_img,
        "club_name": club_name,
        "played": int(cols[2].text.strip()),
        "win": int(cols[3].text.strip()),
        "draw": int(cols[4].text.strip()),
        "loss": int(cols[5].text.strip()),
        "goals_for": int(cols[6].text.strip()),
        "goals_against": int(cols[7].text.strip()),
        "goal_difference": cols[8].text.strip(),
        "points": int(cols[9].text.strip()),
        "next_match_name": next_match_name,
        "next_match_link": next_match_link,
    }

    headers = {
        "Authorization": f"Bearer {STRAPI_TOKEN}",
        "Content-Type": "application/json"
    }
    res = requests.post(STRAPI_URL, json={"data": data}, headers=headers)
    print(f"{club_name}: {res.status_code} - {res.text}") 