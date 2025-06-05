from flask import Flask, request, jsonify
import pandas as pd
import joblib
from datetime import datetime
import os

app = Flask(__name__)

# 1. 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/best_decision_tree.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "../models/scaler.pkl")

# 2. 모델 및 스케일러 로드
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# 3. 예측에 사용할 feature column 순서
feature_cols = [
    "Hour",
    "Temperature",
    "Humidity",
    "Wind_speed",
    "Visibility",
    "Rainfall",
    "Snowfall",
    "Seasons",
    "Holiday",
    "month",
    "weekday",
]


# 4. 예측 API
@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # 날짜로부터 파생 변수 생성
    dt_obj = datetime.strptime(data["Date"], "%Y-%m-%d")
    data["month"] = dt_obj.month
    data["weekday"] = dt_obj.weekday()

    # Seasons 인코딩 처리 (문자열 → 정수)
    season_order = ["Spring", "Summer", "Autumn", "Winter"]
    season_cat = pd.Categorical(
        [data["Seasons"]], categories=season_order, ordered=True
    )
    data["Seasons"] = season_cat.codes[0]

    # 입력 데이터를 feature 순서에 맞춰 DataFrame으로 구성
    row = pd.DataFrame([{col: data[col] for col in feature_cols}])

    # 스케일링 및 예측
    row_scaled = scaler.transform(row)
    pred = model.predict(row_scaled)[0]

    return jsonify({"prediction": round(pred)})


if __name__ == "__main__":
    app.run(debug=True)
