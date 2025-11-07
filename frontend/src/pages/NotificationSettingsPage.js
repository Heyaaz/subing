import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationSettingService } from '../services/notificationSettingService';

const NotificationSettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await notificationSettingService.getNotificationSettings(user.id);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      alert('알림 설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (notificationType, currentValue) => {
    if (!user?.id) return;
    try {
      await notificationSettingService.updateNotificationSetting(
        user.id,
        notificationType,
        !currentValue
      );

      // 로컬 상태 업데이트
      setSettings(prevSettings =>
        prevSettings.map(setting =>
          setting.notificationType === notificationType
            ? { ...setting, isEnabled: !currentValue }
            : setting
        )
      );
    } catch (error) {
      console.error('Failed to update notification setting:', error);
      alert('알림 설정 변경에 실패했습니다.');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'PAYMENT_DUE_3DAYS':
        return '⏰';
      case 'PAYMENT_DUE_1DAY':
        return '🔔';
      case 'BUDGET_EXCEEDED':
        return '💸';
      case 'UNUSED_SUBSCRIPTION':
        return '📦';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'PAYMENT_DUE_3DAYS':
        return 'bg-blue-50 border-blue-200';
      case 'PAYMENT_DUE_1DAY':
        return 'bg-orange-50 border-orange-200';
      case 'BUDGET_EXCEEDED':
        return 'bg-red-50 border-red-200';
      case 'UNUSED_SUBSCRIPTION':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">알림 설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">알림 설정</h1>
          <p className="text-gray-600">받고 싶은 알림 타입을 선택하세요</p>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="divide-y divide-gray-200">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className={`p-6 transition hover:bg-gray-50 ${getNotificationColor(setting.notificationType)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl">{getNotificationIcon(setting.notificationType)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {setting.description}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {setting.notificationType === 'PAYMENT_DUE_3DAYS' && '결제일 3일 전에 알림을 받습니다.'}
                        {setting.notificationType === 'PAYMENT_DUE_1DAY' && '결제일 1일 전에 알림을 받습니다.'}
                        {setting.notificationType === 'BUDGET_EXCEEDED' && '월별 예산을 초과하면 알림을 받습니다.'}
                        {setting.notificationType === 'UNUSED_SUBSCRIPTION' && '90일 이상 미사용 구독에 대해 알림을 받습니다.'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(setting.notificationType, setting.isEnabled)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      setting.isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        setting.isEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {settings.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">알림 설정이 없습니다</h3>
            <p className="text-gray-600">설정을 불러오는 중 문제가 발생했습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;