import os
import openai
from dotenv import load_dotenv
import base64
from flask_cors import CORS
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/image_api', methods=['POST'])
def process_image():
    data = request.get_json()
    base64_string = data.get('image_data')
    object_name = identify_objects(base64_string)
    return jsonify({"object_name": object_name})

def identify_objects(base64_image):
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")
    prompt = """Identify the objects in the image and return the name of the most prominent object which is not a person. Make it generic. For example, if you are shown a small box made of cardboard which has travel adapter written on it, you should return "cardboard box" and if you see a packet with the name of the product, you should return the packet and what the packet is made of, for example "Plastic Packet" instead of "Product name".
    If you are more than 75 percent confident about what that object is made of, you should return that along with the name. For example "cardboard box" instead of "box" or "plastic water bottle" instead of "water bottle".
    Example Output, must only be the name of the object and the material its made of if you are more than 75 percent confidentshould be generalized: "Water Bottle"
    """
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """You are an expert at identifying objects which are the primary focus with clarity. Identify the image and return the name of the most prominent object which is not a person. Keep your response limited to just the name of the object."""
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": base64_image}},
                ],
            }
        ],
    )
    object_name = response.choices[0].message.content
    return object_name

@app.route('/llm_api', methods=['POST'])
def process_text():
    data = request.get_json()
    base64_string = data.get('object_name')
    info = get_recycling_info(base64_string)
    return jsonify({"info": info})

def get_recycling_info(item):
    load_dotenv()
    openai.api_key = os.getenv('OPENAI_API_KEY')

    prompt = f"""
    Please provide concise instructions (2-3 sentences) on how to properly recycle a {item}.

    Example Output:
    To recycle a water bottle, first rinse it out to remove any residue, then remove the cap as it may be made from a different type of plastic.
    Place the rinsed bottle in the designated recycling bin for plastics, ensuring it meets your local recycling guidelines for accepted materials.
    """

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content":
                "You are a recycling expert AI assistant. Offer clear guidance on how to recycle various items, "
                "considering environmental best practices and any special handling requirements. "
                "Keep your response concise, limited to 2-3 sentences."},
            {"role": "user", "content": prompt}
        ]
    )
    recycling_info = response.choices[0].message.content
    return recycling_info

if __name__ == '__main__':
    app.run(debug=True)
