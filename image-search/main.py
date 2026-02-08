from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import faiss
import numpy as np
import clip
import torch
from PIL import Image
from io import BytesIO
import os
import urllib.request

# -------------------------
# FastAPI setup
# -------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # prod ใช้ * ได้เลย
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Download FAISS assets
# -------------------------
BASE_URL = "https://github.com/chjnuw/projectM-search/releases/download/v1"
DATA_DIR = "/tmp/data"
os.makedirs(DATA_DIR, exist_ok=True)

FILES = {
    "index.faiss": "index.faiss",
    "movie_ids.npy": "movie_ids.npy",
}

for name, remote in FILES.items():
    path = os.path.join(DATA_DIR, name)
    if not os.path.exists(path):
        print(f"Downloading {remote}...")
        urllib.request.urlretrieve(f"{BASE_URL}/{remote}", path)

# -------------------------
# Load model & index
# -------------------------
device = "cpu"

print("Loading CLIP model...")
model, preprocess = clip.load("ViT-B/16", device=device)
model.eval()

print("Loading FAISS index...")
index = faiss.read_index(f"{DATA_DIR}/index.faiss")
movie_ids = np.load(f"{DATA_DIR}/movie_ids.npy", allow_pickle=True)

# -------------------------
# Utils
# -------------------------
def image_to_vector(file_bytes: bytes):
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    img = preprocess(img).unsqueeze(0).to(device)

    with torch.no_grad():
        vec = model.encode_image(img)
        vec /= vec.norm(dim=-1, keepdim=True)

    return vec.cpu().numpy().astype("float32")

# -------------------------
# API
# -------------------------
@app.post("/search-image")
async def search_image(file: UploadFile = File(...)):
    contents = await file.read()
    q = image_to_vector(contents)

    D, I = index.search(q, k=20)

    results = []
    for idx in I[0]:
        results.append(int(movie_ids[idx]))

    # unique + limit
    results = list(dict.fromkeys(results))[:6]

    return {"movie_ids": results}
