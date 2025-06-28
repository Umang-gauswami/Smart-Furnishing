import os
from huggingface_hub import login
import torch
from diffusers import StableDiffusionInstructPix2PixPipeline

# Login to Hugging Face Hub
# You can also set the token directly using HUGGINGFACE_TOKEN env var
token = os.getenv("HUGGINGFACE_TOKEN")

if not token:
    print("Please paste your Hugging Face token:")
    token = input(">>> ").strip()

login(token=token)

# Load the InstructPix2Pix pippyteline
pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
    "timbrooks/instruct-pix2pix",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    safety_checker=None
).to("cuda" if torch.cuda.is_available() else "cpu")

print("[INFO] InstructPix2Pix pipeline loaded successfully.")