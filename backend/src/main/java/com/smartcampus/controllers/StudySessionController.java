package com.smartcampus.controllers;

import com.smartcampus.models.Facility;
import com.smartcampus.models.Role;
import com.smartcampus.models.StudySession;
import com.smartcampus.models.User;
import com.smartcampus.repositories.FacilityRepository;
import com.smartcampus.repositories.StudySessionRepository;
import com.smartcampus.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/study-sessions")
public class StudySessionController {

    private final StudySessionRepository studySessionRepository;
    private final FacilityRepository facilityRepository;
    private final UserService userService;
    private final com.smartcampus.services.NotificationService notificationService;

    public StudySessionController(StudySessionRepository studySessionRepository,
                                  FacilityRepository facilityRepository,
                                  UserService userService,
                                  com.smartcampus.services.NotificationService notificationService) {
        this.studySessionRepository = studySessionRepository;
        this.facilityRepository = facilityRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @GetMapping("/available-facilities")
    public ResponseEntity<List<Facility>> getAvailableFacilities() {
        return ResponseEntity.ok(facilityRepository.findByCategoryAndMaintenanceStatus("Study Area", "No Maintenance"));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookSession(@RequestBody StudySession session) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty() || currentUser.get().getRole() != Role.TEACHER) {
            return ResponseEntity.status(403).body(Map.of("error", "Only lecturers can book sessions"));
        }

        // Validate time and date
        try {
            LocalDate date = LocalDate.parse(session.getDate());
            LocalTime start = LocalTime.parse(session.getStartTime());
            LocalTime end = LocalTime.parse(session.getEndTime());

            if (start.isAfter(end) || start.equals(end)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid time range"));
            }

            // Weekday/Weekend constraints
            boolean isWeekend = date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
            LocalTime limitStart = LocalTime.of(8, 0);
            LocalTime limitEnd = isWeekend ? LocalTime.of(20, 0) : LocalTime.of(17, 0);

            if (start.isBefore(limitStart) || end.isAfter(limitEnd)) {
                String msg = isWeekend ? "Weekends: 8 AM - 8 PM" : "Weekdays: 8 AM - 5 PM";
                return ResponseEntity.badRequest().body(Map.of("error", "Time must be within: " + msg));
            }

            // 30-minute interval check
            if (start.getMinute() % 30 != 0 || end.getMinute() % 30 != 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Time slots must be in 30-minute intervals"));
            }

            // Overlap check
            List<StudySession> existingSessions = studySessionRepository.findByDateAndFacilityId(session.getDate(), session.getFacilityId());
            for (StudySession existing : existingSessions) {
                if ("Rejected".equals(existing.getStatus())) continue;
                
                LocalTime exStart = LocalTime.parse(existing.getStartTime());
                LocalTime exEnd = LocalTime.parse(existing.getEndTime());

                if (start.isBefore(exEnd) && end.isAfter(exStart)) {
                    return ResponseEntity.status(409).body(Map.of("error", "book another session! This is booked"));
                }
            }

            // Setup session
            session.setLecturerId(currentUser.get().getId());
            session.setLecturerName(currentUser.get().getName());
            session.setStatus("Pending");
            
            // Get capacity from facility
            Facility facility = facilityRepository.findById(session.getFacilityId()).orElse(null);
            if (facility != null) {
                session.setCapacity(facility.getCapacity());
                session.setRemainingCapacity(facility.getCapacity());
                session.setFacilityName(facility.getName());
                session.setFacilityType(facility.getType());
            }

            StudySession saved = studySessionRepository.save(session);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date or time format"));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<StudySession>> getMySessions() {
        return userService.getCurrentUser()
                .map(u -> ResponseEntity.ok(studySessionRepository.findByLecturerId(u.getId())))
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<StudySession>> getAllSessions() {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty() || currentUser.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(studySessionRepository.findAll());
    }

    @PutMapping("/admin/{id}/approve")
    public ResponseEntity<?> approveSession(@PathVariable String id) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty() || currentUser.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        return studySessionRepository.findById(id)
                .map(session -> {
                    session.setStatus("Approved");
                    studySessionRepository.save(session);
                    // Notify Lecturer
                    notificationService.createNotification(
                        session.getLecturerId(),
                        "Your session request for " + session.getSubjectName() + " has been APPROVED.",
                        "BOOKING",
                        session.getId()
                    );
                    return ResponseEntity.ok(session);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/admin/{id}/reject")
    public ResponseEntity<?> rejectSession(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty() || currentUser.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        return studySessionRepository.findById(id)
                .map(session -> {
                    session.setStatus("Rejected");
                    String reason = (payload != null && payload.containsKey("reason")) ? payload.get("reason") : "";
                    session.setRejectReason(reason);
                    
                    studySessionRepository.save(session);
                    // Notify Lecturer
                    String notifyMessage = "Your session request for " + session.getSubjectName() + " has been REJECTED.";
                    if (!reason.isEmpty()) {
                        notifyMessage += " Reason: " + reason;
                    }
                    
                    notificationService.createNotification(
                        session.getLecturerId(),
                        notifyMessage,
                        "BOOKING",
                        session.getId()
                    );
                    return ResponseEntity.ok(session);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable String id) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty() || currentUser.get().getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        return studySessionRepository.findById(id)
                .map(session -> {
                    // 1. Notify Lecturer
                    notificationService.createNotification(
                        session.getLecturerId(),
                        "ALERT: Your session [" + session.getSubjectName() + "] on " + session.getDate() + " has been CANCELED by administration.",
                        "TICKET", // General alert style
                        null
                    );

                    // 2. Notify all registered students
                    if (session.getBookedStudentIds() != null) {
                        for (String studentId : session.getBookedStudentIds()) {
                            notificationService.createNotification(
                                studentId,
                                "STAY ALERT: The study session for [" + session.getSubjectName() + "] on " + session.getDate() + " has been CANCELED.",
                                "TICKET",
                                null
                            );
                        }
                    }

                    // 3. Delete
                    studySessionRepository.deleteById(id);
                    return ResponseEntity.ok(Map.of("message", "Session canceled and deleted"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/approved")
    public ResponseEntity<List<StudySession>> getApprovedSessions() {
        return ResponseEntity.ok(studySessionRepository.findByStatus("Approved"));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerStudent(@PathVariable String id) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) return ResponseEntity.status(401).build();

        User student = currentUser.get();
        return studySessionRepository.findById(id)
                .map(session -> {
                    if (!"Approved".equals(session.getStatus())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Session is not approved"));
                    }
                    if (session.getRemainingCapacity() <= 0) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Session is full"));
                    }
                    if (session.getBookedStudentIds().contains(student.getId())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "You are already registered for this session"));
                    }

                    session.getBookedStudentIds().add(student.getId());
                    session.getBookedStudentNames().add(student.getName());
                    session.setRemainingCapacity(session.getRemainingCapacity() - 1);
                    studySessionRepository.save(session);
                    return ResponseEntity.ok(session);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/cancel-registration")
    public ResponseEntity<?> cancelRegistration(@PathVariable String id) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) return ResponseEntity.status(401).build();

        String studentId = currentUser.get().getId();
        return studySessionRepository.findById(id)
                .map(session -> {
                    int index = session.getBookedStudentIds().indexOf(studentId);
                    if (index == -1) {
                        return ResponseEntity.badRequest().body(Map.of("error", "You are not registered for this session"));
                    }

                    session.getBookedStudentIds().remove(index);
                    if (index < session.getBookedStudentNames().size()) {
                        session.getBookedStudentNames().remove(index);
                    }
                    session.setRemainingCapacity(session.getRemainingCapacity() + 1);
                    studySessionRepository.save(session);
                    return ResponseEntity.ok(session);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
