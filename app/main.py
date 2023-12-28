#!/usr/bin/env python3
import flask
import hashlib
import os
from serving import serve_model, serve_model_streaming

app = flask.Flask(__name__)

import flask_cors
flask_cors.CORS(app)  # Apply CORS to all routes

@app.route('/', methods=['GET'])
def index():
    return flask.render_template('index.html')

@app.route('/prompt', methods=['POST'])
def prompt():
    data = flask.request.json
    prompt = data.get('prompt')
    if not prompt:
        return 'No message provided', 400
    output = serve_model(prompt)
    return flask.jsonify({'response': output.content})

PromptStorage = {}

@app.route("/prompt_streaming", methods=["POST"])
def handle_prompt_streaming():
    prompt = flask.request.form.get("prompt")
    if not prompt:
        return "Invalid request: Prompt is missing", 400
    prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()
    PromptStorage[prompt_hash] = prompt
    response = flask.Response()
    response.data = prompt_hash
    return response

# @app.route("/prompt_streaming/<prompt_hash>", methods=["GET"])
# def handle_prompt_streaming_by_hash(prompt_hash):
#     prompt = PromptStorage.get(prompt_hash)
#     if prompt:
#         response = flask.Response(serve_model_streaming(prompt))
#         response.headers['Content-Type'] = 'text/event-stream'
#         return response  # No need to yield the response again
#     else:
#         return "Invalid token", 404

from flask import stream_with_context

@app.route("/prompt_streaming/<prompt_hash>", methods=["GET"])
def handle_prompt_streaming_by_hash(prompt_hash):
    prompt = PromptStorage.get(prompt_hash)
    if prompt:
        return stream_with_context(serve_model_streaming(prompt))
    else:
        return "Invalid token", 404
        
if __name__ == '__main__':
    # Gemini API key shou5ld be exported as GOOGLE_API_KEY envvar in production
    # for local development we will load an .env file, if one exists
    import dotenv; dotenv.load_dotenv()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)