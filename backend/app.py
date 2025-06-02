from flask import Flask, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS 허용

@app.route("/api/results")
def get_results():
    with open("results.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
