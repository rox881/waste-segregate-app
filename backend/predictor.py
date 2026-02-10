import torch
from ultralytics import YOLO
from PIL import Image
import io
import base64
import numpy as np


class Predictor:
    def setup(self):
        """Load the trained waste segregation model"""
        print("🔄 Loading trained YOLO model from best.pt...")
        # CRITICAL FIX: Load YOUR trained model (not download from internet)
        self.model = YOLO("/src/models/best.pt")
        print("✅ Model loaded successfully!")

    def predict(self, image):
        """
        Run waste detection on input image

        Args:
            image: PIL.Image or base64-encoded image

        Returns:
            dict with detections
        """
        # Handle base64 input if needed
        if isinstance(image, str) and image.startswith("data:image"):
            # Strip data URL prefix
            if ";base64," in image:
                image = image.split(";base64,")[1]
            image_bytes = base64.b64decode(image)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        elif isinstance(image, str):
            # Assume URL or path
            image = Image.open(image).convert("RGB")

        # Run inference
        results = self.model(image, conf=0.25)

        # Parse results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                xyxy = box.xyxy[0].cpu().numpy()
                conf = float(box.conf[0].cpu().numpy())
                cls = int(box.cls[0].cpu().numpy())
                name = result.names[cls]

                detections.append(
                    {
                        "label": name,
                        "confidence": round(conf, 2),
                        "bbox": [
                            int(xyxy[0]),
                            int(xyxy[1]),
                            int(xyxy[2]),
                            int(xyxy[3]),
                        ],
                    }
                )

        return {"detections": detections, "count": len(detections)}
