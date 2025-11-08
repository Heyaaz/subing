import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';
import { useAuth } from '../context/AuthContext';
import { Button, Badge } from '../components/common';
import Loading from '../components/Loading';
import TierLimitModal from '../components/TierLimitModal';

const QuizPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);

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
      alert('로그인이 필요해요.');
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
      console.error('Get recommendations error:', error);
      // 티어 제한 에러인 경우 모달 표시
      const errorMessage = error?.message || error?.error || '';
      if (errorMessage.includes('GPT 추천 사용 횟수') || errorMessage.includes('업그레이드')) {
        setShowTierModal(true);
      } else {
        alert('추천을 생성하지 못했어요. 다시 시도해주세요.');
      }
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
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
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl font-semibold">{priority.label}</span>
                  {quizData.priorities.includes(priority.value) && (
                    <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
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
    return <Loading text="AI가 맞춤 추천을 생성하고 있어요... (약 5-10초 소요)" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">진행률</span>
            <span className="text-sm font-medium text-primary-600">{step}/4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 렌더링 */}
        {renderStep()}

        {/* 버튼 */}
        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            이전
          </Button>

          {step < 4 ? (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
            >
              다음
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              추천 받기
            </Button>
          )}
        </div>
      </div>

      {/* 티어 제한 모달 */}
      <TierLimitModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        limitType="gpt"
      />
    </div>
  );
};

export default QuizPage;
