import cv2
import numpy as np
import math

def analyze_image(img: np.ndarray) -> dict:
    # 1. Blur detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    if variance < 50.0:  # Arbitrary threshold for MVP
        return {
            "success": False,
            "imageQuality": {"usable": False},
            "faceDetected": False,
            "observations": [],
            "message": "Image is too blurry for reliable analysis. Please upload a clearer photo.",
            "disclaimer": "These are image-based observations and are not a medical diagnosis."
        }

    # 2. Brightness detection
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    v_channel = hsv[:, :, 2]
    avg_brightness = np.mean(v_channel)
    
    if avg_brightness < 40:
        return {
            "success": False,
            "imageQuality": {"usable": False},
            "faceDetected": False,
            "observations": [],
            "message": "Image is too dark. Please take a photo in better lighting.",
            "disclaimer": "These are image-based observations and are not a medical diagnosis."
        }

    # 3. Face Detection
    face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(face_cascade_path)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    if len(faces) == 0:
        return {
            "success": False,
            "imageQuality": {"usable": False},
            "faceDetected": False,
            "observations": [],
            "message": "Please upload a clearer front-facing photo with the face visible.",
            "disclaimer": "These are image-based observations and are not a medical diagnosis."
        }

    # Analyze the largest face region
    (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
    face_roi = img[y:y+h, x:x+w]
    face_hsv = hsv[y:y+h, x:x+w]
    face_gray = gray[y:y+h, x:x+w]

    observations = []

    # 4. Shine (High V channel values)
    face_v = face_hsv[:, :, 2]
    high_brightness_pixels = np.sum(face_v > 200)
    total_pixels = face_v.size
    shine_ratio = high_brightness_pixels / total_pixels

    if shine_ratio > 0.15:
        observations.append({
            "type": "visible_shine",
            "level": "high",
            "description": "High visible shine detected in parts of the analyzed face region."
        })
    elif shine_ratio > 0.05:
        observations.append({
            "type": "visible_shine",
            "level": "moderate",
            "description": "Moderate visible shine is present in parts of the analyzed face region."
        })
    else:
        observations.append({
            "type": "visible_shine",
            "level": "low",
            "description": "Low visible shine observed."
        })

    # 5. Texture variation (Canny edge density)
    edges = cv2.Canny(face_gray, 50, 150)
    edge_ratio = np.sum(edges > 0) / total_pixels
    if edge_ratio > 0.08:
        observations.append({
            "type": "texture_variation",
            "level": "high",
            "description": "High texture variation is visible in the analyzed face region."
        })
    elif edge_ratio > 0.03:
        observations.append({
            "type": "texture_variation",
            "level": "some",
            "description": "Some texture variation is visible in the analyzed face region."
        })

    # 6. Color variation (Std dev of Hue)
    face_h = face_hsv[:, :, 0]
    std_h = np.std(face_h)
    if std_h > 20:
        observations.append({
            "type": "color_variation",
            "level": "high",
            "description": "Noticeable color variation is visible."
        })
    else:
         observations.append({
            "type": "color_variation",
            "level": "low",
            "description": "Skin tone appears relatively uniform in the analyzed region."
        })

    return {
        "success": True,
        "imageQuality": {
            "usable": True,
            "brightness": "acceptable",
            "sharpness": "acceptable"
        },
        "faceDetected": True,
        "observations": observations,
        "message": "Image processed successfully.",
        "disclaimer": "These are image-based observations and are not a medical diagnosis."
    }
