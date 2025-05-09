from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from transformers import pipeline, CLIPProcessor, CLIPModel
from PIL import Image
import torch
import io

app = FastAPI()

# Load both models
text_classifier = pipeline("zero-shot-classification", model="MoritzLaurer/deberta-v3-large-zeroshot-v1")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# --- TEXT CLASSIFICATION ---
class TextInput(BaseModel):
    text: str
    candidate_labels: list[str]

@app.post("/classify-text")
def classify_text(input: TextInput):
    result = text_classifier(input.text, input.candidate_labels)
    return {"label": result["labels"][0], "scores": result["scores"], "all": result}


# --- IMAGE CLASSIFICATION ---
@app.post("/classify-image")
async def classify_image(
    file: UploadFile = File(...),
    candidate_labels: str = Form(...)
):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    labels = [label.strip() for label in candidate_labels.split(",")]

    inputs = clip_processor(text=labels, images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)[0]

    best_idx = torch.argmax(probs).item()
    return {
        "label": labels[best_idx],
        "score": round(probs[best_idx].item(), 4),
        "all": list(zip(labels, probs.tolist()))
    }
