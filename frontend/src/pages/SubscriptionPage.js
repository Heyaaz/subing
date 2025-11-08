import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import { serviceService } from '../services/serviceService';
import { Button, Card, Badge, Alert, EmptyState, Input } from '../components/common';
import Loading from '../components/Loading';

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const { user } = useAuth();

  // 필터/정렬 상태
  const [filters, setFilters] = useState({
    category: '',
    isActive: '',
    sort: ''
  });

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
      loadServices();
    }
  }, [user, filters]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);

      // 필터 객체 생성 (빈 값 제외)
      const filterParams = {};
      if (filters.category) filterParams.category = filters.category;
      if (filters.isActive !== '') filterParams.isActive = filters.isActive === 'true';
      if (filters.sort) filterParams.sort = filters.sort;

      const response = await subscriptionService.getSubscriptions(user.id, filterParams);
      setSubscriptions(response.data || []);
    } catch (error) {
      setError('구독 목록을 불러오지 못했어요. 다시 시도해주세요.');
      console.error('Load subscriptions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await serviceService.getAllServices();
      setServices(response.data || []);
    } catch (error) {
      console.error('Load services error:', error);
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
      setError('구독을 추가하지 못했어요. 다시 시도해주세요.');
      console.error('Add subscription error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 이 구독을 삭제할까요?')) {
      try {
        await subscriptionService.deleteSubscription(id);
        loadSubscriptions();
      } catch (error) {
        setError('구독을 삭제하지 못했어요. 다시 시도해주세요.');
        console.error('Delete subscription error:', error);
      }
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await subscriptionService.toggleSubscriptionStatus(id, !isActive);
      loadSubscriptions();
    } catch (error) {
      setError('구독 상태를 변경하지 못했어요. 다시 시도해주세요.');
      console.error('Toggle status error:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      isActive: '',
      sort: ''
    });
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      serviceId: subscription.serviceId || '',
      planName: subscription.planName || '',
      monthlyPrice: subscription.monthlyPrice || '',
      billingCycle: subscription.billingCycle || 'MONTHLY',
      billingDate: subscription.billingDate || '',
      notes: subscription.notes || ''
    });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await subscriptionService.updateSubscription(editingSubscription.id, {
        ...formData,
        monthlyPrice: parseInt(formData.monthlyPrice),
        billingDate: parseInt(formData.billingDate)
      });
      setShowEditForm(false);
      setEditingSubscription(null);
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
      setError('구독을 수정하지 못했어요. 다시 시도해주세요.');
      console.error('Update subscription error:', error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingSubscription(null);
    setFormData({
      serviceId: '',
      planName: '',
      monthlyPrice: '',
      billingCycle: 'MONTHLY',
      billingDate: '',
      notes: ''
    });
  };

  if (loading) {
    return <Loading text="구독 목록을 불러오고 있어요..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">내 구독</h1>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
          >
            구독 추가하기
          </Button>
        </div>

        {/* 필터/정렬 UI */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 카테고리 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="OTT">OTT</option>
                <option value="AI">AI</option>
                <option value="MUSIC">음악</option>
                <option value="CLOUD">클라우드</option>
                <option value="DESIGN">디자인</option>
                <option value="DELIVERY">배달</option>
                <option value="ETC">기타</option>
              </select>
            </div>

            {/* 활성 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태
              </label>
              <select
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="true">활성</option>
                <option value="false">비활성</option>
              </select>
            </div>

            {/* 정렬 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정렬
              </label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">기본 (최신순)</option>
                <option value="price_asc">가격 낮은순</option>
                <option value="price_desc">가격 높은순</option>
                <option value="date_asc">등록일 오래된순</option>
                <option value="date_desc">등록일 최신순</option>
                <option value="name_asc">이름 오름차순</option>
                <option value="name_desc">이름 내림차순</option>
              </select>
            </div>

            {/* 필터 초기화 버튼 */}
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={handleResetFilters}
                className="w-full"
              >
                초기화
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <div className="mb-6">
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* 구독 목록 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} hover>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {subscription.serviceName || '서비스명'}
                </h3>
                <Badge variant={subscription.isActive ? 'success' : 'error'}>
                  {subscription.isActive ? '활성' : '비활성'}
                </Badge>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(subscription)}
                >
                  수정하기
                </Button>
                <Button
                  variant={subscription.isActive ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleStatus(subscription.id, subscription.isActive)}
                >
                  {subscription.isActive ? '비활성화' : '활성화'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(subscription.id)}
                >
                  삭제하기
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {subscriptions.length === 0 && (
          <EmptyState
            title="등록된 구독이 없어요"
            description="첫 구독을 추가하고 관리를 시작해보세요"
            action={
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                구독 추가하기
              </Button>
            }
          />
        )}

        {/* 구독 추가 모달 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">구독 추가하기</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    서비스 선택
                  </label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">서비스를 선택하세요</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
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
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    추가하기
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 구독 수정 모달 */}
        {showEditForm && editingSubscription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">구독 수정하기</h2>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    서비스명
                  </label>
                  <input
                    type="text"
                    value={editingSubscription.serviceName}
                    className="input-field bg-gray-100"
                    disabled
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
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                  >
                    수정하기
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="flex-1"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default SubscriptionPage;
