import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock 프로필 데이터
const MOCK_PROFILE = {
  profileType: {
    emoji: '🎬',
    name: '구독 덕후형',
    englishName: 'Content Collector',
    description: '구독 많을수록 행복해!',
    quote: '내 구독 리스트는 내 정체성이야!'
  },
  scores: {
    content: 85,
    price: 30,
    health: 40,
    selfDev: 60,
    digital: 80
  },
  budget: '월 5만원 이상 (프리미엄형)',
  interestedCategories: ['스트리밍', '음악', '독서', '클라우드'],
  recommendations: [
    { name: '넷플릭스 프리미엄', price: '월 17,000원', emoji: '📺' },
    { name: '유튜브 프리미엄', price: '월 14,900원', emoji: '▶️' },
    { name: '밀리의 서재', price: '월 9,900원', emoji: '📚' },
    { name: '디즈니플러스', price: '월 13,900원', emoji: '🏰' }
  ],
  lastTestDate: '2025-11-12'
};

function PreferenceProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API 호출 (나중에 실제 API로 대체)
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Mock 데이터 로드
      setTimeout(() => {
        setProfile(MOCK_PROFILE);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      setLoading(false);
    }
  };

  const handleRetakeTest = () => {
    if (window.confirm('기존 결과를 삭제하고 다시 검사하시겠습니까?')) {
      navigate('/preferences/test');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-6xl">⏳</div>
          <p className="text-lg text-gray-600">프로필 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
            <div className="text-6xl">🤔</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                아직 검사를 안 하셨네요!
              </h2>
              <p className="text-gray-600">
                성향 테스트를 완료하고<br />
                나만의 프로필을 만들어보세요
              </p>
            </div>
            <button
              onClick={() => navigate('/preferences/test')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              테스트 시작하기 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const labels = {
    content: '콘텐츠 소비',
    price: '가성비 선호',
    health: '건강 관심',
    selfDev: '자기계발',
    digital: '디지털 도구'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            💸 내 디지털 월세 프로필
          </h1>

          <div className="space-y-3">
            <div className="text-7xl">{profile.profileType.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.profileType.name}
              </h2>
              <p className="text-lg text-blue-600 font-semibold mt-2">
                "{profile.profileType.description}"
              </p>
            </div>
          </div>
        </div>

        {/* 성향 레이더 차트 (간단한 바 차트로 대체) */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📊 성향 레이더 차트
          </h3>

          <div className="space-y-4">
            {Object.entries(profile.scores).map(([key, value]) => (
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
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 관심 카테고리 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🏷️ 관심 카테고리
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.interestedCategories.map((category, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                #{category}
              </span>
            ))}
          </div>
        </div>

        {/* 월 예산 범위 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            💰 월 예산 범위
          </h3>
          <div className="bg-purple-50 rounded-2xl p-6">
            <p className="text-lg font-bold text-purple-600">
              {profile.budget}
            </p>
          </div>
        </div>

        {/* 추천받은 서비스 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            💡 추천받은 서비스 ({profile.recommendations.length}개)
          </h3>
          <div className="space-y-3">
            {profile.recommendations.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 flex items-center gap-3"
              >
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
            ))}
          </div>
        </div>

        {/* 마지막 검사일 */}
        <div className="text-center text-sm text-gray-500">
          마지막 검사: {profile.lastTestDate}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleRetakeTest}
            className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
          >
            다시 검사하기
          </button>
          <button
            onClick={() => navigate('/recommendation/quiz')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            AI 추천 받기 →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferenceProfilePage;
