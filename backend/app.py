from flask import Flask, jsonify
import json
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # CORS 허용


# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.route("/api/results")
def get_results():
    filepath = os.path.join(os.path.dirname(__file__), "results.json")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=5000, debug=True)
    app.run(debug=True)  # 디버그 모드로 실행
