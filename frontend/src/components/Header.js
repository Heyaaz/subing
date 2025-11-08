import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
  };

  // 읽지 않은 알림 개수 조회
  const fetchUnreadCount = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await notificationService.getUnreadCount(user.id);
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // 30초마다 폴링
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount(); // 초기 로드

      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // 30초

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.id]);

  const navigationItems = [
    { path: '/dashboard', label: '대시보드' },
    { path: '/subscriptions', label: '내 구독' },
    { path: '/budget', label: '예산 관리' },
    { path: '/optimization', label: '최적화' },
    { path: '/comparison', label: '서비스 비교' },
    { path: '/recommendation/quiz', label: 'AI 추천' },
    { path: '/statistics', label: '지출 분석' },
    { path: '/tier', label: '멤버십' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <img
                src="/Subing-logo.png"
                alt="Subing"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          {isAuthenticated && (
            <>
              <nav className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                {/* 알림 아이콘 */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <span className="text-gray-700">
                  안녕하세요, {user?.name}님
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  로그아웃
                </button>
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* 모바일 메뉴 */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <span>알림</span>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <div className="px-3 py-2 text-sm text-gray-700">
                  안녕하세요, {user?.name}님
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  로그아웃
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
