import os
import io
import base64
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import torch
from dotenv import load_dotenv
from huggingface_hub import login
from diffusers import StableDiffusionInstructPix2PixPipeline

load_dotenv()

# --------------------------
# Environment Configuration
# --------------------------

device = "cpu"  # Force CPU on Render
torch_dtype = torch.float32  # Always use float32 on CPU

print("[OK] Device:", device)
print("[OK] Torch dtype:", torch_dtype)

# --------------------------
# Login to Hugging Face
# --------------------------

token = os.getenv("HUGGINGFACE_TOKEN")
if not token:
    raise RuntimeError("HUGGINGFACE_TOKEN environment variable not set.")
login(token=token)

# --------------------------
# Load the Model (CPU only)
# --------------------------

pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
    "timbrooks/instruct-pix2pix",
    torch_dtype=torch_dtype
)
pipe = pipe.to("cpu")

# Safe offload methods to reduce memory usage
pipe.enable_attention_slicing()
# pipe.enable_model_cpu_offload()

# Disable safety checker
pipe.safety_checker = lambda images, **kwargs: (images, [False] * len(images))

# Try xformers (won’t work on Render, but safely ignored)
try:
    pipe.enable_xformers_memory_efficient_attention()
except Exception:
    print("[WARN] Xformers not available, using default attention.")

print("[INFO] Pipe loaded and offloaded safely")
print(f"[INFO] Model running on: {pipe.device}")

# --------------------------
# Flask App Setup
# --------------------------

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "device": str(pipe.device)
    })

@app.route("/generate", methods=["POST"])
def generate_image():
    try:
        data = request.get_json()
        image_data = data.get("image", "")
        prompt = data.get("prompt", "").strip()

        if not image_data or not prompt:
            return jsonify({"error": "Missing image or prompt"}), 400

        # Decode base64 image
        if "," in image_data:
            image_data = image_data.split(",")[1]
        input_image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        input_image = input_image.convert("RGB").resize((320, 320))

        input_image.save("debug_input.png")
        print("[INFO] Input image size:", input_image.size)
        print("[INFO] Prompt:", prompt)

        # Generate image
        output = pipe(
            prompt=prompt,
            image=input_image,
            num_inference_steps=20,
            image_guidance_scale=1.5,
            guidance_scale=7.5
        ).images[0]

        output.save("debug_output.png")

        # Encode to base64
        buffered = io.BytesIO()
        output.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return jsonify({
            "image": f"data:image/png;base64,{img_str}",
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def serve_smart():
    return send_from_directory(".", "smart.html")

# --------------------------
# Run App (Render-compatible)
# --------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
