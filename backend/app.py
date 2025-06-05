from flask import Flask, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime

app = Flask(__name__)

# 1. 데이터 로드
df = pd.read_csv("data/processed/train.csv")

# 2. 범주형 처리 (Seasons 인코딩)
season_order = ["Spring", "Summer", "Autumn", "Winter"]
df["Seasons"] = pd.Categorical(df["Seasons"], categories=season_order, ordered=True)
df["Seasons"] = df["Seasons"].cat.codes

# # 날짜 컬럼 datetime 변환 및 파생 변수 생성
# df["Date"] = pd.to_datetime(df["Date"])
# df["month"] = df["Date"].dt.month
# df["weekday"] = df["Date"].dt.weekday


# 3. feature column 정의
feature_cols = [
    "Hour",
    "Temperature°C",
    "Humidity%",
    "Wind_speed_m_s",
    "Visibility_10m",
    "Rainfallmm",
    "Snowfall_cm",
    "Seasons",
    "Holiday",
    "month",
    "weekday",
]

X_train = df[feature_cols]
y_train = df["Rented_Bike_Count"]

# 4. 스케일링
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X_train)

# 5. 결정 트리 모델 + GridSearchCV
param_grid = {
    "max_depth": [5, 10, 15, 20, None],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
}

grid = GridSearchCV(
    DecisionTreeRegressor(random_state=42),
    param_grid,
    cv=5,
    scoring="neg_mean_squared_error",
    n_jobs=-1,
)
grid.fit(X_scaled, y_train)
model = grid.best_estimator_


# 6. 예측 API
@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # 날짜 파생 변수 생성
    dt_obj = datetime.strptime(data["Date"], "%Y-%m-%d")
    data["month"] = dt_obj.month
    data["weekday"] = dt_obj.weekday()

    # Seasons 인코딩 처리 (문자열 → 정수)
    season_order = ["Spring", "Summer", "Autumn", "Winter"]
    season_cat = pd.Categorical(
        [data["Seasons"]], categories=season_order, ordered=True
    )
    season_code = season_cat.codes[0]

    # 입력 데이터를 feature 순서에 맞춰 DataFrame으로 구성
    row = pd.DataFrame(
        [
            {
                "Hour": data["Hour"],
                "Temperature°C": data["Temperature"],
                "Humidity%": data["Humidity"],
                "Wind_speed_m_s": data["Wind_speed"],
                "Visibility_10m": data["Visibility"],
                "Rainfallmm": data["Rainfall"],
                "Snowfall_cm": data["Snowfall"],
                "Seasons": season_code,  # 인코딩된 정수
                "Holiday": data["Holiday"],
                "month": data["month"],
                "weekday": data["weekday"],
            }
        ]
    )

    # 스케일링 및 예측
    row_scaled = scaler.transform(row)
    pred = model.predict(row_scaled)[0]

    return jsonify({"prediction": round(pred)})


if __name__ == "__main__":
    app.run(debug=True)
