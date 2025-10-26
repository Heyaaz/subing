package com.project.subing.controller;

import com.project.subing.repository.UserRepository;
import com.project.subing.repository.UserSubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class SubscriptionControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSubscriptionRepository userSubscriptionRepository;

    private Long testUserId;

    @BeforeEach
    void setUp() {
        // 테스트용 사용자 생성
        testUserId = 1L; // 실제로는 User 엔티티를 생성해야 함
    }

    @Test
    public void 구독_추가_성공() {
        // given
        String requestJson = """
                {
                    "serviceId": 1,
                    "planName": "프리미엄",
                    "monthlyPrice": 17000,
                    "billingDate": 15,
                    "billingCycle": "MONTHLY",
                    "notes": "가족 공유 중"
                }
                """;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

        // when
        String url = "http://localhost:" + port + "/api/v1/subscriptions?userId=" + testUserId;
        String response = restTemplate.postForObject(url, request, String.class);

        // then
        assert response != null;
        assert response.contains("프리미엄");
        assert response.contains("17000");
    }

    @Test
    public void 구독_목록_조회_성공() {
        // when
        String url = "http://localhost:" + port + "/api/v1/subscriptions?userId=" + testUserId;
        String response = restTemplate.getForObject(url, String.class);

        // then
        assert response != null;
        assert response.contains("success");
    }
}
