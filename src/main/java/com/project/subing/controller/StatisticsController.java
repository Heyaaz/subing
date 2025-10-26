package com.project.subing.controller;

import com.project.subing.dto.common.ApiResponse;
import com.project.subing.dto.statistics.ExpenseAnalysisResponse;
import com.project.subing.dto.statistics.MonthlyExpenseResponse;
import com.project.subing.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    
    private final StatisticsService statisticsService;
    
    @GetMapping("/monthly/{userId}")
    public ResponseEntity<ApiResponse<MonthlyExpenseResponse>> getMonthlyExpense(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "2024") Integer year,
            @RequestParam(defaultValue = "10") Integer month) {
        
        MonthlyExpenseResponse response = statisticsService.getMonthlyExpense(userId, year, month);
        return ResponseEntity.ok(ApiResponse.success(response, "월별 지출 통계를 조회했습니다."));
    }
    
    @GetMapping("/analysis/{userId}")
    public ResponseEntity<ApiResponse<ExpenseAnalysisResponse>> getExpenseAnalysis(@PathVariable Long userId) {
        ExpenseAnalysisResponse response = statisticsService.getExpenseAnalysis(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "지출 분석 결과를 조회했습니다."));
    }
}
