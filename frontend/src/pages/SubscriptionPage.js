import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    serviceId: '',
    planName: '',
    monthlyPrice: '',
    billingCycle: 'MONTHLY',
    billingDate: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getSubscriptions(user.id);
      setSubscriptions(response.data || []);
    } catch (error) {
      setError('구독 목록을 불러오는데 실패했습니다.');
      console.error('Load subscriptions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscriptionService.createSubscription({
        ...formData,
        userId: user.id,
        monthlyPrice: parseInt(formData.monthlyPrice),
        billingDate: parseInt(formData.billingDate)
      });
      setShowAddForm(false);
      setFormData({
        serviceId: '',
        planName: '',
        monthlyPrice: '',
        billingCycle: 'MONTHLY',
        billingDate: '',
        notes: ''
      });
      loadSubscriptions();
    } catch (error) {
      setError('구독 추가에 실패했습니다.');
      console.error('Add subscription error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 구독을 삭제하시겠습니까?')) {
      try {
        await subscriptionService.deleteSubscription(id);
        loadSubscriptions();
      } catch (error) {
        setError('구독 삭제에 실패했습니다.');
        console.error('Delete subscription error:', error);
      }
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await subscriptionService.toggleSubscriptionStatus(id, !isActive);
      loadSubscriptions();
    } catch (error) {
      setError('구독 상태 변경에 실패했습니다.');
      console.error('Toggle status error:', error);
    }
  };

  if (loading) {
    return <Loading text="구독 목록을 불러오는 중..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">구독 관리</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            구독 추가
          </button>
        </div>

        {error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}

        {/* 구독 목록 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {subscription.serviceName || '서비스명'}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subscription.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.isActive ? '활성' : '비활성'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">요금제:</span> {subscription.planName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">월 요금:</span> {subscription.monthlyPrice?.toLocaleString()}원
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">결제일:</span> 매월 {subscription.billingDate}일
                </p>
                {subscription.notes && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">메모:</span> {subscription.notes}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleStatus(subscription.id, subscription.isActive)}
                  className={`px-3 py-1 rounded text-sm ${
                    subscription.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {subscription.isActive ? '비활성화' : '활성화'}
                </button>
                <button
                  onClick={() => handleDelete(subscription.id)}
                  className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">등록된 구독이 없습니다.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 btn-primary"
            >
              첫 번째 구독 추가하기
            </button>
          </div>
        )}

        {/* 구독 추가 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">구독 추가</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    서비스 ID
                  </label>
                  <input
                    type="number"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="서비스 ID를 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    요금제명
                  </label>
                  <input
                    type="text"
                    name="planName"
                    value={formData.planName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="요금제명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    월 요금
                  </label>
                  <input
                    type="number"
                    name="monthlyPrice"
                    value={formData.monthlyPrice}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="월 요금을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    결제 주기
                  </label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="MONTHLY">월간</option>
                    <option value="YEARLY">연간</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    결제일
                  </label>
                  <input
                    type="number"
                    name="billingDate"
                    value={formData.billingDate}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="매월 몇 일 (1-31)"
                    min="1"
                    max="31"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메모
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-field"
                    rows="3"
                    placeholder="메모를 입력하세요 (선택사항)"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default SubscriptionPage;
