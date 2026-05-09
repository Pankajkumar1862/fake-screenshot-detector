from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from detector.metadata import analyze_metadata
from detector.ocr import extract_text
from detector.pixel_analysis import detect_manipulation

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()

    with open(f"uploads/{file.filename}", "wb") as f:
        f.write(contents)

    path = f"uploads/{file.filename}"

    metadata = analyze_metadata(path)
    text = extract_text(path)
    pixel = detect_manipulation(path)

    fake_score = 0

    if metadata["suspicious"]:
        fake_score += 30

    if pixel["possible_edit"]:
        fake_score += 40

    if pixel["edge_density"] > 1000000:
        fake_score += 20

    if len(text.strip()) > 100:
        fake_score += 10

    fake_score = min(fake_score, 100)

    return {
        "metadata": metadata,
        "text": text,
        "pixel_analysis": pixel,
        "fake_score": fake_score
    }