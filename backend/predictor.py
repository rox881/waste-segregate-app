"""
YOLO Waste Segregation Model Predictor for Replicate
Model: best.pt (6.2MB YOLOv8 custom model)
Purpose: Detect and classify waste types from uploaded images
"""

from cog import BasePredictor, Input, Path
from PIL import Image
import torch
import io
import base64


class Predictor(BasePredictor):
    def setup(self):
        """Load YOLO model on initialization"""
        print("🔄 Loading YOLO model...")

        # Load custom YOLO model
        self.model = torch.hub.load(
            "ultralytics/yolov5",
            "custom",
            path="models/best.pt",
            force_reload=False,
            trust_repo=True,
        )

        # Set model to evaluation mode
        self.model.eval()

        print("✅ Model loaded successfully!")
        print(f"📊 Model classes: {self.model.names}")

    def predict(
        self,
        image: Path = Input(description="Input image for waste detection"),
        confidence: float = Input(
            description="Minimum confidence threshold", default=0.25, ge=0.0, le=1.0
        ),
    ) -> dict:
        """
        Predict waste type from image

        Args:
            image: Path to input image
            confidence: Minimum confidence threshold for detections

        Returns:
            Dictionary with detections and metadata
        """
        try:
            print(f"🖼️  Processing image: {image}")

            # Load image
            img = Image.open(image)

            # Convert to RGB if needed (handles PNG with alpha channel)
            if img.mode != "RGB":
                img = img.convert("RGB")

            print(f"✅ Image loaded: {img.size}")

            # Set confidence threshold
            self.model.conf = confidence

            # Run inference
            print("🔍 Running inference...")
            results = self.model(img)

            # Convert results to pandas DataFrame
            detections_df = results.pandas().xyxy[0]

            print(f"🎯 Found {len(detections_df)} detections")

            # Format results
            detections = []
            for _, row in detections_df.iterrows():
                detection = {
                    "class": row["name"],
                    "confidence": float(row["confidence"]),
                    "bbox": {
                        "xmin": float(row["xmin"]),
                        "ymin": float(row["ymin"]),
                        "xmax": float(row["xmax"]),
                        "ymax": float(row["ymax"]),
                    },
                }
                detections.append(detection)
                print(f"  - {row['name']}: {row['confidence']:.2%}")

            # Return results with metadata
            return {
                "detections": detections,
                "total_detections": len(detections),
                "image_size": {"width": img.size[0], "height": img.size[1]},
                "model_classes": self.model.names,
            }

        except Exception as e:
            print(f"❌ Error during prediction: {str(e)}")
            raise
