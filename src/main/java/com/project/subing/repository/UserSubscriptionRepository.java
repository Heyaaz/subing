package com.project.subing.repository;

import com.project.subing.domain.subscription.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {
    
    List<UserSubscription> findByUserId(Long userId);
    
    List<UserSubscription> findByUserIdAndIsActive(Long userId, Boolean isActive);
    
    Optional<UserSubscription> findByIdAndUserId(Long id, Long userId);
}
