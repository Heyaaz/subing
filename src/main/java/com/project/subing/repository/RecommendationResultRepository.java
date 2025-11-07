package com.project.subing.repository;

import com.project.subing.domain.recommendation.entity.RecommendationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationResultRepository extends JpaRepository<RecommendationResult, Long> {

    List<RecommendationResult> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<RecommendationResult> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
}
