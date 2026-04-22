package com.smartcampus.controllers;

import com.smartcampus.models.Ticket;
import com.smartcampus.models.TicketMessage;
import com.smartcampus.models.User;
import com.smartcampus.models.Role;
import com.smartcampus.repositories.TicketRepository;
import com.smartcampus.services.CloudinaryService;
import com.smartcampus.services.EmailService;
import com.smartcampus.services.NotificationService;
import com.smartcampus.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final CloudinaryService cloudinaryService;
    private final EmailService emailService;

    public TicketController(TicketRepository ticketRepository, UserService userService, NotificationService notificationService, CloudinaryService cloudinaryService, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.userService = userService;
        this.notificationService = notificationService;
        this.cloudinaryService = cloudinaryService;
        this.emailService = emailService;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createTicket(
            @RequestParam("subject") String subject,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("priority") String priority,
            @RequestParam(value = "contactDetails", required = false) String contactDetails,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments) {
        
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Ticket ticket = new Ticket();
        ticket.setSenderId(user.getId());
        ticket.setSenderName(user.getName());
        ticket.setSenderRole(user.getRole());
        ticket.setSubject(subject);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setContactDetails(contactDetails);
        ticket.setPhoneNumber(phoneNumber);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setStatus("OPEN");
        ticket.setMessages(new ArrayList<>());
        ticket.setAttachments(new ArrayList<>());
        
        if (attachments != null && attachments.length > 0) {
            if (attachments.length > 3) return ResponseEntity.badRequest().body("Maximum 3 attachments allowed");
            for (MultipartFile file : attachments) {
                try {
                    String url = cloudinaryService.uploadImage(file);
                    ticket.getAttachments().add(url);
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
                }
            }
        }

        Ticket saved = ticketRepository.save(ticket);

        // Notify admins
        userService.getUsersByRole(Role.ADMIN).forEach(admin -> {
            notificationService.createNotification(
                admin.getId(),
                "New [" + category + "] Ticket: " + subject,
                "TICKET",
                saved.getId()
            );
        });

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets() {
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(ticketRepository.findBySenderId(user.getId()));
    }

    @GetMapping("/assigned")
    public ResponseEntity<?> getAssignedTickets() {
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).build();
        if (user.getRole() != Role.MAINTAIN_STAFF) return ResponseEntity.status(403).body("Only maintenance staff can view assigned tickets");
        
        return ResponseEntity.ok(ticketRepository.findByAssignedTo(user.getId()));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllTickets(@RequestParam(required = false) Role role) {
        User user = userService.getCurrentUser().orElse(null);
        if (user == null || (user.getRole() != Role.ADMIN && user.getRole() != Role.MAINTAIN_STAFF)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        if (role != null) {
            return ResponseEntity.ok(ticketRepository.findBySenderRole(role));
        }
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    // Assign Technician - Refactored to Body-Based
    @RequestMapping(value = "/{id}/assign", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> assignTicket(@PathVariable String id, @RequestBody Map<String, String> body) {
        String technicianId = body.get("technicianId");
        System.out.println("Processing assignTicket for id: " + id + ", technician in body: " + technicianId);
        
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");
        if (user.getRole() != Role.ADMIN) return ResponseEntity.status(403).body("Forbidden");

        if (technicianId == null) return ResponseEntity.badRequest().body("Technician ID is required in body");

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        System.out.println("Ticket " + id + " assigned to " + technicianId + " successfully");

        try {
            notificationService.createNotification(
                technicianId,
                "Assigned to ticket: " + ticket.getSubject(),
                "TICKET",
                ticket.getId()
            );
        } catch (Exception e) {
            System.err.println("Notification failed: " + e.getMessage());
        }

        return ResponseEntity.ok(saved);
    }

    // Update Status - Refactored to V2 for explicit routing
    @RequestMapping(value = "/v2/{id}/status", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String note = body.get("note");
        
        System.out.println("Processing V2 updateStatus for ticket " + id + ", status: " + status + ", note: " + note);
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        if (status == null) return ResponseEntity.badRequest().body("Status is required in body");

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isAssigned = user.getId().equals(ticket.getAssignedTo());
        if (!isAdmin && !isAssigned) return ResponseEntity.status(403).body("Forbidden");

        ticket.setStatus(status.toUpperCase());
        if ("RESOLVED".equals(status.toUpperCase())) {
            ticket.setResolutionNotes(note);
        } else if ("REJECTED".equals(status.toUpperCase())) {
            ticket.setRejectionReason(note);
        }
        
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        System.out.println("Ticket " + id + " V2 status updated successfully");

        if (ticket.getSenderId() != null) {
            try {
                notificationService.createNotification(
                    ticket.getSenderId(),
                    "Ticket status: " + status + " - " + ticket.getSubject(),
                    "TICKET",
                    ticket.getId()
                );
            } catch (Exception e) {
                System.err.println("Notification failed: " + e.getMessage());
            }
            userService.getUserById(ticket.getSenderId()).ifPresent(owner -> {
                if (owner.getEmail() != null) {
                    emailService.sendTicketStatusNotification(
                        owner.getEmail(), owner.getName(),
                        ticket.getId(), ticket.getSubject(),
                        status.toUpperCase(), note
                    );
                }
            });
        }
        return ResponseEntity.ok(saved);
    }

    // Reply to Ticket - Refactored to V2 for explicit routing
    @PostMapping("/v2/{id}/messages")
    public ResponseEntity<?> replyToTicket(@PathVariable String id, @RequestBody Map<String, String> body) {
        System.out.println("Processing V2 replyToTicket for ticket " + id);
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) return ResponseEntity.badRequest().body("Empty comment");

        TicketMessage msg = new TicketMessage();
        msg.setId(UUID.randomUUID().toString());
        msg.setSenderId(user.getId());
        msg.setSenderName(user.getName());
        msg.setSenderRole(user.getRole());
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setEdited(false);
        msg.setDeleted(false);

        if (ticket.getMessages() == null) ticket.setMessages(new ArrayList<>());
        ticket.getMessages().add(msg);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        System.out.println("Reply added to ticket " + id + " successfully");

        // Notify party
        String recipientId = user.getId().equals(ticket.getSenderId()) ? ticket.getAssignedTo() : ticket.getSenderId();
        if (recipientId != null) {
            try {
                notificationService.createNotification(
                    recipientId,
                    "New comment on ticket: " + ticket.getSubject(),
                    "TICKET",
                    ticket.getId()
                );
            } catch (Exception e) {
                System.err.println("Notification failed: " + e.getMessage());
            }
        }

        // Email the ticket owner when admin/staff replies (not when owner replies to themselves)
        boolean replierIsOwner = user.getId().equals(ticket.getSenderId());
        if (!replierIsOwner && ticket.getSenderId() != null) {
            userService.getUserById(ticket.getSenderId()).ifPresent(owner -> {
                if (owner.getEmail() != null) {
                    emailService.sendTicketReplyNotification(
                        owner.getEmail(), owner.getName(),
                        ticket.getId(), ticket.getSubject(),
                        content, user.getName()
                    );
                }
            });
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/v2/{id}/messages/{messageId}")
    public ResponseEntity<?> editComment(@PathVariable String id, @PathVariable String messageId, @RequestBody Map<String, String> body) {
        System.out.println("Processing V2 editComment for ticket " + id);
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        Optional<TicketMessage> msgOpt = ticket.getMessages().stream()
                .filter(m -> m.getId().equals(messageId))
                .findFirst();

        if (msgOpt.isEmpty()) return ResponseEntity.status(404).body("Comment not found");
        TicketMessage msg = msgOpt.get();

        if (!msg.getSenderId().equals(user.getId())) return ResponseEntity.status(403).body("Unauthorized edit");

        msg.setContent(body.get("content"));
        msg.setEdited(true);
        msg.setTimestamp(LocalDateTime.now());

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping("/v2/{id}/messages/{messageId}")
    public ResponseEntity<?> deleteComment(@PathVariable String id, @PathVariable String messageId) {
        System.out.println("Processing V2 deleteComment for ticket " + id);
        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        Optional<TicketMessage> msgOpt = ticket.getMessages().stream()
                .filter(m -> m.getId().equals(messageId))
                .findFirst();

        if (msgOpt.isEmpty()) return ResponseEntity.status(404).body("Comment not found");
        TicketMessage msg = msgOpt.get();

        if (!msg.getSenderId().equals(user.getId()) && user.getRole() != Role.ADMIN) return ResponseEntity.status(403).body("Unauthorized delete");

        msg.setDeleted(true);
        msg.setContent("This comment has been deleted");
        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return ResponseEntity.ok(ticket);
    }
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateTicket(
            @PathVariable String id,
            @RequestParam("subject") String subject,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("priority") String priority,
            @RequestParam(value = "contactDetails", required = false) String contactDetails,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments) {

        User user = userService.getCurrentUser().orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        if (!ticket.getSenderId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only edit your own tickets");
        }
        if (!"OPEN".equals(ticket.getStatus())) {
            return ResponseEntity.badRequest().body("Only OPEN tickets can be edited");
        }

        ticket.setSubject(subject);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setContactDetails(contactDetails);
        ticket.setPhoneNumber(phoneNumber);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (attachments != null && attachments.length > 0) {
            if (attachments.length > 3) return ResponseEntity.badRequest().body("Maximum 3 attachments allowed");
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : attachments) {
                try {
                    urls.add(cloudinaryService.uploadImage(file));
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
                }
            }
            ticket.setAttachments(urls);
        }

        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/v2/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        System.out.println("Processing V2 deleteTicket for ticket " + id);
        User user = userService.getCurrentUser().orElse(null);
        if (user == null || user.getRole() != Role.ADMIN) return ResponseEntity.status(403).body("Forbidden");

        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) return ResponseEntity.status(404).body("Ticket not found");

        ticketRepository.delete(ticket);
        System.out.println("Ticket " + id + " deleted successfully");
        return ResponseEntity.ok().body("Ticket deleted");
    }
}
