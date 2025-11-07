import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RecommendationResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recommendations = location.state?.recommendations;

  if (!recommendations) {
    navigate('/recommendation/quiz');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">당신을 위한 추천</h1>
        <p className="text-gray-600 mb-8">AI가 분석한 맞춤 구독 서비스입니다</p>

        {/* 추천 카드 */}
        <div className="space-y-6 mb-8">
          {recommendations.recommendations?.map((rec, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{rec.serviceName}</h3>
                  <p className="text-gray-600 mt-1">추천 점수: <span className="font-semibold text-blue-600">{rec.score}/100</span></p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* 추천 이유 */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">✨ 추천 이유</h4>
                <p className="text-blue-800">{rec.mainReason}</p>
              </div>

              {/* 장점 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">👍 장점</h4>
                <ul className="space-y-2">
                  {rec.pros?.map((pro, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✅</span>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 단점 */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">⚠️ 단점</h4>
                <ul className="space-y-2">
                  {rec.cons?.map((con, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-0.5">❌</span>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 팁 */}
              {rec.tip && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                  <p className="text-yellow-900">
                    <span className="font-semibold">💡 추천 팁:</span> {rec.tip}
                  </p>
                </div>
              )}

              {/* 구독 추가 버튼 */}
              <button
                onClick={() => navigate('/subscriptions')}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                구독 관리 페이지로 이동
              </button>
            </div>
          ))}
        </div>

        {/* 전체 요약 */}
        {recommendations.summary && (
          <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📝 전체 요약</h3>
            <p className="text-gray-700 leading-relaxed">{recommendations.summary}</p>

            {recommendations.alternatives && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">💭 대안:</span> {recommendations.alternatives}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 다시 테스트하기 */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/recommendation/quiz')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            다시 테스트하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResultPage;
