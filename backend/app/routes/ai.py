from flask import Blueprint, Flask, request, jsonify
import google.generativeai as genai
import os

ai_bp = Blueprint("ai", __name__)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

@ai_bp.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"success": False, "message": "Prompt must be given."}), 400

    response = model.generate_content(prompt)

    if not response:
        return jsonify({"success": False, "message": "An error occurred when generating response."}), 500
    return jsonify({"success": True, "content": {"response": response.text}, "message": "Response generated sucessfully."}), 200
