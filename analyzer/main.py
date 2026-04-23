from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os

from services import audio, analyzer, rhythm, generator, packager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class HitObjectSchema(BaseModel):
    x: int
    y: int
    time: int
    new_combo: bool = False

class GenerateRequestSchema(BaseModel):
    onsets: List[float]
    bpm: float
    offset: int
    grid_size: int = 4
    start_time: int = 0
    end_time: Optional[int] = None

class PackageRequestSchema(BaseModel):
    file_id: str
    original_filename: str
    bpm: float
    offset: int
    hit_objects: List[HitObjectSchema]

    title: str = "Unknown Title"
    artist: str = "Unknown Artist"
    creator: str = "AI_Mapper"

    ar: float = 9.0
    hp: float = 5.0
    od: float = 7.0
    cs: float = 4.0


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    data = audio.save_upload(file)
    return {"file_id": data["file_id"], "filename": data["filename"]}


@app.get("/api/analyze/bpm")
async def analyze_bpm(file_id: str):
    path = audio.get_path_by_id(file_id)
    if not path:
        raise HTTPException(status_code=404, detail="File expired or not found")

    return analyzer.estimate_bpm(path)


@app.get("/api/analyze/onsets")
async def analyze_onsets(file_id: str, threshold: float = 0.3):
    path = audio.get_path_by_id(file_id)
    if not path:
        raise HTTPException(status_code=404, detail="File expired or not found")
    try:
        data = rhythm.get_raw_onsets(path, threshold)
        return {"onsets": data}
    except Exception as e:
        return {"error": str(e)}


@app.post("/api/analyze/offset")
async def get_recommended_offset(onsets: List[float]):
    if not onsets:
        return {"offset": 0}
    return {"offset": int(onsets[0] * 1000)}


@app.post("/api/generate/objects")
async def generate_objects(req: GenerateRequestSchema):
    objects = generator.generate_hit_objects(
        req.onsets, req.bpm, req.offset, req.grid_size, req.start_time, req.end_time
    )
    return {"hit_objects": objects}


@app.post("/api/package")
async def package_map(request: PackageRequestSchema):
    audio_path = audio.get_path_by_id(request.file_id)
    if not audio_path:
        raise HTTPException(status_code=404, detail="Audio file not found or expired")
    try:
        data_dict = request.model_dump()
        osz_filename = packager.create_osz_package(audio_path, data_dict)
        return {"download_url": f"/api/download/{osz_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Packaging failed: {str(e)}")


@app.get("/api/download/{filename}")
async def download_package(filename: str):
    file_path = os.path.join(packager.OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )


@app.get("/api/audio/{file_id}")
async def get_audio_file(file_id: str):
    file_path = audio.get_path_by_id(file_id)
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")

    return FileResponse(path=file_path)