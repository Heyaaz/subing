package com.project.subing.service;

import com.project.subing.domain.notification.entity.Notification;
import com.project.subing.domain.notification.entity.NotificationType;
import com.project.subing.domain.user.entity.User;
import com.project.subing.repository.NotificationRepository;
import com.project.subing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification createNotification(Long userId, NotificationType type, String title,
                                          String message, Long relatedSubscriptionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 중복 알림 방지 (같은 구독에 대한 같은 타입의 알림이 이미 존재하면 생성하지 않음)
        if (relatedSubscriptionId != null &&
            notificationRepository.existsByUser_IdAndRelatedSubscriptionIdAndType(
                userId, relatedSubscriptionId, type)) {
            return null;
        }

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .relatedSubscriptionId(relatedSubscriptionId)
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotifications(Long userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_IdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        notification.markAsRead();
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(Notification::markAsRead);
    }
}
