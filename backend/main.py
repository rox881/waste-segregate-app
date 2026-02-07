from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import logging
import os
import sys

# Setup logging
logging.basicConfig(
    filename="backend.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Waste Segregate API", version="1.0.0")

# ─────────────────────────────────────────────────────────────
# Demo Mode Flag
# ─────────────────────────────────────────────────────────────

DEMO_MODE = False  # Changed to False to debug real detection


# ─────────────────────────────────────────────────────────────
# CORS enabled for frontend
# ─────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────
# Load YOLOv8 Model (with your custom model)
# ─────────────────────────────────────────────────────────────

model = None

try:
    from ultralytics import YOLO

    # LOAD YOUR CUSTOM MODEL HERE
    model_path = os.path.join(os.path.dirname(__file__), "models", "best.pt")
    model = YOLO(model_path)
    print(f"✅ Custom YOLO model loaded successfully: {model_path}")
except Exception as e:
    print(f"⚠️ Failed to load YOLOv8 model: {e}")
    pass


# ─────────────────────────────────────────────────────────────
# Your 3-WASTE CATEGORIES (MODIFIED FOR YOUR MODEL)
# ─────────────────────────────────────────────────────────────

# Your 3 categories for the model
WASTE_CATEGORIES = {
    0: "recyclable",  # Replace with your actual class 0 name
    1: "organic",  # Replace with your actual class 1 name
    2: "reuse",  # Replace with your actual class 2 name
}

# Recycling tips for each category
RECYCLING_TIPS = {
    "recyclable": "This item can be recycled. Clean it and place in the blue recycling bin. Common recyclables include paper, plastic bottles, and metal cans.",
    "organic": "This is organic waste. Place it in the green compost bin. Organic waste includes food scraps, garden waste, and biodegradable materials.",
    "reuse": "This item can be reused. Consider repurposing it before disposal. Many items like containers, bags, and clothing can have a second life.",
}


# ─────────────────────────────────────────────────────────────
# Pydantic Models (MODIFIED FOR YOUR 3 CATEGORIES)
# ─────────────────────────────────────────────────────────────


class BoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int


class DetectedItem(BaseModel):
    id: int
    itemType: str
    bin: str  # Now using your 3 categories: recyclable, organic, reuse
    contaminated: bool
    confidence: float
    bbox: BoundingBox
    metadata: dict = {}


class DetectionResponse(BaseModel):
    items: list[DetectedItem]


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    response: str
    binSuggestion: str = "reuse"  # Default to your category


# ─────────────────────────────────────────────────────────────
# Fallback Demo Data (MODIFIED FOR YOUR 3 CATEGORIES)
# ─────────────────────────────────────────────────────────────

FALLBACK_DEMO_RESPONSE = DetectionResponse(
    items=[
        DetectedItem(
            id=1,
            itemType="Plastic Bottle",
            bin="recyclable",  # Your category
            contaminated=False,
            confidence=0.95,
            bbox=BoundingBox(x=50, y=80, w=100, h=180),
            metadata={
                "transformation": "Shredded into flakes and spun into high-performance polyester fibers for sustainable apparel.",
                "impact": "Recycling one ton of PET bottles saves 3.8 barrels of oil.",
                "fun_fact": "It takes about 5 plastic bottles to make enough fiber for one extra-large T-shirt.",
            },
        ),
        DetectedItem(
            id=2,
            itemType="Banana Peel",
            bin="organic",  # Your category
            contaminated=True,
            confidence=0.88,
            bbox=BoundingBox(x=200, y=120, w=120, h=80),
            metadata={
                "transformation": "Heated in an anaerobic digester to produce methane gas for green electricity and nutrient-rich bio-fertilizer.",
                "impact": "Organic waste in landfills is a major source of methane; composting reduces this 100%.",
                "fun_fact": "Banana peels can be used to polish leather shoes and silver jewelry!",
            },
        ),
    ]
)


# ─────────────────────────────────────────────────────────────
# Helper Functions (MODIFIED FOR YOUR 3 CATEGORIES)
# ─────────────────────────────────────────────────────────────


def get_bin_for_item(class_id: int) -> str:
    """Map class ID to your 3 waste categories"""
    return WASTE_CATEGORIES.get(class_id, "reuse")  # Default to 'reuse'


# ─────────────────────────────────────────────────────────────
# Endpoints (MODIFIED TO USE YOUR MODEL ONLY)
# ─────────────────────────────────────────────────────────────


@app.get("/health")
def health_check():
    """Health check endpoint - always returns ok"""
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
# REMOVE GOOGLE GEMINI SETUP (COMPLETELY)
# ─────────────────────────────────────────────────────────────
# WE ARE USING YOUR CUSTOM MODEL ONLY


# ─────────────────────────────────────────────────────────────
# Updated Detection Endpoint (YOUR MODEL ONLY)
# ─────────────────────────────────────────────────────────────


@app.post("/detect", response_model=DetectionResponse)
async def detect_waste(image: UploadFile = File(...)):
    """
    Detect waste items using YOUR CUSTOM YOLO MODEL ONLY
    """
    print(f"📥 Received detection request: {image.filename} ({image.content_type})")

    # Read image
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        logger.info(f"Image read successful: {image.filename}")
    except Exception as e:
        logger.error(f"Image read failed: {e}")
        if DEMO_MODE:
            return FALLBACK_DEMO_RESPONSE
        return DetectionResponse(items=[])

    # ─── ONLY STRATEGY: YOUR CUSTOM YOLO MODEL ───
    if model:
        try:
            print("🚀 Starting YOLOv8 inference with YOUR MODEL...")
            results = model(pil_image, device="cpu", verbose=False)

            detected_items = []
            for result in results:
                for box in result.boxes:
                    try:
                        conf = float(box.conf[0])
                        if conf < 0.25:
                            continue

                        class_id = int(box.cls[0])
                        class_name = model.names[class_id]

                        # 🛑 EXPLICIT FILTER: Ignore people
                        if class_name.lower() in [
                            "person",
                            "face",
                            "hand",
                            "man",
                            "woman",
                        ]:
                            continue

                        x1, y1, x2, y2 = box.xyxy[0].tolist()

                        # Enrich with metadata for your findings
                        item_meta = {
                            "transformation": f"Can be processed into raw material for new {class_name} manufacturing.",
                            "impact": f"Recycling {class_name} saves energy compared to producing from virgin materials.",
                            "fun_fact": f"High quality {class_name} recovery is essential for a circular economy.",
                        }

                        # Map to YOUR 3 CATEGORIES
                        waste_bin = get_bin_for_item(class_id)
                        waste_tip = RECYCLING_TIPS.get(waste_bin, "Dispose properly.")

                        detected_items.append(
                            DetectedItem(
                                id=len(detected_items) + 1,
                                itemType=class_name.capitalize(),
                                bin=waste_bin,
                                contaminated=False,  # You can add logic for contamination if needed
                                confidence=conf,
                                bbox=BoundingBox(
                                    x=int(x1), y=int(y1), w=int(x2 - x1), h=int(y2 - y1)
                                ),
                                metadata={
                                    "transformation": item_meta["transformation"],
                                    "impact": item_meta["impact"],
                                    "fun_fact": item_meta["fun_fact"],
                                    "recycling_tips": waste_tip,
                                },
                            )
                        )
                    except Exception as e:
                        print(f"Error processing box: {e}")
                        continue

            if detected_items:
                detected_items.sort(key=lambda x: x.confidence, reverse=True)
                print(
                    f"✅ Found {len(detected_items)} waste items: {[d.itemType for d in detected_items]}"
                )
                return DetectionResponse(items=detected_items[:3])

            print("🚀 YOLO found nothing.")
            return DetectionResponse(items=[])

        except Exception as e:
            print(f"❌ YOLO Error: {e}")
            logger.error(f"YOLO Error: {e}")
            return DetectionResponse(items=[])

    if DEMO_MODE:
        print("🎁 Returning FALLBACK_DEMO_RESPONSE")
        return FALLBACK_DEMO_RESPONSE
    return DetectionResponse(items=[])


# ─────────────────────────────────────────────────────────────
# Chat Endpoint (MODIFIED FOR YOUR 3 CATEGORIES)
# ─────────────────────────────────────────────────────────────


@app.post("/chat", response_model=ChatResponse)
async def chat_assistant(request: ChatRequest):
    """
    AI Assistant to answer waste related questions using your model's knowledge.
    """
    # Since we're using YOUR MODEL ONLY, we don't have Gemini
    try:
        # Basic response based on your categories
        query = request.query.lower()

        # Simple logic to determine which bin category to suggest
        bin_suggestion = "reuse"  # Default

        if (
            "recycle" in query
            or "plastic" in query
            or "bottle" in query
            or "can" in query
        ):
            bin_suggestion = "recyclable"
        elif (
            "organic" in query
            or "food" in query
            or "compost" in query
            or "garden" in query
        ):
            bin_suggestion = "organic"
        elif (
            "reuse" in query
            or "repurpose" in query
            or "donate" in query
            or "second life" in query
        ):
            bin_suggestion = "reuse"

        # Create a helpful response
        response = f"Based on your query about '{request.query}', I suggest you place this item in the {bin_suggestion} bin. "

        if bin_suggestion == "recyclable":
            response += (
                "This can be processed into new materials, saving resources and energy."
            )
        elif bin_suggestion == "organic":
            response += "This will decompose naturally and can be turned into nutrient-rich compost."
        else:  # reuse
            response += "Consider repurposing this item before disposal to extend its lifecycle."

        return ChatResponse(response=response, binSuggestion=bin_suggestion)
    except Exception as e:
        print(f"❌ Chat Assistant Error: {e}")
        return ChatResponse(
            response="I'm here to help with waste segregation questions. How can I assist you today?",
            binSuggestion="reuse",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
