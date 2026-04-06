package com.smartcampus.services;

import com.smartcampus.models.Notification;
import com.smartcampus.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    @Autowired
    private SseNotificationService sseNotificationService;

    public void createNotification(String userId, String message, String type, String referenceId) {
        Notification notification = new Notification(userId, message, type, referenceId);
        Notification saved = repository.save(notification);
        // Emit to SSE
        sseNotificationService.sendNotification(userId, saved);
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return repository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        repository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            repository.save(n);
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = repository.findByRecipientIdOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        repository.saveAll(unread);
    }

    public long getUnreadCount(String userId) {
        return repository.countByRecipientIdAndIsReadFalse(userId);
    }
}
