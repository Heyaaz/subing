#!/bin/bash

echo "🚀 Subing API 테스트 시작"
echo "================================"

# 1. 회원가입 테스트
echo "📝 1. 회원가입 테스트"
curl -X POST http://localhost:8080/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123!",
    "name": "테스트 사용자"
  }' | jq '.'

echo -e "\n"

# 2. 로그인 테스트
echo "🔐 2. 로그인 테스트"
curl -X POST http://localhost:8080/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123!"
  }' | jq '.'

echo -e "\n"

# 3. 구독 추가 테스트
echo "➕ 3. 구독 추가 테스트"
curl -X POST "http://localhost:8080/api/v1/subscriptions?userId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": 1,
    "planName": "프리미엄",
    "monthlyPrice": 17000,
    "billingDate": 15,
    "billingCycle": "MONTHLY",
    "notes": "가족 공유 중"
  }' | jq '.'

echo -e "\n"

# 4. 구독 목록 조회 테스트
echo "📋 4. 구독 목록 조회 테스트"
curl -X GET "http://localhost:8080/api/v1/subscriptions?userId=1" | jq '.'

echo -e "\n"
echo "✅ API 테스트 완료!"
