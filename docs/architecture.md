# Subing 시스템 아키텍처 문서

## 목차
1. [시스템 개요](#시스템-개요)
2. [기술 스택](#기술-스택)
3. [시스템 아키텍처](#시스템-아키텍처)
4. [데이터베이스 설계](#데이터베이스-설계)
5. [API 설계](#api-설계)
6. [보안 아키텍처](#보안-아키텍처)
7. [실시간 통신 아키텍처](#실시간-통신-아키텍처)
8. [캐싱 전략](#캐싱-전략)
9. [배포 아키텍처](#배포-아키텍처)

---

## 시스템 개요

### 프로젝트 정보
- **프로젝트명**: Subing (구독 서비스 관리 플랫폼)
- **목적**: 사용자의 구독 서비스를 효율적으로 관리하고, AI 기반 맞춤형 추천을 제공하는 웹 애플리케이션
- **주요 기능**: 구독 관리, 비용 분석, AI 추천, 실시간 알림, 성향 분석

### 프로젝트 구조
```
subing/
├── src/main/java/com/project/subing/    # 백엔드 (Spring Boot)
│   ├── controller/                       # REST API 엔드포인트
│   ├── service/                          # 비즈니스 로직
│   ├── repository/                       # 데이터 액세스 계층
│   ├── entity/                           # JPA 엔티티
│   ├── dto/                              # 데이터 전송 객체
│   ├── config/                           # 설정 파일
│   ├── security/                         # 보안 관련
│   ├── websocket/                        # WebSocket 설정
│   └── util/                             # 유틸리티
│
├── frontend/src/                         # 프론트엔드 (React)
│   ├── components/                       # 재사용 컴포넌트
│   │   ├── common/                       # 공통 컴포넌트
│   │   └── ...                           # 기능별 컴포넌트
│   ├── pages/                            # 페이지 컴포넌트
│   ├── services/                         # API 서비스
│   ├── context/                          # Context API
│   ├── hooks/                            # Custom Hooks
│   └── utils/                            # 유틸리티
│
├── docs/                                 # 프로젝트 문서
├── .claude/                              # Claude Code 설정
└── build.gradle                          # Gradle 빌드 설정
```

---

## 기술 스택

### 백엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 17 | 프로그래밍 언어 |
| Spring Boot | 3.2.x | 애플리케이션 프레임워크 |
| Spring Data JPA | 3.2.x | ORM, 데이터 액세스 |
| Hibernate | 6.x | JPA 구현체 |
| Spring Security | 6.x | 인증/인가 |
| Spring WebSocket | 3.2.x | 실시간 통신 (STOMP) |
| PostgreSQL | 15.x | 관계형 데이터베이스 |
| Redis | 7.x | 캐싱, 세션 관리 |
| Gradle | 8.x | 빌드 도구 |
| JWT (jjwt) | 0.12.x | 토큰 기반 인증 |
| BCrypt | - | 비밀번호 암호화 |
| OpenAI API | GPT-4o | AI 추천 시스템 |

### 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.x | UI 라이브러리 |
| React Router | 6.x | 클라이언트 라우팅 |
| Axios | 1.x | HTTP 클라이언트 |
| SockJS Client | 1.6.x | WebSocket 클라이언트 |
| STOMP.js | 2.x | STOMP 프로토콜 |
| Recharts | 2.x | 차트/그래프 라이브러리 |
| Tailwind CSS | 3.x | CSS 프레임워크 |
| React Icons | 5.x | 아이콘 라이브러리 |

### 개발 도구
- **IDE**: IntelliJ IDEA (백엔드), VS Code (프론트엔드)
- **버전 관리**: Git
- **API 테스트**: Postman, Insomnia
- **AI 도구**: Claude Code

---

## 시스템 아키텍처

### 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│                  (React SPA + Tailwind CSS)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/HTTPS (REST API)
                  │ WebSocket (STOMP over SockJS)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    API Gateway / Load Balancer              │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌────────┐  ┌────────┐  ┌────────┐
│ App    │  │ App    │  │ App    │  (Spring Boot Application Servers)
│ Server │  │ Server │  │ Server │
│   #1   │  │   #2   │  │   #3   │
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    └───────────┼───────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
  ┌──────────┐    ┌──────────┐
  │PostgreSQL│    │  Redis   │
  │ Database │    │  Cache   │
  └──────────┘    └──────────┘
        │
        │
  ┌─────▼──────┐
  │  External  │
  │  Services  │
  │ (OpenAI)   │
  └────────────┘
```

### 레이어 아키텍처

```
┌─────────────────────────────────────────────┐
│          Presentation Layer                 │
│  (Controllers, WebSocket Handlers)          │
│  - REST API 엔드포인트                         │
│  - WebSocket STOMP 핸들러                     │
│  - DTO 변환                                  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            Service Layer                    │
│  (Business Logic)                           │
│  - 비즈니스 로직 처리                           │
│  - 트랜잭션 관리                               │
│  - 외부 API 호출 (OpenAI)                     │
│  - 이벤트 발행                                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Repository Layer                    │
│  (Data Access)                              │
│  - JPA Repository 인터페이스                   │
│  - CRUD                                     │
│  - 커스텀 쿼리 (JPQL, Native SQL)              │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           Database Layer                    │
│  (PostgreSQL)                               │
│  - 데이터 영속성                               │
│  - 트랜잭션 관리                               │
│  - 인덱싱, 제약조건                             │
└─────────────────────────────────────────────┘
```

### 주요 컴포넌트

#### 1. 인증/인가 시스템
```
User Request
    │
    ▼
JWT Authentication Filter
    │
    ├─ Token Validation
    │   ├─ Signature 검증 (HS256)
    │   ├─ Expiration 확인
    │   └─ Claims 추출
    │
    ▼
SecurityContext 설정
    │
    ▼
Role-based Access Control
    ├─ USER 권한
    ├─ ADMIN 권한
    └─ Tier 기반 제한 (FREE/PRO)
```

#### 2. WebSocket 실시간 알림
```
Client Connection
    │
    ▼
SockJS Handshake
    │
    ▼
STOMP Protocol
    │
    ├─ Subscribe: /topic/notifications/{userId}
    │
    ▼
Notification Event
    │
    ├─ Payment Reminder (3일 전, 1일 전)
    ├─ Budget Exceeded
    ├─ Unused Subscription (90일 이상)
    ├─ Price Change
    └─ Subscription Renewal
    │
    ▼
SimpMessagingTemplate
    │
    ▼
Client Receives Real-time Message
```

#### 3. GPT 추천 시스템
```
User Quiz Input
    │
    ▼
QuizData + UserPreference
    │
    ▼
Cache Check (Redis)
    │
    ├─ Cache Hit ──────┐
    │                  │
    ├─ Cache Miss      │
    │   │              │
    │   ▼              │
    │ Build Prompt     │
    │   ├─ Quiz Data   │
    │   ├─ Preference  │
    │   └─ Version     │
    │   │              │
    │   ▼              │
    │ OpenAI API Call  │
    │   (GPT-4o)       │
    │   │              │
    │   ▼              │
    │ Parse Response   │
    │   │              │
    │   ▼              │
    │ Save to DB       │
    │   │              │
    │   ▼              │
    │ Cache Result     │
    │   │              │
    └───┴──────────────┘
        │
        ▼
Return Recommendations
```

---

## 데이터베이스 설계

### ERD (Entity Relationship Diagram)

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│    User      │         │ UserSubscription │         │   Service    │
├──────────────┤         ├──────────────────┤         ├──────────────┤
│ id (PK)      │1      * │ id (PK)          │*      1 │ id (PK)      │
│ email        │◄────────┤ user_id (FK)     │────────►│ name         │
│ password     │         │ plan_id (FK)     │         │ category     │
│ name         │         │ start_date       │         │ description  │
│ tier         │         │ next_payment_date│         │ logo_url     │
│ role         │         │ price            │         │ website_url  │
│ created_at   │         │ is_active        │         │ created_at   │
└──────┬───────┘         │ created_at       │         └──────┬───────┘
       │                 └──────────────────┘                │
       │                                                     │
       │1                                                   1│
       │                                                     │
       │                 ┌──────────────────┐                │
       │                 │   ServicePlan    │                │
       │                *├──────────────────┤*               │
       └─────────────────┤ id (PK)          │◄───────────────┘
                         │ service_id (FK)  │
                         │ name             │
                         │ price            │
                         │ billing_cycle    │
                         │ features (JSON)  │
                         │ created_at       │
                         └──────────────────┘

┌──────────────┐         ┌──────────────────┐
│  UserBudget  │         │   Notification   │
├──────────────┤         ├──────────────────┤
│ id (PK)      │         │ id (PK)          │
│ user_id (FK) │         │ user_id (FK)     │
│ year         │         │ type             │
│ month        │         │ title            │
│ amount       │         │ message          │
│ created_at   │         │ is_read          │
└──────────────┘         │ created_at       │
                         └──────────────────┘

┌─────────────────────┐         ┌──────────────────┐
│ RecommendationResult│         │ UserPreference   │
├─────────────────────┤         ├──────────────────┤
│ id (PK)             │         │ id (PK)          │
│ user_id (FK)        │         │ user_id (FK)     │
│ quiz_data (JSON)    │         │ profile_type     │
│ recommendations(JSON)│        │ content_score    │
│ prompt_version      │         │ price_score      │
│ created_at          │         │ health_score     │
└─────────────────────┘         │ self_dev_score   │
                                │ digital_score    │
┌─────────────────────┐         │ interest_cat(JSON)│
│ RecommendationClick │         │ created_at       │
├─────────────────────┤         └──────────────────┘
│ id (PK)             │
│ recommendation_id(FK)│        ┌──────────────────┐
│ user_id (FK)        │         │PreferenceQuestion│
│ service_id (FK)     │         ├──────────────────┤
│ clicked_at          │         │ id (PK)          │
└─────────────────────┘         │ question_text    │
                                │ category         │
┌──────────────────┐            │ order_index      │
│ UserTierUsage    │            └──────────────────┘
├──────────────────┤
│ id (PK)          │            ┌──────────────────┐
│ user_id (FK)     │            │PreferenceOption  │
│ year             │            ├──────────────────┤
│ month            │            │ id (PK)          │
│ gpt_count        │            │ question_id (FK) │
│ optimization_cnt │            │ option_text      │
│ created_at       │            │ scores (JSON)    │
└──────────────────┘            └──────────────────┘

┌──────────────────┐
│ ServiceReview    │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ service_id (FK)  │
│ rating           │
│ comment          │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

### 주요 테이블 상세

#### users (사용자)
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- BCrypt 해시
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) DEFAULT 'FREE',  -- FREE, PRO
    role VARCHAR(20) DEFAULT 'USER',  -- USER, ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);
```

#### services (구독 서비스)
```sql
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,  -- OTT, MUSIC, CLOUD, etc.
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category ON services(category);
```

#### service_plans (서비스 플랜)
```sql
CREATE TABLE service_plans (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,  -- MONTHLY, YEARLY
    features JSONB,  -- ["4K 화질", "5개 기기", ...]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_service ON service_plans(service_id);
CREATE INDEX idx_plans_price ON service_plans(price);
```

#### user_subscriptions (사용자 구독)
```sql
CREATE TABLE user_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id BIGINT NOT NULL REFERENCES service_plans(id),
    start_date DATE NOT NULL,
    next_payment_date DATE NOT NULL,
    price INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON user_subscriptions(is_active);
CREATE INDEX idx_subscriptions_next_payment ON user_subscriptions(next_payment_date);
```

#### notifications (알림)
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- PAYMENT_REMINDER, BUDGET_EXCEEDED, etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

#### user_preferences (사용자 성향)
```sql
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_type VARCHAR(50) NOT NULL,  -- SUBSCRIPTION_LOVER, etc.
    content_score INTEGER NOT NULL,
    price_score INTEGER NOT NULL,
    health_score INTEGER NOT NULL,
    self_dev_score INTEGER NOT NULL,
    digital_score INTEGER NOT NULL,
    interest_categories JSONB,  -- ["OTT", "MUSIC", ...]
    budget_range VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preferences_user ON user_preferences(user_id);
CREATE INDEX idx_preferences_profile ON user_preferences(profile_type);
```

#### recommendation_results (추천 결과)
```sql
CREATE TABLE recommendation_results (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_data JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    prompt_version VARCHAR(20),  -- V1, V2
    feedback BOOLEAN,  -- true(helpful), false(not helpful), null
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_user ON recommendation_results(user_id);
CREATE INDEX idx_recommendations_created ON recommendation_results(created_at DESC);
```

#### recommendation_clicks (추천 클릭 추적)
```sql
CREATE TABLE recommendation_clicks (
    id BIGSERIAL PRIMARY KEY,
    recommendation_result_id BIGINT NOT NULL REFERENCES recommendation_results(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clicks_recommendation ON recommendation_clicks(recommendation_result_id);
CREATE INDEX idx_clicks_user ON recommendation_clicks(user_id);
```

---

## API 설계

### API 규칙
- Base URL: `/api/v1`
- Response Format: JSON
- HTTP Methods: GET, POST, PUT, DELETE
- 인증: JWT Bearer Token
- Error Response Format:
  ```json
  {
    "success": false,
    "message": "에러 메시지",
    "data": null
  }
  ```

### 주요 API 엔드포인트

#### 1. 인증 API (`/api/v1/auth`)
```
POST   /signup              회원가입
POST   /login               로그인
POST   /logout              로그아웃
GET    /me                  현재 사용자 정보
PUT    /me                  사용자 정보 수정
```

#### 2. 구독 API (`/api/v1/subscriptions`)
```
GET    /                    구독 목록 조회 (필터링, 정렬 가능)
GET    /{id}                구독 상세 조회
POST   /                    구독 추가
PUT    /{id}                구독 수정
DELETE /{id}                구독 삭제
PUT    /{id}/activate       구독 활성화
PUT    /{id}/deactivate     구독 비활성화
```

**Request Example (구독 추가):**
```json
POST /api/v1/subscriptions?userId=1
{
  "planId": 5,
  "startDate": "2025-11-15",
  "nextPaymentDate": "2025-12-15"
}
```

#### 3. 서비스 API (`/api/v1/services`)
```
GET    /                    서비스 목록 조회
GET    /{id}                서비스 상세 조회
GET    /{id}/plans          서비스별 플랜 목록
POST   /compare             서비스 비교
```

**Request Example (서비스 비교):**
```json
POST /api/v1/services/compare
{
  "serviceIds": [1, 2, 3]
}
```

#### 4. 통계 API (`/api/v1/statistics`)
```
GET    /summary             전체 요약 (총 지출, 활성 구독 수 등)
GET    /monthly             월별 지출 분석
GET    /category            카테고리별 분석
GET    /trend               월별 지출 트렌드 (최근 6개월)
```

#### 5. 알림 API (`/api/v1/notifications`)
```
GET    /                    알림 목록 조회
GET    /unread              읽지 않은 알림 조회
PUT    /{id}/read           알림 읽음 처리
PUT    /read-all            모든 알림 읽음 처리
DELETE /{id}                알림 삭제
```

#### 6. GPT 추천 API (`/api/v1/recommendations`)
```
POST   /ai                  AI 추천 요청
GET    /history/{userId}    추천 기록 조회
POST   /{id}/feedback       피드백 제출
POST   /{id}/click          추천 클릭 추적
```

**Request Example (AI 추천):**
```json
POST /api/v1/recommendations/ai?userId=1
{
  "interests": ["OTT", "MUSIC"],
  "budget": 30000,
  "purpose": "PERSONAL",
  "priorities": ["PRICE", "CONTENT"]
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "추천이 생성되었습니다.",
  "data": {
    "id": 123,
    "recommendations": [
      {
        "serviceName": "Netflix",
        "score": 92,
        "mainReason": "다양한 콘텐츠와 합리적인 가격",
        "pros": ["콘텐츠 풍부", "오리지널 작품"],
        "cons": ["가격 인상 가능성"],
        "tip": "연간 결제로 10% 할인",
        "serviceId": 1
      }
    ],
    "summary": "전체 요약...",
    "alternatives": "대안 제안..."
  }
}
```

#### 7. 성향 테스트 API (`/api/v1/preferences`)
```
GET    /questions           성향 테스트 질문 조회
POST   /submit              성향 테스트 답변 제출
GET    /profile/{userId}    성향 프로필 조회
DELETE /profile/{userId}    성향 프로필 삭제 (재테스트)
```

#### 8. 예산 API (`/api/v1/budgets`)
```
GET    /                    예산 목록 조회
GET    /current             현재 월 예산 조회
POST   /                    예산 생성
PUT    /{id}                예산 수정
DELETE /{id}                예산 삭제
```

#### 9. 최적화 API (`/api/v1/optimization`)
```
POST   /suggestions         최적화 제안 조회
```

#### 10. 리뷰 API (`/api/v1/reviews`)
```
GET    /service/{serviceId} 서비스별 리뷰 조회
GET    /user/{userId}       사용자별 리뷰 조회
POST   /                    리뷰 작성
PUT    /{id}                리뷰 수정
DELETE /{id}                리뷰 삭제
GET    /check               리뷰 작성 여부 확인
```

#### 11. 관리자 API (`/api/v1/admin/*`)
```
# 사용자 관리
GET    /users               사용자 목록 조회
PUT    /users/{id}/tier     사용자 티어 변경
PUT    /users/{id}/role     사용자 역할 변경
DELETE /users/{id}          사용자 삭제

# 서비스 관리
POST   /services            서비스 생성
PUT    /services/{id}       서비스 수정
DELETE /services/{id}       서비스 삭제

# 플랜 관리
POST   /plans               플랜 생성
PUT    /plans/{id}          플랜 수정
DELETE /plans/{id}          플랜 삭제

# 통계
GET    /statistics          관리자 대시보드 통계
```

---

## 보안 아키텍처

### JWT 인증 흐름
```
1. 사용자 로그인
   ├─ POST /api/v1/auth/login
   ├─ { email, password }
   └─ BCrypt 비밀번호 검증

2. JWT 토큰 생성
   ├─ Algorithm: HS256
   ├─ Payload: { userId, email, role, tier }
   ├─ Expiration: 24시간
   └─ Secret Key: application.properties

3. 클라이언트 저장
   └─ localStorage.setItem('token', jwt)

4. API 요청
   ├─ Header: Authorization: Bearer {token}
   └─ JwtAuthenticationFilter 검증

5. SecurityContext 설정
   └─ Authentication 객체 생성
```

### 비밀번호 암호화
- **알고리즘**: BCrypt
- **Salt Rounds**: 10
- **저장 형식**: `$2a$10$...` (해시값)

### CORS 설정
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 권한 제어
```java
// Method-level Security
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyMethod() { }

@PreAuthorize("hasRole('USER')")
public void userMethod() { }

// Tier-based Limiting
public void checkTierLimit(User user, String feature) {
    if (user.getTier() == UserTier.FREE) {
        // 제한 체크
    }
}
```

---

## 실시간 통신 아키텍처

### WebSocket 설정
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
```

### 알림 발송 흐름
```
Event Trigger (예: 결제일 3일 전)
    │
    ▼
NotificationScheduler (Spring @Scheduled)
    │
    ├─ 조건 확인 (알림 설정 ON?)
    ├─ Notification 생성
    ├─ DB 저장
    │
    ▼
NotificationWebSocketService
    │
    ├─ SimpMessagingTemplate
    ├─ convertAndSend("/topic/notifications/{userId}", message)
    │
    ▼
Connected Client
    │
    ├─ STOMP Subscribe
    ├─ 메시지 수신
    ├─ UI 업데이트 (배지, 알림 목록)
    └─ 브라우저 알림 (선택)
```

### 알림 타입
1. **PAYMENT_REMINDER_3D**: 결제일 3일 전
2. **PAYMENT_REMINDER_1D**: 결제일 1일 전
3. **BUDGET_EXCEEDED**: 예산 초과
4. **UNUSED_SUBSCRIPTION**: 미사용 구독 (90일)
5. **PRICE_CHANGE**: 플랜 가격 변동
6. **SUBSCRIPTION_RENEWAL**: 구독 갱신

---

## 캐싱 전략

### Redis 캐싱
```java
@Cacheable(value = "recommendations",
           key = "'user:' + #userId + ':pref:' + #preferenceId + ':ver:' + #version")
public RecommendationResult getRecommendations(...) {
    // GPT API 호출
}

@CacheEvict(value = "recommendations", allEntries = true)
public void clearCache() {
    // 캐시 무효화
}
```

### 캐싱 대상
1. **GPT 추천 결과** (TTL: 7일)
   - Key: `user:{userId}:pref:{preferenceId}:ver:{version}`
   - 동일 조건 재요청 시 API 호출 절약

2. **통계 데이터** (TTL: 1시간)
   - 월별 지출, 카테고리별 분석
   - 빈번한 조회, 실시간성 낮음

3. **서비스 목록** (TTL: 24시간)
   - 변경 빈도 낮음
   - 자주 조회됨

---

## 배포 아키텍처

### 개발 환경
```
Developer Workstation
    │
    ├─ Backend: ./gradlew bootRun (Port 8080)
    ├─ Frontend: npm start (Port 3000)
    ├─ PostgreSQL: localhost:5432
    └─ Redis: localhost:6379
```

### 프로덕션 환경
```
┌──────────────────────────────────────┐
│         Cloud Provider (AWS)         │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Application Load Balancer     │  │
│  │  (HTTPS, SSL/TLS Termination)  │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────┴───────────────────┐  │
│  │   Auto Scaling Group           │  │
│  │   - EC2 Instances (t3.medium)  │  │
│  │   - Spring Boot App            │  │
│  │   - Min: 2, Max: 5             │  │
│  └────────────────────────────────┘  │
│               │                      │
│  ┌────────────┴───────────────────┐  │
│  │  RDS PostgreSQL (Multi-AZ)     │  │
│  │  - db.t3.medium                │  │
│  │  - Automated Backups           │  │
│  └────────────────────────────────┘  │
│               │                      │
│  ┌────────────┴───────────────────┐  │
│  │  ElastiCache Redis (Cluster)   │  │
│  │  - cache.t3.micro              │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  S3 (Static Assets)            │  │
│  │  - React Build Files           │  │
│  │  - CloudFront CDN              │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```