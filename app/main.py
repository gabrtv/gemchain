#!/usr/bin/env python3
import flask
import os
from app.serving import serve_model

app = flask.Flask(__name__)

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

if __name__ == '__main__':
    # Gemini API key should be exported as GOOGLE_API_KEY envvar in production
    # for local development we will load an .env file, if one exists
    import dotenv; dotenv.load_dotenv()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)