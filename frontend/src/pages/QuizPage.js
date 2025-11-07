import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';
import { useAuth } from '../context/AuthContext';

const QuizPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [quizData, setQuizData] = useState({
    interests: [],
    budget: 30000,
    purpose: '',
    priorities: []
  });

  const handleInterestToggle = (interest) => {
    setQuizData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (quizData.interests.length === 0) {
      alert('관심 분야를 하나 이상 선택해주세요.');
      return;
    }
    if (!quizData.purpose) {
      alert('사용 목적을 선택해주세요.');
      return;
    }
    if (quizData.priorities.length === 0) {
      alert('중요도를 하나 이상 선택해주세요.');
      return;
    }

    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      const response = await recommendationService.getAIRecommendations(user.id, quizData);

      navigate('/recommendation/result', {
        state: {
          recommendations: response.data,
          recommendationId: response.data.id // 추천 ID 전달
        }
      });
    } catch (error) {
      alert('추천을 생성하는데 실패했습니다. 다시 시도해주세요.');
      console.error('Get recommendations error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="quiz-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">관심 분야를 선택해주세요</h2>
            <p className="text-gray-600 mb-6">복수 선택 가능합니다</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['OTT', 'MUSIC', 'CLOUD', 'AI', 'DESIGN', 'DELIVERY', 'ETC'].map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-6 rounded-lg border-2 transition font-semibold ${
                    quizData.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="quiz-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">월 예산을 선택해주세요</h2>
            <div className="space-y-4">
              {[10000, 30000, 50000, 100000].map(budget => (
                <button
                  key={budget}
                  onClick={() => setQuizData(prev => ({ ...prev, budget }))}
                  className={`w-full p-6 rounded-lg border-2 transition text-left ${
                    quizData.budget === budget
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl font-semibold">{budget.toLocaleString()}원</span>
                  <span className="text-sm ml-2 text-gray-500">이하</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="quiz-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">사용 목적을 선택해주세요</h2>
            <div className="space-y-4">
              {[
                { value: 'PERSONAL', label: '개인 취미/여가' },
                { value: 'WORK', label: '업무/생산성' },
                { value: 'EDUCATION', label: '학습/교육' },
                { value: 'FAMILY', label: '가족과 함께' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setQuizData(prev => ({ ...prev, purpose: option.value }))}
                  className={`w-full p-6 rounded-lg border-2 transition text-left ${
                    quizData.purpose === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl font-semibold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="quiz-step">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">중요도 순위를 선택해주세요</h2>
            <p className="text-gray-600 mb-6">복수 선택 가능합니다 (선택 순서대로 중요도가 높아집니다)</p>
            <div className="space-y-4">
              {[
                { value: 'PRICE', label: '가격' },
                { value: 'CONTENT', label: '콘텐츠 양' },
                { value: 'USABILITY', label: '사용 편의성' },
                { value: 'BRAND', label: '브랜드 인지도' }
              ].map(priority => (
                <button
                  key={priority.value}
                  onClick={() => {
                    if (quizData.priorities.includes(priority.value)) {
                      setQuizData(prev => ({
                        ...prev,
                        priorities: prev.priorities.filter(p => p !== priority.value)
                      }));
                    } else {
                      setQuizData(prev => ({
                        ...prev,
                        priorities: [...prev.priorities, priority.value]
                      }));
                    }
                  }}
                  className={`w-full p-6 rounded-lg border-2 transition flex items-center justify-between ${
                    quizData.priorities.includes(priority.value)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl font-semibold">{priority.label}</span>
                  {quizData.priorities.includes(priority.value) && (
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {quizData.priorities.indexOf(priority.value) + 1}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">AI가 당신을 위한 추천을 생성하고 있습니다...</h2>
          <p className="text-gray-600">잠시만 기다려주세요 (약 5-10초 소요)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">진행률</span>
            <span className="text-sm font-medium text-blue-600">{step}/4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 렌더링 */}
        {renderStep()}

        {/* 버튼 */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              추천 받기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
