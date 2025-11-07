package com.project.subing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.subing.domain.recommendation.entity.RecommendationFeedback;
import com.project.subing.domain.recommendation.entity.RecommendationResult;
import com.project.subing.domain.service.entity.ServiceEntity;
import com.project.subing.domain.user.entity.User;
import com.project.subing.dto.recommendation.QuizRequest;
import com.project.subing.dto.recommendation.RecommendationResponse;
import com.project.subing.repository.RecommendationFeedbackRepository;
import com.project.subing.repository.RecommendationResultRepository;
import com.project.subing.repository.ServiceRepository;
import com.project.subing.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class GPTRecommendationService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.max-tokens}")
    private Integer maxTokens;

    @Value("${openai.temperature}")
    private Double temperature;

    private WebClient webClient;

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final RecommendationResultRepository recommendationResultRepository;
    private final RecommendationFeedbackRepository recommendationFeedbackRepository;
    private final TierLimitService tierLimitService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public RecommendationResponse getRecommendations(Long userId, QuizRequest quiz) {
        // 0. 티어 제한 체크
        if (!tierLimitService.canUseGptRecommendation(userId)) {
            throw new RuntimeException("GPT 추천 사용 횟수를 초과했습니다. PRO 티어로 업그레이드하세요.");
        }

        // 1. 캐시된 추천 결과 조회 (없으면 GPT API 호출)
        RecommendationResponse result = getRecommendationFromCache(quiz);

        // 2. DB에 저장
        saveRecommendationResult(userId, quiz, result);

        // 3. 사용량 증가
        tierLimitService.incrementGptRecommendation(userId);

        return result;
    }

    @Cacheable(value = "gptRecommendations", key = "#quiz")
    public RecommendationResponse getRecommendationFromCache(QuizRequest quiz) {
        // 1. 프롬프트 생성
        String prompt = buildPrompt(quiz);

        // 2. GPT API 호출
        String response = callGPTAPI(prompt);

        // 3. JSON 파싱
        return parseResponse(response);
    }

    @Transactional(readOnly = true)
    public List<RecommendationResult> getRecommendationHistory(Long userId) {
        return recommendationResultRepository.findTop5ByUser_IdOrderByCreatedAtDesc(userId);
    }

    public void saveFeedback(Long recommendationId, Long userId, Boolean isHelpful, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        RecommendationResult recommendationResult = recommendationResultRepository.findById(recommendationId)
                .orElseThrow(() -> new RuntimeException("추천 결과를 찾을 수 없습니다."));

        // 이미 피드백을 남긴 경우 업데이트
        RecommendationFeedback feedback = recommendationFeedbackRepository
                .findByRecommendationResult_IdAndUser_Id(recommendationId, userId)
                .orElse(null);

        if (feedback == null) {
            feedback = RecommendationFeedback.builder()
                    .recommendationResult(recommendationResult)
                    .user(user)
                    .isHelpful(isHelpful)
                    .comment(comment)
                    .build();
        }

        recommendationFeedbackRepository.save(feedback);
    }

    private String buildPrompt(QuizRequest quiz) {
        List<ServiceEntity> services = serviceRepository.findAll();

        StringBuilder serviceList = new StringBuilder();
        for (int i = 0; i < services.size(); i++) {
            ServiceEntity service = services.get(i);
            serviceList.append(String.format("%d. %s - %s - %s\n",
                    i + 1,
                    service.getServiceName(),
                    service.getCategory(),
                    service.getDescription() != null ? service.getDescription() : "서비스 설명 없음"
            ));
        }

        return String.format("""
            사용자 입력:
            - 관심 분야: %s
            - 월 예산: %,d원
            - 사용 목적: %s
            - 중요도: %s

            사용 가능한 서비스 목록:
            %s

            상위 3-5개 서비스를 JSON 형식으로 추천해주세요.
            반드시 아래 출력 형식을 따라주세요.

            출력 형식:
            {
              "recommendations": [
                {
                  "serviceId": 숫자,
                  "serviceName": "서비스명",
                  "score": 0-100 점수,
                  "mainReason": "추천 이유",
                  "pros": ["장점1", "장점2", "장점3"],
                  "cons": ["단점1", "단점2"],
                  "tip": "실용적인 팁"
                }
              ],
              "summary": "전체 요약",
              "alternatives": "대안 제안"
            }
            """,
                String.join(", ", quiz.getInterests()),
                quiz.getBudget(),
                quiz.getPurpose(),
                String.join(", ", quiz.getPriorities()),
                serviceList.toString()
        );
    }

    private String callGPTAPI(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", maxTokens,
                "temperature", temperature
        );

        try {
            String response = webClient.post()
                    .uri("/v1/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(30));

            // GPT 응답에서 content 추출
            JsonNode root = objectMapper.readTree(response);
            return root.at("/choices/0/message/content").asText();

        } catch (Exception e) {
            throw new RuntimeException("GPT API 호출 실패: " + e.getMessage(), e);
        }
    }

    private RecommendationResponse parseResponse(String jsonContent) {
        try {
            return objectMapper.readValue(jsonContent, RecommendationResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("GPT 응답 파싱 실패: " + e.getMessage(), e);
        }
    }

    private void saveRecommendationResult(Long userId, QuizRequest quiz, RecommendationResponse result) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            String quizJson = objectMapper.writeValueAsString(quiz);
            String resultJson = objectMapper.writeValueAsString(result);

            RecommendationResult entity = RecommendationResult.builder()
                    .user(user)
                    .quizData(quizJson)
                    .resultData(resultJson)
                    .build();

            recommendationResultRepository.save(entity);
        } catch (Exception e) {
            throw new RuntimeException("추천 결과 저장 실패: " + e.getMessage(), e);
        }
    }

    private static final String SYSTEM_PROMPT = """
        당신은 구독 서비스 추천 전문가입니다.
        사용자의 선호도와 예산을 꼼꼼히 분석하여 최적의 구독 서비스를 추천해주세요.
        추천 시 다음을 반드시 포함하세요:
        - 추천 이유 (구체적이고 설득력 있게)
        - 장점 3가지
        - 단점 2가지
        - 실용적인 팁

        출력은 반드시 유효한 JSON 형식이어야 합니다.
        """;
}
