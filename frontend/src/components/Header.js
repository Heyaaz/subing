import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">
              Subing
            </h1>
          </div>

          {/* 네비게이션 */}
          {isAuthenticated && (
            <nav className="flex items-center space-x-6">
              <span className="text-gray-700">
                안녕하세요, {user?.name}님
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                로그아웃
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
