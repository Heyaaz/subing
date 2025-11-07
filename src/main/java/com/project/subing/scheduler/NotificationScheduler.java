package com.project.subing.scheduler;

import com.project.subing.domain.notification.entity.NotificationType;
import com.project.subing.domain.subscription.entity.UserSubscription;
import com.project.subing.repository.UserSubscriptionRepository;
import com.project.subing.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final NotificationService notificationService;

    // 매일 자정에 실행 (결제일 알림 체크)
    @Scheduled(cron = "0 0 0 * * *")
    public void checkPaymentDueNotifications() {
        log.info("결제일 알림 체크 시작");

        List<UserSubscription> activeSubscriptions = userSubscriptionRepository.findAll()
                .stream()
                .filter(UserSubscription::getIsActive)
                .toList();

        LocalDate today = LocalDate.now();

        for (UserSubscription subscription : activeSubscriptions) {
            try {
                LocalDate nextBillingDate = subscription.getNextBillingDate();
                long daysUntilBilling = ChronoUnit.DAYS.between(today, nextBillingDate);

                // 3일 전 알림
                if (daysUntilBilling == 3) {
                    String title = "결제일 3일 전 알림";
                    String message = String.format("%s 구독이 3일 후(%s)에 결제됩니다. 금액: %,d원",
                            subscription.getService().getServiceName(),
                            nextBillingDate,
                            subscription.getMonthlyPrice());

                    notificationService.createNotification(
                            subscription.getUser().getId(),
                            NotificationType.PAYMENT_DUE_3DAYS,
                            title,
                            message,
                            subscription.getId()
                    );
                }

                // 1일 전 알림
                if (daysUntilBilling == 1) {
                    String title = "결제일 1일 전 알림";
                    String message = String.format("%s 구독이 내일(%s) 결제됩니다. 금액: %,d원",
                            subscription.getService().getServiceName(),
                            nextBillingDate,
                            subscription.getMonthlyPrice());

                    notificationService.createNotification(
                            subscription.getUser().getId(),
                            NotificationType.PAYMENT_DUE_1DAY,
                            title,
                            message,
                            subscription.getId()
                    );
                }
            } catch (Exception e) {
                log.error("결제일 알림 생성 실패 - subscriptionId: {}", subscription.getId(), e);
            }
        }

        log.info("결제일 알림 체크 완료");
    }
}
