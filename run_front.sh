#!/bin/bash

echo "▶️ 프론트엔드 개발 서버 실행 중..."

cd "$(dirname "$0")/frontend"

# 의존성 설치 (최초 실행 시)
if [ ! -d "node_modules" ]; then
  echo "📦 의존성 설치 중..."
  npm install
fi

# Vite 실행
npm run dev
