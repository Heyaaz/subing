import React, { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { useAuth } from '../context/AuthContext';

const BudgetPage = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    monthlyLimit: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchBudgets();
      fetchCurrentBudget();
    }
  }, [user?.id]);

  const fetchBudgets = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await budgetService.getAllBudgets(user.id);
      setBudgets(response.data || []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentBudget = async () => {
    if (!user?.id) return;
    try {
      const response = await budgetService.getCurrentMonthBudget(user.id);
      setCurrentBudget(response.data);
    } catch (error) {
      console.error('Failed to fetch current budget:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!formData.monthlyLimit || formData.monthlyLimit <= 0) {
      alert('예산 금액을 입력해주세요.');
      return;
    }

    try {
      await budgetService.setBudget(
        user.id,
        parseInt(formData.year),
        parseInt(formData.month),
        parseInt(formData.monthlyLimit)
      );
      alert('예산이 설정되었습니다.');
      setShowForm(false);
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        monthlyLimit: ''
      });
      fetchBudgets();
      fetchCurrentBudget();
    } catch (error) {
      console.error('Failed to set budget:', error);
      alert('예산 설정에 실패했습니다.');
    }
  };

  const handleDelete = async (budgetId) => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!window.confirm('예산을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await budgetService.deleteBudget(budgetId, user.id);
      alert('예산이 삭제되었습니다.');
      fetchBudgets();
      fetchCurrentBudget();
    } catch (error) {
      console.error('Failed to delete budget:', error);
      alert('예산 삭제에 실패했습니다.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">예산 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">예산 관리</h1>
            <p className="text-gray-600">월별 구독 예산을 설정하고 관리하세요</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            {showForm ? '취소' : '예산 설정'}
          </button>
        </div>

        {/* 현재 월 예산 카드 */}
        {currentBudget && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <h2 className="text-xl font-semibold mb-2">
              {currentBudget.year}년 {currentBudget.month}월 예산
            </h2>
            <p className="text-3xl font-bold">{formatCurrency(currentBudget.monthlyLimit)}</p>
            <p className="text-sm mt-2 opacity-90">
              현재 월 예산입니다. 초과 시 알림을 받습니다.
            </p>
          </div>
        )}

        {/* 예산 설정 폼 */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">예산 설정</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연도
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예산 금액 (원)
                  </label>
                  <input
                    type="number"
                    name="monthlyLimit"
                    value={formData.monthlyLimit}
                    onChange={handleInputChange}
                    placeholder="예: 50000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                예산 설정
              </button>
            </form>
          </div>
        )}

        {/* 예산 목록 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">예산 목록</h2>
          </div>
          {budgets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                설정된 예산이 없습니다
              </h3>
              <p className="text-gray-600">
                예산을 설정하여 구독 지출을 관리하세요.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {budgets.map((budget) => (
                <div key={budget.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {budget.year}년 {budget.month}월
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(budget.monthlyLimit)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        설정일: {new Date(budget.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
