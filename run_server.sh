#!/bin/bash

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")"

echo "▶️ 백엔드 서버 시작 준비..."

# 가상환경 폴더 이름
VENV=".venv"

# 가상환경 없으면 생성
if [ ! -d "$VENV" ]; then
  echo "🧱 가상환경이 없어서 새로 생성합니다: $VENV"
  python3 -m venv $VENV
fi

# 가상환경 활성화
source $VENV/bin/activate

# 필요한 패키지 설치
echo "📦 Flask 및 의존성 설치 중..."
pip install --upgrade pip > /dev/null
pip install flask flask-cors > /dev/null

# Flask 서버 실행
echo "🚀 서버 실행 중: http://localhost:5000"
python backend/app.py
