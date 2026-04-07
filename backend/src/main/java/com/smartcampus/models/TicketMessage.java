package com.smartcampus.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketMessage {
    private String id = UUID.randomUUID().toString();
    private String senderId;
    private String senderName;
    private Role senderRole;
    private String content;
    private LocalDateTime timestamp;
    private boolean edited = false;
    private boolean deleted = false;
}

