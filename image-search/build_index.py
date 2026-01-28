import clip
import torch
import faiss
import numpy as np
import requests
import dotenv
from dotenv import load_dotenv
import os
from PIL import Image
from io import BytesIO
# =====================
# CONFIG
# =====================
load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/16", device=device)

# =====================
# FETCH MOVIE IMAGES (ฉากในหนัง)
# =====================
def fetch_movie_images(movie_id, max_images=5):
    res = requests.get(
        f"{TMDB_BASE}/movie/{movie_id}/images",
        params={"api_key": TMDB_API_KEY},
        timeout=10
    )

    if res.status_code != 200:
        return []

    data = res.json()
    images = []

    # ฉากในหนัง (สำคัญที่สุด)
    for b in data.get("backdrops", [])[:3]:
        images.append(f"{IMAGE_BASE}{b['file_path']}")

    # poster เสริม
    for p in data.get("posters", [])[:2]:
        images.append(f"{IMAGE_BASE}{p['file_path']}")

    return images[:max_images]

# =====================
# TMDB FETCH
# =====================
def fetch_movies(start_year=1990, end_year=2024, pages_per_year=2):
    movies = []
    seen = set()

    for year in range(start_year, end_year + 1):
        for page in range(1, pages_per_year + 1):
            print(f"🌐 year {year} page {page}")

            res = requests.get(
                f"{TMDB_BASE}/discover/movie",
                params={
                    "api_key": TMDB_API_KEY,
                    "language": "en-US",
                    "sort_by": "popularity.desc",
                    "primary_release_year": year,
                    "page": page
                },
                timeout=10
            )

            if res.status_code != 200:
                print("❌ HTTP error", res.status_code)
                continue

            data = res.json()
            if "results" not in data:
                continue

            for m in data["results"]:
                if m["id"] in seen:
                    continue

                images = fetch_movie_images(m["id"])

                if images:
                    seen.add(m["id"])
                    movies.append({
                        "id": m["id"],
                        "images": images
                    })

    return movies

# =====================
# IMAGE → VECTOR
# =====================
def image_to_vector(url: str):
    img = Image.open(BytesIO(requests.get(url, timeout=10).content)).convert("RGB")
    img = preprocess(img).unsqueeze(0).to(device)

    with torch.no_grad():
        vec = model.encode_image(img)
        vec /= vec.norm(dim=-1, keepdim=True)

    return vec.cpu().numpy()[0]

# =====================
# BUILD INDEX
# =====================
MOVIES = fetch_movies(
    start_year=1990,
    end_year=2024,
    pages_per_year=2
)

vectors = []
movie_ids = []

for m in MOVIES:
    for img_url in m["images"]:
        try:
            print(f"📥 movie {m['id']} image")
            vectors.append(image_to_vector(img_url))
            movie_ids.append(m["id"])
        except Exception as e:
            print("❌ skip", m["id"], e)

# 🔒 กัน FAISS พัง
if len(vectors) == 0:
    raise RuntimeError("❌ No vectors created (check TMDB API key)")

vectors = np.array(vectors).astype("float32")

index = faiss.IndexFlatIP(vectors.shape[1])
index.add(vectors)

faiss.write_index(index, "index.faiss")
np.save("movie_ids.npy", movie_ids)

print(f"✅ index ready ({len(movie_ids)} images / {len(set(movie_ids))} movies)")