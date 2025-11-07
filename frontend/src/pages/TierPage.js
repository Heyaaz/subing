import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const TierPage = () => {
  const { user } = useAuth();
  const [tierInfo, setTierInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTierInfo();
    }
  }, [user?.id]);

  const fetchTierInfo = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await userService.getUserTierInfo(user.id);
      setTierInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch tier info:', error);
      alert('티어 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user?.id) return;
    if (!window.confirm('PRO 티어로 업그레이드하시겠습니까? (월 9,900원)')) {
      return;
    }

    try {
      await userService.upgradeTier(user.id, 'PRO');
      alert('PRO 티어로 업그레이드되었습니다!');
      fetchTierInfo(); // 정보 새로고침
    } catch (error) {
      console.error('Failed to upgrade tier:', error);
      alert('티어 업그레이드에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">티어 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!tierInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">티어 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const { tier, tierLimits, currentUsage } = tierInfo;
  const isFree = tier === 'FREE';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">멤버십 & 사용량</h1>
          <p className="text-gray-600">현재 멤버십 등급과 이번 달 사용량을 확인하세요</p>
        </div>

        {/* 현재 티어 카드 */}
        <div className={`rounded-lg shadow-lg p-8 mb-6 ${
          isFree ? 'bg-gradient-to-r from-gray-100 to-gray-200' : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-semibold mb-2">{isFree ? '🆓 무료 멤버십' : '⭐ 프리미엄 멤버십'}</div>
              <h2 className="text-3xl font-bold mb-2">{tierLimits.tierDescription}</h2>
              <p className="text-lg opacity-90">
                {isFree ? '무료' : `월 ${tierLimits.monthlyPrice.toLocaleString()}원`}
              </p>
            </div>
            {isFree && (
              <button
                onClick={handleUpgrade}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                PRO로 업그레이드
              </button>
            )}
          </div>
        </div>

        {/* 사용량 카드 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            이번 달 사용량 ({currentUsage.year}년 {currentUsage.month}월)
          </h3>

          <div className="space-y-6">
            {/* GPT 추천 사용량 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">🤖 AI 추천</span>
                <span className="text-gray-900 font-bold">
                  {currentUsage.gptRecommendationCount} / {
                    tierLimits.maxGptRecommendations === -1 ? '무제한' : tierLimits.maxGptRecommendations
                  }
                </span>
              </div>
              {tierLimits.maxGptRecommendations !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      currentUsage.remainingGptRecommendations === 0 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (currentUsage.gptRecommendationCount / tierLimits.maxGptRecommendations) * 100,
                        100
                      )}%`
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {currentUsage.remainingGptRecommendations === -1
                  ? '무제한 사용 가능'
                  : `${currentUsage.remainingGptRecommendations}회 남음`}
              </p>
            </div>

            {/* 최적화 체크 사용량 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">⚡ 최적화 체크</span>
                <span className="text-gray-900 font-bold">
                  {currentUsage.optimizationCheckCount} / {
                    tierLimits.maxOptimizationChecks === -1 ? '무제한' : tierLimits.maxOptimizationChecks
                  }
                </span>
              </div>
              {tierLimits.maxOptimizationChecks !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      currentUsage.remainingOptimizationChecks === 0 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (currentUsage.optimizationCheckCount / tierLimits.maxOptimizationChecks) * 100,
                        100
                      )}%`
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {currentUsage.remainingOptimizationChecks === -1
                  ? '무제한 사용 가능'
                  : `${currentUsage.remainingOptimizationChecks}회 남음`}
              </p>
            </div>
          </div>
        </div>

        {/* PRO 티어 혜택 안내 (FREE 사용자에게만) */}
        {isFree && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🌟 PRO 멤버십 혜택</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900 font-semibold">AI 추천 무제한</p>
                  <p className="text-gray-600 text-sm">매월 제한 없이 AI 추천을 받을 수 있습니다</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900 font-semibold">최적화 체크 무제한</p>
                  <p className="text-gray-600 text-sm">언제든지 구독 최적화를 확인할 수 있습니다</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <p className="text-gray-900 font-semibold">프리미엄 기능 이용</p>
                  <p className="text-gray-600 text-sm">향후 추가되는 프리미엄 기능을 모두 이용할 수 있습니다</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              지금 PRO로 업그레이드 (월 9,900원)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TierPage;