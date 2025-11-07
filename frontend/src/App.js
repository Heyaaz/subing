import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubscriptionPage from './pages/SubscriptionPage';
import StatisticsPage from './pages/StatisticsPage';
import ComparisonPage from './pages/ComparisonPage';
import QuizPage from './pages/QuizPage';
import RecommendationResultPage from './pages/RecommendationResultPage';
import RecommendationHistoryPage from './pages/RecommendationHistoryPage';
import NotificationPage from './pages/NotificationPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import BudgetPage from './pages/BudgetPage';
import OptimizationPage from './pages/OptimizationPage';
import TierPage from './pages/TierPage';
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
            <Route
              path="/comparison"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <ComparisonPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/recommendation/quiz"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <QuizPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/recommendation/result"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <RecommendationResultPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/recommendation/history"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <RecommendationHistoryPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <NotificationPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/notification-settings"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <NotificationSettingsPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <BudgetPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/optimization"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <OptimizationPage />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/tier"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <TierPage />
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
