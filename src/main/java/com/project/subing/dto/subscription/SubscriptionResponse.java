package com.project.subing.dto.subscription;

import com.project.subing.domain.common.BillingCycle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    
    private Long id;
    private String serviceName;
    private String serviceCategory;
    private String serviceIcon;
    private String planName;
    private Integer monthlyPrice;
    private Integer billingDate;
    private LocalDate nextBillingDate;
    private BillingCycle billingCycle;
    private Boolean isActive;
    private String notes;
    private LocalDateTime createdAt;
}
