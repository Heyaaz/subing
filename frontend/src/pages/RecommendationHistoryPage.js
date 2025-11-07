import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';
import { useAuth } from '../context/AuthContext';

const RecommendationHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await recommendationService.getRecommendationHistory(user.id);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewRecommendation = (item) => {
    try {
      const resultData = JSON.parse(item.resultData);
      navigate('/recommendation/result', {
        state: { recommendations: resultData, recommendationId: item.id }
      });
    } catch (error) {
      console.error('Failed to parse recommendation data:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">추천 기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">추천 기록</h1>
            <p className="text-gray-600">이전에 받았던 AI 추천을 확인하세요</p>
          </div>
          <button
            onClick={() => navigate('/recommendation/quiz')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            새 추천 받기
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">추천 기록이 없습니다</h3>
            <p className="text-gray-600 mb-6">AI 추천 테스트를 진행하여 맞춤 서비스를 찾아보세요!</p>
            <button
              onClick={() => navigate('/recommendation/quiz')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              추천 테스트 시작하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => {
              let quizData, resultData;
              try {
                quizData = JSON.parse(item.quizData);
                resultData = JSON.parse(item.resultData);
              } catch (error) {
                return null;
              }

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                  onClick={() => viewRecommendation(item)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                          #{history.length - index}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {quizData.interests?.map((interest, i) => (
                          <span
                            key={i}
                            className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                          >
                            {interest}
                          </span>
                        ))}
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                          예산: {quizData.budget?.toLocaleString()}원
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">
                        {resultData.recommendations?.length || 0}개 서비스 추천받음
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm">
                      자세히 보기
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-2 flex-wrap">
                      {resultData.recommendations?.slice(0, 3).map((rec, i) => (
                        <span
                          key={i}
                          className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded"
                        >
                          {rec.serviceName}
                        </span>
                      ))}
                      {resultData.recommendations?.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded">
                          +{resultData.recommendations.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationHistoryPage;
