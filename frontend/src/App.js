import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubscriptionPage from './pages/SubscriptionPage';
import StatisticsPage from './pages/StatisticsPage';
import Loading from './components/Loading';

// Private Route 컴포넌트
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading text="인증 확인 중..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route 컴포넌트 (로그인된 사용자는 대시보드로 리다이렉트)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading text="인증 확인 중..." />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// 임시 대시보드 컴포넌트
const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        대시보드
      </h1>
      <div className="text-center">
        <p className="text-gray-600">안녕하세요, {user?.name}님!</p>
        <p className="text-gray-600 mt-2">대시보드 기능이 곧 추가됩니다.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />
            
            {/* Private Routes with Header */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <Dashboard />
                  </div>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/subscriptions" 
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <SubscriptionPage />
                  </div>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <StatisticsPage />
                  </div>
                </PrivateRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
