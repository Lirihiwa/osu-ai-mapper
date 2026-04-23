import os
import shutil
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "temp_uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def save_upload(file: UploadFile):
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1]
    storage_name = f"{file_id}{extension}"
    file_path = os.path.join(UPLOAD_DIR, storage_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "file_id": file_id,
        "filename": file.filename,
        "storage_path": file_path
    }

def get_path_by_id(file_id: str):
    for file in os.listdir(UPLOAD_DIR):
        if file.startswith(file_id):
            return os.path.abspath(os.path.join(UPLOAD_DIR, file))
    return None

def cleanup_temp(file_id: str):
    path = get_path_by_id(file_id)
    if path and os.path.exists(path):
        os.remove(path)