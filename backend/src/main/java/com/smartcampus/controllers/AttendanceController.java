package com.smartcampus.controllers;

import com.smartcampus.models.Role;
import com.smartcampus.models.SessionAttendance;
import com.smartcampus.models.StudySession;
import com.smartcampus.models.User;
import com.smartcampus.repositories.SessionAttendanceRepository;
import com.smartcampus.repositories.StudySessionRepository;
import com.smartcampus.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final SessionAttendanceRepository attendanceRepository;
    private final StudySessionRepository sessionRepository;
    private final UserService userService;

    public AttendanceController(SessionAttendanceRepository attendanceRepository,
                                StudySessionRepository sessionRepository,
                                UserService userService) {
        this.attendanceRepository = attendanceRepository;
        this.sessionRepository = sessionRepository;
        this.userService = userService;
    }

    /**
     * STUDENT: Generate (or retrieve existing) QR token for a session they are booked into.
     */
    @PostMapping("/generate/{sessionId}")
    public ResponseEntity<?> generateQr(@PathVariable String sessionId) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User student = currentUser.get();

        Optional<StudySession> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Session not found"));
        }
        StudySession session = sessionOpt.get();

        if (!"Approved".equals(session.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Session is not approved"));
        }

        if (!session.getBookedStudentIds().contains(student.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You are not registered for this session"));
        }

        // Return existing record if already generated
        Optional<SessionAttendance> existing = attendanceRepository.findBySessionIdAndStudentId(sessionId, student.getId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(buildQrResponse(existing.get(), session));
        }

        // Create new attendance record with unique QR token
        SessionAttendance attendance = new SessionAttendance();
        attendance.setSessionId(sessionId);
        attendance.setStudentId(student.getId());
        attendance.setStudentName(student.getName());
        attendance.setStudentEmail(student.getEmail());
        attendance.setQrToken(UUID.randomUUID().toString());

        SessionAttendance saved = attendanceRepository.save(attendance);
        return ResponseEntity.ok(buildQrResponse(saved, session));
    }

    /**
     * STUDENT: Get their attendance record for a session.
     */
    @GetMapping("/my/{sessionId}")
    public ResponseEntity<?> getMyAttendance(@PathVariable String sessionId) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        Optional<SessionAttendance> record = attendanceRepository.findBySessionIdAndStudentId(sessionId, currentUser.get().getId());
        if (record.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "No QR generated yet"));
        }

        Optional<StudySession> session = sessionRepository.findById(sessionId);
        return ResponseEntity.ok(buildQrResponse(record.get(), session.orElse(null)));
    }

    /**
     * TEACHER: Scan a QR token and mark the student as attended.
     */
    @PostMapping("/scan")
    public ResponseEntity<?> scanQr(@RequestBody Map<String, String> body) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User teacher = currentUser.get();
        if (teacher.getRole() != Role.TEACHER && teacher.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body(Map.of("error", "Only lecturers and admins can mark attendance"));
        }

        String qrToken = body.get("qrToken");
        if (qrToken == null || qrToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "QR token is required"));
        }

        Optional<SessionAttendance> recordOpt = attendanceRepository.findByQrToken(qrToken);
        if (recordOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Invalid QR code"));
        }

        SessionAttendance record = recordOpt.get();

        // Verify teacher owns this session
        Optional<StudySession> sessionOpt = sessionRepository.findById(record.getSessionId());
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Session not found"));
        }
        StudySession session = sessionOpt.get();

        if (teacher.getRole() == Role.TEACHER && !session.getLecturerId().equals(teacher.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only mark attendance for your own sessions"));
        }

        if (record.isAttended()) {
            Map<String, Object> alreadyMarked = new HashMap<>();
            alreadyMarked.put("message", "Already marked as attended");
            alreadyMarked.put("studentName", record.getStudentName());
            alreadyMarked.put("studentEmail", record.getStudentEmail());
            alreadyMarked.put("scannedAt", record.getScannedAt());
            alreadyMarked.put("alreadyAttended", true);
            return ResponseEntity.ok(alreadyMarked);
        }

        record.setAttended(true);
        record.setScannedAt(new Date());
        attendanceRepository.save(record);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Attendance marked successfully");
        result.put("studentName", record.getStudentName());
        result.put("studentEmail", record.getStudentEmail());
        result.put("sessionId", record.getSessionId());
        result.put("alreadyAttended", false);
        return ResponseEntity.ok(result);
    }

    /**
     * TEACHER / ADMIN: Get full attendance list and stats for a session.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionAttendance(@PathVariable String sessionId) {
        Optional<User> currentUser = userService.getCurrentUser();
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User caller = currentUser.get();
        if (caller.getRole() != Role.TEACHER && caller.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        Optional<StudySession> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Session not found"));
        }
        StudySession session = sessionOpt.get();

        if (caller.getRole() == Role.TEACHER && !session.getLecturerId().equals(caller.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only view attendance for your own sessions"));
        }

        List<SessionAttendance> records = attendanceRepository.findBySessionId(sessionId);
        long attendedCount = records.stream().filter(SessionAttendance::isAttended).count();
        int registeredCount = session.getBookedStudentIds().size();

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("subjectName", session.getSubjectName());
        response.put("date", session.getDate());
        response.put("startTime", session.getStartTime());
        response.put("endTime", session.getEndTime());
        response.put("facilityName", session.getFacilityName());
        response.put("registeredCount", registeredCount);
        response.put("qrGeneratedCount", records.size());
        response.put("attendedCount", (int) attendedCount);
        response.put("records", records);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildQrResponse(SessionAttendance record, StudySession session) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", record.getId());
        map.put("sessionId", record.getSessionId());
        map.put("studentId", record.getStudentId());
        map.put("studentName", record.getStudentName());
        map.put("qrToken", record.getQrToken());
        map.put("attended", record.isAttended());
        map.put("scannedAt", record.getScannedAt());
        map.put("createdAt", record.getCreatedAt());
        if (session != null) {
            map.put("subjectName", session.getSubjectName());
            map.put("subjectId", session.getSubjectId());
            map.put("date", session.getDate());
            map.put("startTime", session.getStartTime());
            map.put("endTime", session.getEndTime());
            map.put("facilityName", session.getFacilityName());
            map.put("lecturerName", session.getLecturerName());
        }
        return map;
    }
}
