from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import faiss
import numpy as np
import clip
import torch
from PIL import Image
from io import BytesIO

app = FastAPI()

# CORS (แก้ error ที่คุณเจอ)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cpu"
model, preprocess = clip.load("ViT-B/16", device=device)

index = faiss.read_index("index.faiss")
movie_ids = np.load("movie_ids.npy")

def image_to_vector(file_bytes):
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    img = preprocess(img).unsqueeze(0).to(device)

    with torch.no_grad():
        vec = model.encode_image(img)
        vec /= vec.norm(dim=-1, keepdim=True)

    return vec.cpu().numpy().astype("float32")

@app.post("/search-image")
async def search_image(file: UploadFile = File(...)):
    contents = await file.read()
    q = image_to_vector(contents)

    D, I = index.search(q, k=20)

    results = []
    for idx in I[0]:
        results.append(int(movie_ids[idx]))

    # unique movie ids
    results = list(dict.fromkeys(results))

    return {"movie_ids": results[:6]}