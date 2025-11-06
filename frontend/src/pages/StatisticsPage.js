import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statisticsService } from '../services/statisticsService';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import MonthlyExpenseChart from '../components/charts/MonthlyExpenseChart';
import CategoryExpenseChart from '../components/charts/CategoryExpenseChart';

const StatisticsPage = () => {
  const [monthlyExpense, setMonthlyExpense] = useState(null);
  const [expenseAnalysis, setExpenseAnalysis] = useState(null);
  const [yearlyTrend, setYearlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user, selectedYear, selectedMonth]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [monthlyResponse, analysisResponse, trendData] = await Promise.all([
        statisticsService.getMonthlyExpense(user.id, selectedYear, selectedMonth),
        statisticsService.getExpenseAnalysis(user.id),
        statisticsService.getYearlyTrend(user.id, selectedYear)
      ]);

      setMonthlyExpense(monthlyResponse.data);
      setExpenseAnalysis(analysisResponse.data);
      setYearlyTrend(trendData.map(item => ({
        month: item.month,
        amount: item.totalAmount
      })));
    } catch (error) {
      setError('통계 데이터를 불러오는데 실패했습니다.');
      console.error('Load statistics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString() || '0';
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1) || '0'}%`;
  };

  if (loading) {
    return <Loading text="통계 데이터를 불러오는 중..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">통계 대시보드</h1>
          
          <div className="flex space-x-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                );
              })}
            </select>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}

        {/* 월별 지출 요약 */}
        {monthlyExpense && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">이번 달 총 지출</h3>
              <p className="text-3xl font-bold text-primary-600">
                {formatCurrency(monthlyExpense.totalAmount)}원
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">활성 구독 수</h3>
              <p className="text-3xl font-bold text-green-600">
                {monthlyExpense.activeSubscriptionCount}개
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">평균 구독 비용</h3>
              <p className="text-3xl font-bold text-blue-600">
                {monthlyExpense.activeSubscriptionCount > 0 
                  ? formatCurrency(monthlyExpense.totalAmount / monthlyExpense.activeSubscriptionCount)
                  : '0'
                }원
              </p>
            </div>
          </div>
        )}

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 월별 지출 트렌드 차트 */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">월별 지출 트렌드 ({selectedYear}년)</h2>
            <MonthlyExpenseChart data={yearlyTrend} />
          </div>

          {/* 카테고리별 지출 차트 */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">카테고리별 지출 분포</h2>
            <CategoryExpenseChart data={monthlyExpense?.categoryExpenses || []} />
          </div>
        </div>

        {/* 카테고리별 지출 상세 */}
        {monthlyExpense?.categoryExpenses && monthlyExpense.categoryExpenses.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">카테고리별 지출 상세</h2>
            <div className="space-y-4">
              {monthlyExpense.categoryExpenses.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{category.category}</h3>
                      <span className="text-sm text-gray-600">{formatPercentage(category.percentage)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">
                        {category.serviceNames?.join(', ') || '서비스 없음'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(category.totalAmount)}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 지출 분석 */}
        {expenseAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 월별 변화 */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">월별 변화</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">이번 달</span>
                  <span className="font-medium">{formatCurrency(expenseAnalysis.currentMonthTotal)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">지난 달</span>
                  <span className="font-medium">{formatCurrency(expenseAnalysis.previousMonthTotal)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">변화량</span>
                  <span className={`font-medium ${
                    expenseAnalysis.monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {expenseAnalysis.monthlyChange >= 0 ? '+' : ''}{formatCurrency(expenseAnalysis.monthlyChange)}원
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">변화율</span>
                  <span className={`font-medium ${
                    expenseAnalysis.monthlyChangePercentage >= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {expenseAnalysis.monthlyChangePercentage >= 0 ? '+' : ''}{formatPercentage(expenseAnalysis.monthlyChangePercentage)}
                  </span>
                </div>
              </div>
            </div>

            {/* 연간 통계 */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">연간 통계</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">연간 총 지출</span>
                  <span className="font-medium">{formatCurrency(expenseAnalysis.yearlyTotal)}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">월평균 지출</span>
                  <span className="font-medium">{formatCurrency(expenseAnalysis.averageMonthlyExpense)}원</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 추천사항 */}
        {expenseAnalysis?.recommendations && expenseAnalysis.recommendations.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">추천사항</h2>
            <ul className="space-y-2">
              {expenseAnalysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 데이터가 없는 경우 */}
        {(!monthlyExpense || monthlyExpense.totalAmount === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">통계 데이터가 없습니다.</p>
            <p className="text-gray-400 mt-2">구독을 추가하면 통계를 확인할 수 있습니다.</p>
          </div>
        )}
    </div>
  );
};

export default StatisticsPage;
