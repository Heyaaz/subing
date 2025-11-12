import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock 프로필 타입 (나중에 백엔드에서 계산)
const PROFILE_TYPES = {
  CONTENT_COLLECTOR: {
    emoji: '🎬',
    name: '구독 덕후형',
    englishName: 'Content Collector',
    description: '구독 많을수록 행복해!',
    fullDescription: '영상/음악/독서 다 좋아하는 콘텐츠 올인형',
    quote: '내 구독 리스트는 내 정체성이야!',
    budget: '월 5만원 이상',
    recommendations: [
      { name: '넷플릭스 프리미엄', price: '월 17,000원', emoji: '📺' },
      { name: '유튜브 프리미엄', price: '월 14,900원', emoji: '▶️' },
      { name: '밀리의 서재', price: '월 9,900원', emoji: '📚' },
      { name: '디즈니플러스 프리미엄', price: '월 13,900원', emoji: '🏰' }
    ]
  },
  SMART_SAVER: {
    emoji: '💰',
    name: '알뜰 구독러형',
    englishName: 'Smart Saver',
    description: '가성비 없으면 안 써!',
    fullDescription: '저렴하면서 실용적인 서비스만 쏙쏙',
    quote: '무료 체험 끝나면 바로 해지하는 게 나야!',
    budget: '월 1~3만원',
    recommendations: [
      { name: '쿠팡 로켓와우', price: '월 7,890원', emoji: '🚀' },
      { name: '티빙 베이직', price: '월 5,500원', emoji: '📺' },
      { name: '네이버 플러스 멤버십', price: '월 4,900원', emoji: '🟢' },
      { name: '왓챠', price: '월 7,900원', emoji: '🎬' }
    ]
  },
  PREMIUM_ENJOYER: {
    emoji: '💎',
    name: '프리미엄 러버형',
    englishName: 'Premium Enjoyer',
    description: '비싸도 좋으면 OK!',
    fullDescription: '브랜드와 품질 중시, 돈보다 가치',
    quote: '최고만 쓰는 게 내 스타일!',
    budget: '월 10만원 이상도 가능',
    recommendations: [
      { name: '애플원 프리미어', price: '월 33,000원', emoji: '🍎' },
      { name: 'ChatGPT Pro', price: '월 $200', emoji: '🤖' },
      { name: 'Adobe Creative Cloud', price: '월 65,000원', emoji: '🎨' },
      { name: 'Claude Max', price: '월 $200', emoji: '🧠' }
    ]
  }
};

function PreferenceResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileType, setProfileType] = useState(null);
  const [scores, setScores] = useState({
    content: 0,
    price: 0,
    health: 0,
    selfDev: 0,
    digital: 0
  });

  useEffect(() => {
    // location.state에서 answers 가져오기
    const answers = location.state?.answers || [];

    if (answers.length === 0) {
      // 답변 데이터가 없으면 테스트 페이지로 리다이렉트
      navigate('/preferences/test');
      return;
    }

    // Mock 점수 계산 (나중에 백엔드에서 처리)
    calculateScores(answers);
  }, [location, navigate]);

  const calculateScores = (answers) => {
    // Mock 계산 로직 (실제로는 백엔드에서 처리)
    // 간단하게 랜덤으로 프로필 타입 결정
    const types = Object.keys(PROFILE_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];

    setProfileType(PROFILE_TYPES[randomType]);
    setScores({
      content: Math.floor(Math.random() * 100),
      price: Math.floor(Math.random() * 100),
      health: Math.floor(Math.random() * 100),
      selfDev: Math.floor(Math.random() * 100),
      digital: Math.floor(Math.random() * 100)
    });
  };

  if (!profileType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-6xl">🎯</div>
          <p className="text-lg text-gray-600">분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 결과 헤더 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
          <div className="text-5xl">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">분석 완료!</h1>

          {/* 프로필 타입 */}
          <div className="space-y-4">
            <div className="text-7xl">{profileType.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                당신은... {profileType.name}
              </h2>
              <p className="text-lg text-blue-600 font-semibold mb-1">
                "{profileType.description}"
              </p>
              <p className="text-gray-600">
                {profileType.fullDescription}
              </p>
            </div>
          </div>

          {/* 한마디 */}
          <div className="bg-blue-50 rounded-2xl p-6">
            <p className="text-gray-700 text-lg font-medium">
              💬 {profileType.quote}
            </p>
          </div>
        </div>

        {/* 성향 분석 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📊 성향 분석
          </h3>

          <div className="space-y-4">
            {Object.entries(scores).map(([key, value]) => {
              const labels = {
                content: '콘텐츠 소비',
                price: '가성비 선호',
                health: '건강 관심',
                selfDev: '자기계발',
                digital: '디지털 도구'
              };

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {labels[key]}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 예상 디지털 월세 */}
          <div className="bg-purple-50 rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                💸 예상 디지털 월세
              </span>
              <span className="text-xl font-bold text-purple-600">
                {profileType.budget}
              </span>
            </div>
          </div>
        </div>

        {/* 맞춤 추천 서비스 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            💡 딱 맞는 추천 서비스
          </h3>

          <div className="space-y-3">
            {profileType.recommendations.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{service.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/recommendation/quiz')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            AI 맞춤 추천 받기 →
          </button>
          <button
            onClick={() => navigate('/preferences/test')}
            className="px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
          >
            다시 하기
          </button>
        </div>

        {/* 프로필 저장 */}
        <button
          onClick={() => navigate('/preferences/profile')}
          className="w-full py-4 px-6 rounded-xl text-blue-600 font-medium hover:bg-blue-50 transition-all duration-200"
        >
          내 프로필 저장하기
        </button>
      </div>
    </div>
  );
}

export default PreferenceResultPage;
