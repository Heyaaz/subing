package com.project.subing.service;

import com.project.subing.domain.service.entity.ServiceEntity;
import com.project.subing.domain.service.entity.SubscriptionPlan;
import com.project.subing.dto.service.PlanCreateRequest;
import com.project.subing.dto.service.PlanUpdateRequest;
import com.project.subing.dto.service.SubscriptionPlanResponse;
import com.project.subing.repository.ServiceRepository;
import com.project.subing.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanService {

    private final SubscriptionPlanRepository planRepository;
    private final ServiceRepository serviceRepository;

    public List<SubscriptionPlanResponse> getAllPlans() {
        List<SubscriptionPlan> plans = planRepository.findAll();
        List<SubscriptionPlanResponse> responses = new ArrayList<>();

        for (SubscriptionPlan plan : plans) {
            responses.add(convertToDto(plan));
        }

        return responses;
    }

    public List<SubscriptionPlanResponse> getPlansByServiceId(Long serviceId) {
        List<SubscriptionPlan> plans = planRepository.findByServiceId(serviceId);
        List<SubscriptionPlanResponse> responses = new ArrayList<>();

        for (SubscriptionPlan plan : plans) {
            responses.add(convertToDto(plan));
        }

        return responses;
    }

    public SubscriptionPlanResponse getPlanById(Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("플랜을 찾을 수 없습니다: " + planId));
        return convertToDto(plan);
    }

    @Transactional
    public SubscriptionPlanResponse createPlan(PlanCreateRequest request) {
        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("서비스를 찾을 수 없습니다: " + request.getServiceId()));

        SubscriptionPlan plan = SubscriptionPlan.builder()
                .service(service)
                .planName(request.getPlanName())
                .monthlyPrice(request.getMonthlyPrice())
                .description(request.getDescription())
                .features(request.getFeatures())
                .isPopular(request.getIsPopular() != null ? request.getIsPopular() : false)
                .build();

        SubscriptionPlan savedPlan = planRepository.save(plan);
        log.info("새 플랜 생성됨: {}", savedPlan.getId());

        return convertToDto(savedPlan);
    }

    @Transactional
    public SubscriptionPlanResponse updatePlan(Long planId, PlanUpdateRequest request) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("플랜을 찾을 수 없습니다: " + planId));

        plan.updateInfo(
            request.getPlanName(),
            request.getMonthlyPrice(),
            request.getDescription(),
            request.getFeatures(),
            request.getIsPopular()
        );

        log.info("플랜 업데이트됨: {}", planId);

        return convertToDto(plan);
    }

    @Transactional
    public void deletePlan(Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("플랜을 찾을 수 없습니다: " + planId));

        planRepository.delete(plan);
        log.info("플랜 삭제됨: {}", planId);
    }

    private SubscriptionPlanResponse convertToDto(SubscriptionPlan plan) {
        return SubscriptionPlanResponse.builder()
                .id(plan.getId())
                .planName(plan.getPlanName())
                .description(plan.getDescription())
                .monthlyPrice(plan.getMonthlyPrice())
                .features(plan.getFeatures())
                .isPopular(plan.getIsPopular())
                .createdAt(plan.getCreatedAt())
                .build();
    }
}