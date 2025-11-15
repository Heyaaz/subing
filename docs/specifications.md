# Subing 기능 명세서

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [사용자 요구사항](#사용자-요구사항)
3. [기능 명세](#기능-명세)
4. [비즈니스 로직](#비즈니스-로직)
5. [사용자 스토리](#사용자-스토리)
6. [제약사항 및 규칙](#제약사항-및-규칙)
7. [데이터 검증 규칙](#데이터-검증-규칙)
8. [에러 처리](#에러-처리)

---

## 프로젝트 개요

### 비전
구독 경제 시대에 사용자가 자신의 구독 서비스를 효율적으로 관리하고, AI 기반 맞춤형 추천을 통해 최적의 구독 포트폴리오를 구성할 수 있도록 돕는 플랫폼

### 핵심 가치
1. **투명성**: 모든 구독 비용을 한눈에 파악
2. **효율성**: 중복 구독 감지 및 최적화 제안
3. **개인화**: AI 기반 맞춤형 서비스 추천
4. **실시간성**: WebSocket 기반 즉각적인 알림

### 타겟 사용자
- **주요 타겟**: 20-40대 디지털 네이티브
- **페르소나**:
  - 김구독 (28세, 직장인): 넷플릭스, 유튜브 프리미엄, 멜론 등 5개 구독 중
  - 박절약 (35세, 프리랜서): 예산 관리에 민감, 가성비 추구
  - 이덕후 (25세, 학생): 최신 서비스 탐색, 프리미엄 선호

---

## 사용자 요구사항

### 기능적 요구사항

#### FR-1: 사용자 관리
- FR-1.1: 사용자는 이메일과 비밀번호로 회원가입할 수 있다
- FR-1.2: 사용자는 로그인하여 JWT 토큰을 발급받는다
- FR-1.3: 사용자는 자신의 프로필을 조회/수정할 수 있다
- FR-1.4: 사용자는 FREE 또는 PRO 티어를 선택할 수 있다
- FR-1.5: 관리자는 사용자의 티어 및 역할을 변경할 수 있다

#### FR-2: 구독 관리
- FR-2.1: 사용자는 새로운 구독을 추가할 수 있다
- FR-2.2: 사용자는 구독 정보를 수정할 수 있다
- FR-2.3: 사용자는 구독을 활성화/비활성화할 수 있다
- FR-2.4: 사용자는 구독을 삭제할 수 있다
- FR-2.5: 사용자는 구독 목록을 필터링/정렬하여 조회할 수 있다
  - 필터: 카테고리, 활성 상태, 결제 주기
  - 정렬: 가격, 다음 결제일, 생성일

#### FR-3: 서비스 탐색
- FR-3.1: 사용자는 전체 서비스 목록을 조회할 수 있다
- FR-3.2: 사용자는 카테고리별로 서비스를 필터링할 수 있다
- FR-3.3: 사용자는 여러 서비스를 비교할 수 있다 (최대 5개)
- FR-3.4: 사용자는 서비스별 플랜을 조회할 수 있다

#### FR-4: 통계 및 분석
- FR-4.1: 사용자는 이번 달 총 지출을 확인할 수 있다
- FR-4.2: 사용자는 월별 지출 내역을 조회할 수 있다
- FR-4.3: 사용자는 카테고리별 지출 분포를 확인할 수 있다
- FR-4.4: 사용자는 월별 지출 트렌드를 차트로 볼 수 있다 (최근 6개월)
- FR-4.5: 사용자는 예산 대비 지출률을 확인할 수 있다

#### FR-5: 알림
- FR-5.1: 사용자는 결제일 3일 전 알림을 받는다
- FR-5.2: 사용자는 결제일 1일 전 알림을 받는다
- FR-5.3: 사용자는 예산 초과 시 알림을 받는다
- FR-5.4: 사용자는 90일 이상 미사용 구독 감지 알림을 받는다
- FR-5.5: 사용자는 플랜 가격 변동 알림을 받는다
- FR-5.6: 사용자는 구독 갱신 알림을 받는다 (결제일)
- FR-5.7: 사용자는 알림 타입별로 수신 여부를 설정할 수 있다
- FR-5.8: 사용자는 알림을 읽음 처리할 수 있다
- FR-5.9: 사용자는 알림을 삭제할 수 있다
- FR-5.10: 알림은 실시간으로 WebSocket을 통해 푸시된다

#### FR-6: GPT 추천 시스템
- FR-6.1: 사용자는 퀴즈에 답변하여 AI 추천을 받을 수 있다
  - 관심 분야 (복수 선택)
  - 월 예산
  - 사용 목적
  - 중요도 순위 (복수 선택)
- FR-6.2: GPT-4o가 사용자 맞춤형 서비스 3개를 추천한다
- FR-6.3: 각 추천에는 점수, 추천 이유, 장단점, 팁이 포함된다
- FR-6.4: 사용자는 추천 기록을 조회할 수 있다
- FR-6.5: 사용자는 추천에 대해 피드백(도움됨/별로)을 제출할 수 있다
- FR-6.6: 사용자는 추천 결과에서 서비스를 클릭할 수 있다 (클릭 추적)
- FR-6.7: FREE 티어는 월 10회, PRO 티어는 무제한 GPT 추천 가능

#### FR-7: 성향 테스트
- FR-7.1: 사용자는 12개 질문으로 구성된 성향 테스트를 진행한다
- FR-7.2: 시스템은 5가지 점수를 계산한다
  - 콘텐츠 소비 점수
  - 가성비 선호 점수
  - 건강 점수
  - 자기계발 점수
  - 디지털 도구 점수
- FR-7.3: 시스템은 8가지 프로필 타입 중 하나를 부여한다
  - 구독 덕후형, 알뜰 구독러형, 프리미엄 러버형 등
- FR-7.4: 성향 결과는 GPT 추천에 활용된다
- FR-7.5: 사용자는 성향 테스트를 재진행할 수 있다 (기존 데이터 삭제)

#### FR-8: 예산 관리
- FR-8.1: 사용자는 월별 예산을 설정할 수 있다
- FR-8.2: 사용자는 현재 월 예산을 조회할 수 있다
- FR-8.3: 사용자는 예산을 수정/삭제할 수 있다
- FR-8.4: 시스템은 매일 자정에 예산 초과 여부를 체크한다
- FR-8.5: 예산 초과 시 자동으로 알림을 발송한다

#### FR-9: 구독 최적화
- FR-9.1: 사용자는 구독 최적화 제안을 받을 수 있다
- FR-9.2: 시스템은 중복 서비스를 감지한다 (같은 카테고리 2개 이상)
- FR-9.3: 시스템은 저렴한 대안을 제안한다
- FR-9.4: 시스템은 총 절약 가능 금액을 계산한다
- FR-9.5: FREE 티어는 월 3회, PRO 티어는 무제한 최적화 가능

#### FR-10: 리뷰 및 평가
- FR-10.1: 사용자는 서비스에 리뷰를 작성할 수 있다
- FR-10.2: 사용자는 1-5점 별점을 부여할 수 있다
- FR-10.3: 사용자당 서비스별 리뷰는 1개만 작성 가능하다
- FR-10.4: 사용자는 자신의 리뷰를 수정/삭제할 수 있다
- FR-10.5: 시스템은 서비스별 평균 평점과 리뷰 수를 표시한다

#### FR-11: 관리자 기능
- FR-11.1: 관리자는 전체 사용자 목록을 조회할 수 있다
- FR-11.2: 관리자는 사용자의 티어/역할을 변경할 수 있다
- FR-11.3: 관리자는 서비스를 생성/수정/삭제할 수 있다
- FR-11.4: 관리자는 플랜을 생성/수정/삭제할 수 있다
- FR-11.5: 관리자는 대시보드에서 전체 통계를 확인할 수 있다
  - 전체/FREE/PRO 사용자 수
  - 활성 구독 수
  - 월 예상 매출
  - 월별 가입자 추이 (12개월)
  - 카테고리별 구독 현황

### 비기능적 요구사항

#### NFR-1: 성능
- NFR-1.1: API 응답 시간은 95% 이상 500ms 이내
- NFR-1.2: GPT 추천 응답 시간은 평균 5-10초
- NFR-1.3: WebSocket 알림 전송 지연은 1초 이내
- NFR-1.4: 동일 추천 요청은 캐싱되어 즉시 응답

#### NFR-2: 보안
- NFR-2.1: 모든 API는 JWT 인증을 거친다 (public 제외)
- NFR-2.2: 비밀번호는 BCrypt로 암호화되어 저장된다
- NFR-2.3: HTTPS 통신을 사용한다 (프로덕션)
- NFR-2.4: CORS는 허용된 origin만 접근 가능하다
- NFR-2.5: SQL Injection, XSS 방어가 적용된다

#### NFR-3: 가용성
- NFR-3.1: 시스템 가동률은 99% 이상
- NFR-3.2: 데이터베이스는 자동 백업된다 (일 1회)
- NFR-3.3: 장애 발생 시 1시간 내 복구

#### NFR-4: 확장성
- NFR-4.1: 동시 사용자 1,000명 지원
- NFR-4.2: 수평 확장 가능한 Stateless 아키텍처
- NFR-4.3: 데이터베이스 Read Replica 지원 가능

#### NFR-5: 사용성
- NFR-5.1: 모바일 반응형 디자인 (Tailwind CSS)
- NFR-5.2: 직관적인 UI/UX (토스 스타일)
- NFR-5.3: 명확한 에러 메시지 (한글, 친절한 톤)
- NFR-5.4: 로딩 상태 표시 (Spinner, Skeleton)

---

## 기능 명세

### 1. 사용자 인증 및 관리

#### 1.1 회원가입
**입력**:
- 이메일 (필수, 이메일 형식, 중복 불가)
- 비밀번호 (필수, 최소 8자, 영문+숫자 조합)
- 이름 (필수, 최소 2자, 최대 50자)

**처리**:
1. 이메일 중복 체크
2. 비밀번호 BCrypt 해싱
3. User 엔티티 생성 (tier=FREE, role=USER)
4. DB 저장

**출력**:
- 성공: 사용자 정보 (비밀번호 제외)
- 실패: 에러 메시지

**검증 규칙**:
```java
@Email(message = "올바른 이메일 형식이 아니에요")
private String email;

@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
         message = "비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 해요")
private String password;

@Size(min = 2, max = 50, message = "이름은 2-50자 사이여야 해요")
private String name;
```

#### 1.2 로그인
**입력**:
- 이메일
- 비밀번호

**처리**:
1. 사용자 조회 (이메일)
2. BCrypt 비밀번호 검증
3. JWT 토큰 생성
   - Payload: userId, email, role, tier
   - Expiration: 24시간
   - Algorithm: HS256

**출력**:
- 성공: { token, user }
- 실패: "이메일 또는 비밀번호가 일치하지 않아요"

#### 1.3 티어 업그레이드
**입력**:
- userId
- targetTier (PRO)

**처리**:
1. 사용자 조회
2. 티어 변경 (FREE → PRO)
3. UserTierUsage 초기화 (무제한)

**출력**:
- 성공: 변경된 사용자 정보
- 실패: 에러 메시지

**비즈니스 규칙**:
- PRO 요금: 월 9,900원
- 결제 연동은 향후 구현 (현재는 수동)

---

### 2. 구독 관리

#### 2.1 구독 추가
**입력**:
```json
{
  "userId": 1,
  "planId": 5,
  "startDate": "2025-11-15",
  "nextPaymentDate": "2025-12-15"
}
```

**처리**:
1. Plan 조회 (가격, 서비스 정보)
2. UserSubscription 생성
   - price = plan.price
   - is_active = true
3. DB 저장

**출력**:
- 성공: 생성된 구독 정보 (서비스명, 플랜명 포함)
- 실패: "플랜을 찾을 수 없어요"

**자동 계산**:
- 월간 결제: `nextPaymentDate = startDate + 1개월`
- 연간 결제: `nextPaymentDate = startDate + 1년`

#### 2.2 구독 수정
**입력**:
```json
{
  "planId": 6,
  "nextPaymentDate": "2025-12-20",
  "price": 15000
}
```

**처리**:
1. 기존 구독 조회
2. 소유권 확인 (userId 일치)
3. 필드 업데이트
4. 가격 변동 시 알림 생성

**출력**:
- 성공: 수정된 구독 정보
- 실패: "권한이 없어요"

#### 2.3 구독 활성화/비활성화
**입력**:
- subscriptionId
- userId

**처리**:
1. 구독 조회 및 소유권 확인
2. `is_active` 토글
3. 비활성화 시 알림 중지

**출력**:
- 성공: "구독이 비활성화되었어요"
- 실패: "구독을 찾을 수 없어요"

#### 2.4 구독 필터링 및 정렬
**쿼리 파라미터**:
```
GET /api/v1/subscriptions?userId=1&category=OTT&isActive=true&sortBy=price&sortOrder=desc
```

**필터 옵션**:
- `category`: OTT, MUSIC, CLOUD, AI, DESIGN, DELIVERY, ETC
- `isActive`: true, false
- `billingCycle`: MONTHLY, YEARLY

**정렬 옵션**:
- `price`: 가격순
- `nextPaymentDate`: 다음 결제일순
- `createdAt`: 생성일순

**출력**:
- 구독 목록 (서비스 정보, 플랜 정보 포함)

---

### 3. 통계 및 분석

#### 3.1 이번 달 요약
**API**: `GET /api/v1/statistics/summary?userId=1`

**계산 로직**:
```sql
-- 총 지출
SELECT SUM(price)
FROM user_subscriptions
WHERE user_id = ?
  AND is_active = true
  AND EXTRACT(MONTH FROM next_payment_date) = CURRENT_MONTH;

-- 활성 구독 수
SELECT COUNT(*)
FROM user_subscriptions
WHERE user_id = ? AND is_active = true;

-- 예산 사용률
budget_usage = (total_spending / budget) * 100
```

**출력**:
```json
{
  "totalSpending": 45000,
  "activeSubscriptions": 7,
  "budgetUsage": 75.5,
  "upcomingPayments": 3
}
```

#### 3.2 월별 지출 분석
**API**: `GET /api/v1/statistics/monthly?userId=1&year=2025&month=11`

**계산 로직**:
```sql
SELECT
  s.category,
  SUM(us.price) as total,
  COUNT(*) as count
FROM user_subscriptions us
JOIN service_plans sp ON us.plan_id = sp.id
JOIN services s ON sp.service_id = s.id
WHERE us.user_id = ?
  AND EXTRACT(YEAR FROM us.next_payment_date) = ?
  AND EXTRACT(MONTH FROM us.next_payment_date) = ?
  AND us.is_active = true
GROUP BY s.category;
```

**출력**:
```json
{
  "year": 2025,
  "month": 11,
  "totalSpending": 45000,
  "byCategory": [
    { "category": "OTT", "total": 20000, "count": 3 },
    { "category": "MUSIC", "total": 15000, "count": 2 }
  ]
}
```

#### 3.3 월별 지출 트렌드 (6개월)
**API**: `GET /api/v1/statistics/trend?userId=1`

**계산 로직**:
- 현재 월부터 5개월 전까지 총 6개월
- 각 월의 총 지출 계산
- 월 단위 그룹화

**출력**:
```json
{
  "months": ["2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11"],
  "spending": [30000, 35000, 40000, 42000, 43000, 45000]
}
```

---

### 4. 알림 시스템

#### 4.1 결제일 알림 (스케줄러)
**실행 주기**: 매일 00:00 (Spring @Scheduled)

**로직**:
```java
@Scheduled(cron = "0 0 0 * * *")
public void sendPaymentReminders() {
    LocalDate today = LocalDate.now();
    LocalDate threeDaysLater = today.plusDays(3);
    LocalDate oneDayLater = today.plusDays(1);

    // 3일 전 알림
    List<UserSubscription> subs3d = findByNextPaymentDate(threeDaysLater);
    for (UserSubscription sub : subs3d) {
        if (isNotificationEnabled(sub.getUser(), "PAYMENT_REMINDER_3D")) {
            createNotification(sub.getUser(),
                "결제 예정 알림",
                sub.getService().getName() + " 결제일이 3일 남았어요",
                "PAYMENT_REMINDER_3D");
            sendWebSocket(sub.getUser().getId(), notification);
        }
    }

    // 1일 전 알림 (동일 로직)
}
```

#### 4.2 예산 초과 알림
**실행 주기**: 매일 00:00

**로직**:
```java
@Scheduled(cron = "0 0 0 * * *")
public void checkBudgetExceeded() {
    List<UserBudget> budgets = findCurrentMonthBudgets();

    for (UserBudget budget : budgets) {
        int totalSpending = calculateMonthlySpending(budget.getUser());

        if (totalSpending > budget.getAmount()) {
            if (isNotificationEnabled(budget.getUser(), "BUDGET_EXCEEDED")) {
                int exceeded = totalSpending - budget.getAmount();
                createNotification(budget.getUser(),
                    "예산 초과 알림",
                    "이번 달 예산을 " + exceeded + "원 초과했어요",
                    "BUDGET_EXCEEDED");
                sendWebSocket(budget.getUser().getId(), notification);
            }
        }
    }
}
```

#### 4.3 미사용 구독 감지
**실행 주기**: 매주 월요일 00:00

**로직**:
```java
@Scheduled(cron = "0 0 0 * * MON")
public void detectUnusedSubscriptions() {
    LocalDate ninetyDaysAgo = LocalDate.now().minusDays(90);

    List<UserSubscription> unused = findSubscriptionsCreatedBefore(ninetyDaysAgo);

    for (UserSubscription sub : unused) {
        if (sub.isActive() && isNotificationEnabled(sub.getUser(), "UNUSED_SUBSCRIPTION")) {
            createNotification(sub.getUser(),
                "미사용 구독 감지",
                sub.getService().getName() + "을(를) 90일 이상 사용하지 않았어요. 해지를 고려해보세요.",
                "UNUSED_SUBSCRIPTION");
            sendWebSocket(sub.getUser().getId(), notification);
        }
    }
}
```

#### 4.4 가격 변동 알림 (이벤트 기반)
**트리거**: 플랜 가격 수정 시

**로직**:
```java
@Transactional
public void updatePlan(Long planId, PlanUpdateRequest request) {
    ServicePlan plan = planRepository.findById(planId);
    int oldPrice = plan.getPrice();
    int newPrice = request.getPrice();

    plan.updatePrice(newPrice);
    planRepository.save(plan);

    // 가격 변동 알림
    if (oldPrice != newPrice) {
        List<UserSubscription> affectedSubs =
            subscriptionRepository.findByPlanId(planId);

        for (UserSubscription sub : affectedSubs) {
            if (isNotificationEnabled(sub.getUser(), "PRICE_CHANGE")) {
                int diff = newPrice - oldPrice;
                String message = String.format(
                    "%s 플랜 가격이 %s원 %s했어요",
                    plan.getName(),
                    Math.abs(diff),
                    diff > 0 ? "인상" : "인하"
                );

                createNotification(sub.getUser(), "가격 변동 알림", message, "PRICE_CHANGE");
                sendWebSocket(sub.getUser().getId(), notification);
            }
        }
    }
}
```

#### 4.5 구독 갱신 알림
**실행 주기**: 매일 00:00

**로직**:
```java
@Scheduled(cron = "0 0 0 * * *")
public void sendRenewalNotifications() {
    LocalDate today = LocalDate.now();

    List<UserSubscription> renewals = findByNextPaymentDate(today);

    for (UserSubscription sub : renewals) {
        if (isNotificationEnabled(sub.getUser(), "SUBSCRIPTION_RENEWAL")) {
            createNotification(sub.getUser(),
                "구독 갱신 알림",
                sub.getService().getName() + " 구독이 오늘 갱신되었어요",
                "SUBSCRIPTION_RENEWAL");
            sendWebSocket(sub.getUser().getId(), notification);
        }
    }
}
```

#### 4.6 알림 설정
**저장 형태**: JSON (UserNotificationSettings 엔티티)
```json
{
  "PAYMENT_REMINDER_3D": true,
  "PAYMENT_REMINDER_1D": true,
  "BUDGET_EXCEEDED": true,
  "UNUSED_SUBSCRIPTION": true,
  "PRICE_CHANGE": true,
  "SUBSCRIPTION_RENEWAL": true
}
```

**API**:
```
GET  /api/v1/notifications/settings?userId=1
PUT  /api/v1/notifications/settings?userId=1
```

---

### 5. GPT 추천 시스템

#### 5.1 추천 요청 플로우
```
1. 사용자 퀴즈 입력
   ├─ interests: ["OTT", "MUSIC"]
   ├─ budget: 30000
   ├─ purpose: "PERSONAL"
   └─ priorities: ["PRICE", "CONTENT"]

2. 성향 데이터 조회 (있는 경우)
   ├─ profileType: "SUBSCRIPTION_LOVER"
   ├─ scores: [80, 60, 40, 70, 90]
   └─ interestCategories: ["OTT", "MUSIC", "AI"]

3. 프롬프트 버전 선택 (A/B 테스트)
   └─ random(V1, V2)

4. 캐시 확인
   ├─ Key: "user:1:pref:5:ver:V1"
   ├─ Hit → 즉시 반환
   └─ Miss → GPT API 호출

5. GPT-4o API 호출
   ├─ systemPrompt (버전별)
   ├─ userPrompt (퀴즈 + 성향)
   └─ temperature: 0.7

6. 응답 파싱
   ├─ JSON 파싱
   ├─ 검증 (3개 추천, 필수 필드)
   └─ DTO 변환

7. DB 저장
   ├─ RecommendationResult 엔티티
   ├─ quiz_data (JSON)
   ├─ recommendations (JSON)
   └─ prompt_version

8. 캐싱 (Redis, TTL 7일)

9. 티어 사용량 증가
   └─ UserTierUsage.gptCount++
```

#### 5.2 프롬프트 구조

**V1 프롬프트 (기본)**:
```
당신은 구독 서비스 추천 전문가입니다.

사용자 정보:
- 관심 분야: OTT, MUSIC
- 월 예산: 30,000원
- 사용 목적: 개인 취미/여가
- 중요도: 가격 > 콘텐츠 양

성향 정보: (있는 경우)
- 프로필: 구독 덕후형 - 다양한 서비스를 즐기며, 항상 새로운 구독을 탐색합니다
- 콘텐츠 소비: 80/100
- 가성비 선호: 60/100
- 건강: 40/100
- 자기계발: 70/100
- 디지털 도구: 90/100
- 관심 카테고리: OTT, MUSIC, AI

위 성향 데이터를 적극 활용하여 사용자에게 가장 적합한 구독 서비스를 추천해주세요.

다음 형식의 JSON으로 3개 서비스를 추천해주세요:
{
  "recommendations": [
    {
      "serviceName": "서비스명",
      "score": 90,
      "mainReason": "추천 이유",
      "pros": ["장점1", "장점2", "장점3"],
      "cons": ["단점1", "단점2"],
      "tip": "활용 팁"
    }
  ],
  "summary": "전체 요약",
  "alternatives": "대안 제안"
}
```

**V2 프롬프트 (성향 중심)**:
```
당신은 사용자의 성향을 깊이 이해하고 맞춤형 구독 서비스를 추천하는 전문가입니다.

[사용자 성향 분석]
프로필: 구독 덕후형
- 이 사용자는 다양한 서비스를 즐기며, 항상 새로운 구독을 탐색합니다
- 콘텐츠 소비에 대한 열정이 높고(80/100), 디지털 도구 활용에 능숙합니다(90/100)

[구체적 시나리오]
이 사용자에게 적합한 시나리오:
1. 새로운 콘텐츠를 탐색하는 시간
2. 다양한 플랫폼을 오가며 즐기는 모습
3. 가성비를 고려하면서도 품질을 중시하는 선택

위 성향을 바탕으로 사용자의 라이프스타일에 완벽히 들어맞는 서비스를 추천해주세요.
(JSON 형식 동일)
```

#### 5.3 추천 결과 예시
```json
{
  "id": 123,
  "recommendations": [
    {
      "serviceName": "Netflix",
      "score": 92,
      "mainReason": "다양한 오리지널 콘텐츠와 합리적인 가격으로 콘텐츠 소비가 많은 당신에게 최적이에요",
      "pros": [
        "방대한 콘텐츠 라이브러리",
        "매주 새로운 오리지널 작품 업데이트",
        "4K HDR 지원"
      ],
      "cons": [
        "가격 인상 가능성",
        "일부 인기작 라이선스 종료"
      ],
      "tip": "연간 결제 시 약 10% 할인 혜택을 받을 수 있어요",
      "serviceId": 1
    }
  ],
  "summary": "당신의 성향을 분석한 결과, 콘텐츠 소비에 열정이 많고 디지털 도구 활용에 능숙하신 것으로 나타났어요. 이에 따라 다양한 콘텐츠를 제공하면서도 가성비가 뛰어난 서비스들을 추천드려요.",
  "alternatives": "예산을 더 절약하고 싶다면 Wavve나 Watcha도 고려해보세요. 국내 콘텐츠 중심으로 월 7,900원부터 이용 가능해요."
}
```

#### 5.4 티어 제한 체크
```java
@Service
public class TierLimitService {

    public void checkGptLimit(User user) {
        if (user.getTier() == UserTier.PRO) {
            return; // 무제한
        }

        UserTierUsage usage = getOrCreateUsage(user);

        if (usage.getGptCount() >= 10) {
            throw new TierLimitException(
                "FREE 티어는 GPT 추천을 월 10회까지 이용할 수 있어요. " +
                "PRO 티어로 업그레이드하시면 무제한으로 이용할 수 있어요."
            );
        }
    }

    public void incrementGptCount(User user) {
        UserTierUsage usage = getOrCreateUsage(user);
        usage.incrementGptCount();
        usageRepository.save(usage);
    }
}
```

---

### 6. 성향 테스트

#### 6.1 질문 구조
```java
@Entity
public class PreferenceQuestion {
    private Long id;
    private String questionText;
    private QuestionCategory category;  // BUDGET, CONTENT, etc.
    private Integer orderIndex;
}

@Entity
public class PreferenceOption {
    private Long id;
    private Long questionId;
    private String optionText;
    private Map<String, Integer> scores;  // {"content": 20, "price": -10}
}
```

#### 6.2 질문 예시
```json
{
  "id": 1,
  "questionText": "주말에 주로 무엇을 하시나요?",
  "category": "CONTENT",
  "options": [
    {
      "id": 1,
      "optionText": "넷플릭스, 유튜브 등 OTT 시청",
      "scores": { "content": 20, "price": 0, "health": 0, "selfDev": 0, "digital": 5 }
    },
    {
      "id": 2,
      "optionText": "운동이나 야외 활동",
      "scores": { "content": 0, "price": 0, "health": 20, "selfDev": 5, "digital": 0 }
    },
    {
      "id": 3,
      "optionText": "독서나 온라인 강의 수강",
      "scores": { "content": 5, "price": 0, "health": 0, "selfDev": 20, "digital": 10 }
    },
    {
      "id": 4,
      "optionText": "친구 만나기, 외식",
      "scores": { "content": 0, "price": -10, "health": 0, "selfDev": 0, "digital": 0 }
    }
  ]
}
```

#### 6.3 점수 계산 알고리즘
```java
public UserPreference calculateProfile(List<Long> selectedOptionIds) {
    Map<String, Integer> scores = new HashMap<>();
    scores.put("content", 0);
    scores.put("price", 0);
    scores.put("health", 0);
    scores.put("selfDev", 0);
    scores.put("digital", 0);

    // 선택된 옵션의 점수 합산
    for (Long optionId : selectedOptionIds) {
        PreferenceOption option = optionRepository.findById(optionId);
        option.getScores().forEach((key, value) ->
            scores.merge(key, value, Integer::sum)
        );
    }

    // 정규화 (0-100 범위)
    int maxScore = 240;  // 12 questions * 20 points
    scores.replaceAll((k, v) -> Math.max(0, Math.min(100, v * 100 / maxScore)));

    // 프로필 타입 결정
    ProfileType profileType = determineProfileType(scores);

    // 관심 카테고리 추출 (점수 60 이상)
    List<String> interestCategories = extractInterestCategories(selectedOptionIds);

    return UserPreference.builder()
        .profileType(profileType)
        .contentScore(scores.get("content"))
        .priceScore(scores.get("price"))
        .healthScore(scores.get("health"))
        .selfDevScore(scores.get("selfDev"))
        .digitalScore(scores.get("digital"))
        .interestCategories(interestCategories)
        .build();
}
```

#### 6.4 프로필 타입 결정 로직
```java
private ProfileType determineProfileType(Map<String, Integer> scores) {
    int content = scores.get("content");
    int price = scores.get("price");
    int health = scores.get("health");
    int selfDev = scores.get("selfDev");
    int digital = scores.get("digital");

    // 1순위: 구독 덕후형 (content 80+, digital 70+)
    if (content >= 80 && digital >= 70) {
        return ProfileType.SUBSCRIPTION_LOVER;
    }

    // 2순위: 알뜰 구독러형 (price 80+)
    if (price >= 80) {
        return ProfileType.BUDGET_CONSCIOUS;
    }

    // 3순위: 프리미엄 러버형 (content 70+, price < 40)
    if (content >= 70 && price < 40) {
        return ProfileType.PREMIUM_LOVER;
    }

    // 4순위: 헬스 케어형 (health 80+)
    if (health >= 80) {
        return ProfileType.HEALTH_FOCUSED;
    }

    // 5순위: 자기계발형 (selfDev 80+)
    if (selfDev >= 80) {
        return ProfileType.SELF_IMPROVEMENT;
    }

    // 6순위: 디지털 노마드형 (digital 80+)
    if (digital >= 80) {
        return ProfileType.DIGITAL_NOMAD;
    }

    // 7순위: 균형잡힌형 (모든 점수 50-70)
    if (allBetween(scores, 50, 70)) {
        return ProfileType.BALANCED;
    }

    // 8순위: 미니멀리스트형 (기본값)
    return ProfileType.MINIMALIST;
}
```

---

### 7. 예산 관리

#### 7.1 예산 설정
**입력**:
```json
{
  "userId": 1,
  "year": 2025,
  "month": 11,
  "amount": 50000
}
```

**처리**:
1. 중복 체크 (같은 년/월 예산 존재 여부)
2. UserBudget 엔티티 생성
3. DB 저장

**검증**:
- amount: 최소 1,000원, 최대 10,000,000원
- year: 현재 년도 이상
- month: 1-12

**출력**:
- 성공: 생성된 예산 정보
- 실패: "이미 해당 월의 예산이 설정되어 있어요"

#### 7.2 현재 월 예산 조회
**API**: `GET /api/v1/budgets/current?userId=1`

**처리**:
1. 현재 년/월 가져오기
2. 해당하는 UserBudget 조회
3. 현재 월 지출 계산
4. 사용률 계산

**출력**:
```json
{
  "budget": 50000,
  "spending": 37500,
  "usageRate": 75.0,
  "remaining": 12500
}
```

---

### 8. 구독 최적화

#### 8.1 중복 서비스 감지
**로직**:
```java
public OptimizationSuggestion getSuggestions(Long userId) {
    List<UserSubscription> activeSubs =
        subscriptionRepository.findByUserIdAndIsActive(userId, true);

    // 카테고리별 그룹화
    Map<ServiceCategory, List<UserSubscription>> grouped =
        activeSubs.stream()
            .collect(Collectors.groupingBy(
                sub -> sub.getPlan().getService().getCategory()
            ));

    List<DuplicateGroup> duplicates = new ArrayList<>();

    // 중복 감지 (같은 카테고리 2개 이상)
    grouped.forEach((category, subs) -> {
        if (subs.size() >= 2) {
            duplicates.add(new DuplicateGroup(
                category,
                subs,
                "같은 카테고리의 서비스가 " + subs.size() + "개 있어요"
            ));
        }
    });

    return OptimizationSuggestion.builder()
        .duplicates(duplicates)
        .alternatives(findAlternatives(activeSubs))
        .totalSavings(calculateSavings(duplicates, alternatives))
        .build();
}
```

#### 8.2 저렴한 대안 제안
**로직**:
```java
private List<Alternative> findAlternatives(List<UserSubscription> subs) {
    List<Alternative> alternatives = new ArrayList<>();

    for (UserSubscription sub : subs) {
        ServiceCategory category = sub.getPlan().getService().getCategory();
        int currentPrice = sub.getPrice();

        // 같은 카테고리에서 더 저렴한 플랜 찾기
        List<ServicePlan> cheaperPlans =
            planRepository.findByCategoryAndPriceLessThan(category, currentPrice);

        if (!cheaperPlans.isEmpty()) {
            ServicePlan bestAlternative = cheaperPlans.get(0);
            int savings = currentPrice - bestAlternative.getPrice();

            alternatives.add(new Alternative(
                sub,
                bestAlternative,
                savings,
                "월 " + savings + "원 절약 가능해요"
            ));
        }
    }

    return alternatives;
}
```

#### 8.3 총 절약 가능 금액 계산
```java
private int calculateSavings(
    List<DuplicateGroup> duplicates,
    List<Alternative> alternatives
) {
    int savings = 0;

    // 중복 제거 시 절약 (가장 비싼 것 제외 나머지 해지)
    for (DuplicateGroup group : duplicates) {
        List<Integer> prices = group.getSubscriptions().stream()
            .map(UserSubscription::getPrice)
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());

        // 가장 비싼 것 제외하고 합산
        savings += prices.stream().skip(1).mapToInt(Integer::intValue).sum();
    }

    // 대안 선택 시 절약
    savings += alternatives.stream()
        .mapToInt(Alternative::getSavings)
        .sum();

    return savings;
}
```

---

## 비즈니스 로직

### 1. 결제일 자동 갱신
```java
@Scheduled(cron = "0 0 0 * * *")
public void renewSubscriptions() {
    LocalDate today = LocalDate.now();
    List<UserSubscription> renewals =
        subscriptionRepository.findByNextPaymentDate(today);

    for (UserSubscription sub : renewals) {
        // 다음 결제일 계산
        LocalDate nextPayment = calculateNextPaymentDate(
            today,
            sub.getPlan().getBillingCycle()
        );

        sub.setNextPaymentDate(nextPayment);
        subscriptionRepository.save(sub);

        // 갱신 알림 발송
        sendRenewalNotification(sub);
    }
}

private LocalDate calculateNextPaymentDate(
    LocalDate current,
    BillingCycle cycle
) {
    return switch (cycle) {
        case MONTHLY -> current.plusMonths(1);
        case YEARLY -> current.plusYears(1);
    };
}
```

### 2. 월별 사용량 리셋
```java
@Scheduled(cron = "0 0 0 1 * *")  // 매월 1일 00:00
public void resetMonthlyUsage() {
    List<UserTierUsage> allUsages = usageRepository.findAll();

    for (UserTierUsage usage : allUsages) {
        usage.resetCounts();
        usageRepository.save(usage);
    }

    log.info("Monthly usage reset completed for {} users", allUsages.size());
}
```

### 3. 추천 캐시 무효화
```java
@CacheEvict(value = "recommendations", key = "'user:' + #userId + ':*'")
public void invalidateUserCache(Long userId) {
    // 사용자 성향 변경 시 호출
    // 새로운 추천 요청 시 GPT API 재호출
}
```

---

## 사용자 스토리

### Epic 1: 구독 관리
- **US-1.1**: 사용자로서, 내가 구독 중인 서비스를 한눈에 보고 싶다
  - Acceptance Criteria:
    - 활성 구독 목록이 카드 형태로 표시된다
    - 서비스 로고, 이름, 가격, 다음 결제일이 보인다
    - 카테고리별 필터링이 가능하다

- **US-1.2**: 사용자로서, 새로운 구독을 쉽게 추가하고 싶다
  - Acceptance Criteria:
    - 서비스 검색 및 선택이 직관적이다
    - 플랜 선택 시 가격과 혜택이 명확히 보인다
    - 시작일과 결제일을 설정할 수 있다

### Epic 2: 비용 분석
- **US-2.1**: 사용자로서, 이번 달 총 구독 비용을 알고 싶다
  - Acceptance Criteria:
    - 대시보드 상단에 큰 숫자로 표시된다
    - 전월 대비 증감이 표시된다
    - 예산 대비 사용률이 프로그레스 바로 보인다

- **US-2.2**: 사용자로서, 어떤 카테고리에 돈을 많이 쓰는지 알고 싶다
  - Acceptance Criteria:
    - 파이 차트로 카테고리별 비율이 보인다
    - 각 카테고리의 금액과 구독 수가 표시된다
    - 클릭 시 해당 카테고리 구독 목록으로 이동한다

### Epic 3: 알림
- **US-3.1**: 사용자로서, 결제일을 놓치지 않고 싶다
  - Acceptance Criteria:
    - 결제일 3일 전과 1일 전에 알림이 온다
    - 알림 메시지에 서비스명과 금액이 포함된다
    - 알림 클릭 시 해당 구독 상세로 이동한다

- **US-3.2**: 사용자로서, 예산을 초과하면 즉시 알고 싶다
  - Acceptance Criteria:
    - 예산 초과 시 자동 알림이 발송된다
    - 초과 금액이 명시된다
    - 해결 방법(최적화 제안)이 안내된다

### Epic 4: AI 추천
- **US-4.1**: 사용자로서, 나에게 맞는 구독 서비스를 추천받고 싶다
  - Acceptance Criteria:
    - 간단한 퀴즈(4단계)로 선호도를 입력한다
    - AI가 3개 서비스를 추천한다
    - 각 추천에 점수, 이유, 장단점이 포함된다

- **US-4.2**: 사용자로서, 내 성향을 분석받고 싶다
  - Acceptance Criteria:
    - 12개 질문에 답변한다
    - 5가지 점수와 프로필 타입을 받는다
    - 결과를 바탕으로 추천이 개인화된다

---

## 제약사항 및 규칙

### 1. 티어 제한
| 기능 | FREE | PRO |
|------|------|-----|
| 구독 개수 | 무제한 | 무제한 |
| GPT 추천 | 월 10회 | 무제한 |
| 최적화 제안 | 월 3회 | 무제한 |
| 알림 | 모두 가능 | 모두 가능 |
| 통계 | 모두 가능 | 모두 가능 |

### 2. 데이터 제한
- 서비스명: 최대 100자
- 리뷰 내용: 최대 500자
- 알림 메시지: 최대 200자
- 예산 금액: 최소 1,000원, 최대 10,000,000원

### 3. API Rate Limiting (향후 구현)
- 인증 API: 분당 10회
- GPT 추천 API: 분당 5회
- 일반 API: 분당 100회

---

## 데이터 검증 규칙

### 1. 사용자 입력
```java
// 회원가입
@Email
private String email;

@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")
private String password;

@Size(min = 2, max = 50)
private String name;

// 구독 추가
@NotNull
private Long planId;

@NotNull
@FutureOrPresent
private LocalDate startDate;

@NotNull
@Future
private LocalDate nextPaymentDate;

@Min(0)
private Integer price;

// 예산 설정
@Min(1000)
@Max(10000000)
private Integer amount;

@Min(2020)
private Integer year;

@Min(1)
@Max(12)
private Integer month;

// 리뷰 작성
@Min(1)
@Max(5)
private Integer rating;

@Size(max = 500)
private String comment;
```

### 2. 서버 측 검증
```java
// 구독 소유권 확인
if (!subscription.getUser().getId().equals(userId)) {
    throw new ForbiddenException("권한이 없어요");
}

// 중복 리뷰 방지
if (reviewRepository.existsByUserIdAndServiceId(userId, serviceId)) {
    throw new DuplicateReviewException("이미 리뷰를 작성했어요");
}

// 티어 제한 확인
if (user.getTier() == UserTier.FREE && usage.getGptCount() >= 10) {
    throw new TierLimitException("GPT 추천 사용 횟수를 모두 소진했어요");
}
```

---

## 에러 처리

### 1. HTTP 상태 코드
- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청 (검증 실패)
- 401: 인증 실패
- 403: 권한 없음
- 404: 리소스 없음
- 409: 중복 (이메일, 리뷰 등)
- 429: 티어 제한 초과
- 500: 서버 에러

### 2. 에러 응답 형식
```json
{
  "success": false,
  "message": "이메일 또는 비밀번호가 일치하지 않아요",
  "data": null,
  "timestamp": "2025-11-15T10:30:00",
  "path": "/api/v1/auth/login"
}
```

### 3. 친절한 에러 메시지
❌ 나쁜 예:
- "Validation failed"
- "Not found"
- "Access denied"

✅ 좋은 예:
- "이메일 또는 비밀번호가 일치하지 않아요"
- "구독을 찾을 수 없어요"
- "권한이 없어요. 본인의 구독만 수정할 수 있어요"
- "GPT 추천 사용 횟수를 모두 소진했어요. PRO 티어로 업그레이드하시면 무제한으로 이용할 수 있어요"

### 4. 전역 예외 핸들러
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse> handleValidation(ValidationException e) {
        return ResponseEntity.badRequest()
            .body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse> handleNotFound(NotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler(TierLimitException.class)
    public ResponseEntity<ApiResponse> handleTierLimit(TierLimitException e) {
        return ResponseEntity.status(429)
            .body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneral(Exception e) {
        log.error("Unexpected error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("일시적인 문제가 발생했어요. 다시 시도해주세요"));
    }
}
```