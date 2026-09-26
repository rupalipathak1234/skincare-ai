import cv2
import numpy as np
from app.services.image_analyzer import analyze_image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_blurry_image():
    blurry = np.zeros((300, 300, 3), dtype=np.uint8)
    blurry.fill(100) # Flat gray
    res_blur = analyze_image(blurry)
    assert not res_blur["faceDetected"]
    assert "blurry" in res_blur["message"] or "too dark" in res_blur["message"] or not res_blur["success"]

def test_analyze_dark_image():
    dark = np.zeros((300, 300, 3), dtype=np.uint8)
    dark.fill(10)
    # Add fake variance to pass blur check
    dark[::2, ::2] = 20
    res_dark = analyze_image(dark)
    assert "too dark" in res_dark["message"]
    assert not res_dark["success"]

def test_analyze_no_face_image():
    # Good brightness, good variance, no face
    no_face = np.zeros((300, 300, 3), dtype=np.uint8)
    no_face.fill(150)
    for i in range(100):
        no_face[np.random.randint(0, 300), np.random.randint(0, 300)] = [255, 255, 255]
        no_face[np.random.randint(0, 300), np.random.randint(0, 300)] = [0, 0, 0]
    res_noface = analyze_image(no_face)
    assert "front-facing photo" in res_noface["message"]
    assert not res_noface["faceDetected"]
    assert not res_noface["success"]

def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
