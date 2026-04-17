package com.smartcampus.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String senderId;
    private String senderName;
    private Role senderRole;
    private String subject;
    private String description;
    private String category; // e.g., "Hardware", "Software", "Facility"
    private String priority; // e.g., "LOW", "MEDIUM", "HIGH", "URGENT"
    private String contactDetails;
    private String phoneNumber;
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    private String rejectionReason;
    private String assignedTo; // Technician User ID
    private String resolutionNotes;
    private List<String> attachments = new ArrayList<>(); // Cloudinary URLs
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private List<TicketMessage> messages = new ArrayList<>();
}
