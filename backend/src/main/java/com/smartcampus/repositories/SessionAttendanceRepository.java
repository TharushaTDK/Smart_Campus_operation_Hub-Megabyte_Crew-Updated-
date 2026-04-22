package com.smartcampus.repositories;

import com.smartcampus.models.SessionAttendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionAttendanceRepository extends MongoRepository<SessionAttendance, String> {
    Optional<SessionAttendance> findBySessionIdAndStudentId(String sessionId, String studentId);
    List<SessionAttendance> findBySessionId(String sessionId);
    Optional<SessionAttendance> findByQrToken(String qrToken);
}