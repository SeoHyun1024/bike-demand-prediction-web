import os
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import MinMaxScaler
import joblib

# 1. 데이터 로드
df = pd.read_csv("../data/processed/train.csv")

# 2. 범주형 처리 (Seasons 인코딩)
season_order = ["Spring", "Summer", "Autumn", "Winter"]
df["Seasons"] = pd.Categorical(df["Seasons"], categories=season_order, ordered=True)
df["Seasons"] = df["Seasons"].cat.codes

# 3. 컬럼명 정리
df.rename(
    columns={
        "Temperature°C": "Temperature",
        "Humidity%": "Humidity",
        "Wind_speed_m_s": "Wind_speed",
        "Visibility_10m": "Visibility",
        "Rainfallmm": "Rainfall",
        "Snowfall_cm": "Snowfall",
    },
    inplace=True,
)

# 4. feature column 정의
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

# 6. 저장 경로 준비
model_dir = "../models"
os.makedirs(model_dir, exist_ok=True)

# 7. 학습 결과 저장
joblib.dump(grid.best_estimator_, os.path.join(model_dir, "best_decision_tree.pkl"))
joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))
print("✅ Model and scaler saved to models/")
