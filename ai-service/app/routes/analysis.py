from fastapi import APIRouter, File, UploadFile, HTTPException
import cv2
import numpy as np
from ..services.image_analyzer import analyze_image

router = APIRouter()

@router.post("/analyze")
async def analyze_photo(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image.")

        # Ensure image isn't too massive to prevent memory DOS
        if img.shape[0] > 2000 or img.shape[1] > 2000:
            scale = 2000 / max(img.shape[0], img.shape[1])
            img = cv2.resize(img, None, fx=scale, fy=scale)

        result = analyze_image(img)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")
