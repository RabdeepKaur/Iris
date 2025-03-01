import sys
import json
import cv2
import numpy as np
from fer import FER # type: ignore

def analyze_emotion(image_path):
    """
    Analyze emotions in a facial image using FER (Facial Emotion Recognition)
    Returns emotion probabilities and the dominant emotion
    """
    try:
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            return json.dumps({"error": "Failed to load image"})
        
        # Initialize the emotion detector
        emotion_detector = FER(mtcnn=True)
        
        # Detect emotions
        emotions = emotion_detector.detect_emotions(img)
        
        # If no face detected, return empty result
        if not emotions:
            return json.dumps({
                "dominant": "no_face",
                "scores": {},
                "message": "No face detected"
            })
        
        # Get emotion scores for the first detected face
        emotion_scores = emotions[0]["emotions"]
        
        # Find the dominant emotion
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        
        # Return results
        return json.dumps({
            "dominant": dominant_emotion,
            "scores": emotion_scores,
            "box": emotions[0]["box"]
        })
    
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Invalid arguments. Usage: python emotion_analyzer.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = analyze_emotion(image_path)
    print(result)