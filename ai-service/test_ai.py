import cv2
import numpy as np
from app.services.image_analyzer import analyze_image

def test_ai():
    print("Testing blurry image...")
    blurry = np.zeros((300, 300, 3), dtype=np.uint8)
    blurry.fill(100) # Flat gray
    res_blur = analyze_image(blurry)
    assert not res_blur["faceDetected"]
    assert "blurry" in res_blur["message"] or "too dark" in res_blur["message"] or not res_blur["success"]

    print("Testing dark image...")
    dark = np.zeros((300, 300, 3), dtype=np.uint8)
    dark.fill(10)
    # Add fake variance to pass blur check
    dark[::2, ::2] = 20
    res_dark = analyze_image(dark)
    assert "too dark" in res_dark["message"]
    
    print("Testing no face image...")
    # Good brightness, good variance, no face
    no_face = np.zeros((300, 300, 3), dtype=np.uint8)
    no_face.fill(150)
    for i in range(100):
        no_face[np.random.randint(0, 300), np.random.randint(0, 300)] = [255, 255, 255]
        no_face[np.random.randint(0, 300), np.random.randint(0, 300)] = [0, 0, 0]
    res_noface = analyze_image(no_face)
    assert "front-facing photo" in res_noface["message"]
    assert not res_noface["faceDetected"]

    print("Python AI tests passed!")

if __name__ == "__main__":
    test_ai()
