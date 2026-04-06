package com.smartcampus.controllers;

import com.smartcampus.models.User;
import com.smartcampus.services.NotificationService;
import com.smartcampus.services.UserService;
import com.smartcampus.services.SseNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final SseNotificationService sseNotificationService;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService,
            SseNotificationService sseNotificationService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.sseNotificationService = sseNotificationService;
    }

    @GetMapping(path = "/stream", produces = "text/event-stream")
    public SseEmitter streamNotifications() {
        return userService.getCurrentUser()
                .map(user -> sseNotificationService.subscribe(user.getId()))
                .orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        return userService.getCurrentUser()
                .map(user -> ResponseEntity.ok(notificationService.getNotificationsForUser(user.getId())))
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        return userService.getCurrentUser()
                .map(user -> ResponseEntity.ok(notificationService.getUnreadCount(user.getId())))
                .orElse(ResponseEntity.status(401).build());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        Optional<User> userOpt = userService.getCurrentUser();
        if (userOpt.isPresent()) {
            notificationService.markAllAsRead(userOpt.get().getId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }
}
