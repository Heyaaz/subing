package com.project.subing.service;

import com.project.subing.domain.subscription.entity.UserSubscription;
import com.project.subing.domain.user.entity.User;
import com.project.subing.dto.subscription.SubscriptionRequest;
import com.project.subing.dto.subscription.SubscriptionResponse;
import com.project.subing.repository.UserRepository;
import com.project.subing.repository.UserSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {
    
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository;
    
    public SubscriptionResponse createSubscription(Long userId, SubscriptionRequest request) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 구독 생성 (Service 엔티티는 임시로 null 처리)
        UserSubscription subscription = UserSubscription.builder()
                .user(user)
                .service(null) // 임시로 null - 나중에 Service 엔티티 연결
                .planName(request.getPlanName())
                .monthlyPrice(request.getMonthlyPrice())
                .billingDate(request.getBillingDate())
                .billingCycle(request.getBillingCycle())
                .notes(request.getNotes())
                .build();
        
        UserSubscription savedSubscription = userSubscriptionRepository.save(subscription);
        
        return SubscriptionResponse.builder()
                .id(savedSubscription.getId())
                .serviceName("임시 서비스명") // 나중에 Service 엔티티에서 가져오기
                .serviceCategory("임시 카테고리")
                .serviceIcon("임시 아이콘")
                .planName(savedSubscription.getPlanName())
                .monthlyPrice(savedSubscription.getMonthlyPrice())
                .billingDate(savedSubscription.getBillingDate())
                .nextBillingDate(savedSubscription.getNextBillingDate())
                .billingCycle(savedSubscription.getBillingCycle())
                .isActive(savedSubscription.getIsActive())
                .notes(savedSubscription.getNotes())
                .createdAt(savedSubscription.getCreatedAt())
                .build();
    }
    
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getUserSubscriptions(Long userId) {
        List<UserSubscription> subscriptions = userSubscriptionRepository.findByUserId(userId);
        
        return subscriptions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public SubscriptionResponse updateSubscription(Long id, SubscriptionRequest request) {
        UserSubscription subscription = userSubscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구독을 찾을 수 없습니다."));
        
        // 필드 업데이트
        subscription.updatePrice(request.getMonthlyPrice());
        subscription.setPlanName(request.getPlanName());
        subscription.setBillingDate(request.getBillingDate());
        subscription.setBillingCycle(request.getBillingCycle());
        subscription.setNotes(request.getNotes());
        
        UserSubscription savedSubscription = userSubscriptionRepository.save(subscription);
        
        return convertToResponse(savedSubscription);
    }
    
    public void deleteSubscription(Long id) {
        UserSubscription subscription = userSubscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("구독을 찾을 수 없습니다."));
        
        userSubscriptionRepository.delete(subscription);
    }
    
    private SubscriptionResponse convertToResponse(UserSubscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .serviceName("임시 서비스명")
                .serviceCategory("임시 카테고리")
                .serviceIcon("임시 아이콘")
                .planName(subscription.getPlanName())
                .monthlyPrice(subscription.getMonthlyPrice())
                .billingDate(subscription.getBillingDate())
                .nextBillingDate(subscription.getNextBillingDate())
                .billingCycle(subscription.getBillingCycle())
                .isActive(subscription.getIsActive())
                .notes(subscription.getNotes())
                .createdAt(subscription.getCreatedAt())
                .build();
    }
}
