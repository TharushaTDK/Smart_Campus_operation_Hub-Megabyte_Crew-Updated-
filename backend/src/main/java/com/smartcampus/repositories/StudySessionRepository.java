package com.smartcampus.repositories;

import com.smartcampus.models.StudySession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudySessionRepository extends MongoRepository<StudySession, String> {
    List<StudySession> findByLecturerId(String lecturerId);
    List<StudySession> findByDateAndFacilityId(String date, String facilityId);
    List<StudySession> findByStatus(String status);
}

