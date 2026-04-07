package com.smartcampus.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "study_sessions")
public class StudySession {

    @Id
    private String id;

    private String subjectName;
    private String subjectId;
    private String unitNumber;
    private String date; // Store as String "YYYY-MM-DD" for easier comparison or Date
    private String startTime; // "HH:mm"
    private String endTime;   // "HH:mm"
    private String facilityId;
    private String facilityName;
    private String facilityType; // "Lecture Hall" or "Laboratory"
    private String lecturerId;
    private String lecturerName;
    private int capacity;
    private int remainingCapacity;
    private String status; // "Pending", "Approved", "Rejected"
    private List<String> bookedStudentIds = new ArrayList<>();
    private List<String> bookedStudentNames = new ArrayList<>();
    private Date createdAt;

    public StudySession() {
        this.createdAt = new Date();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getFacilityId() { return facilityId; }
    public void setFacilityId(String facilityId) { this.facilityId = facilityId; }

    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }

    public String getFacilityType() { return facilityType; }
    public void setFacilityType(String facilityType) { this.facilityType = facilityType; }

    public String getLecturerId() { return lecturerId; }
    public void setLecturerId(String lecturerId) { this.lecturerId = lecturerId; }

    public String getLecturerName() { return lecturerName; }
    public void setLecturerName(String lecturerName) { this.lecturerName = lecturerName; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getRemainingCapacity() { return remainingCapacity; }
    public void setRemainingCapacity(int remainingCapacity) { this.remainingCapacity = remainingCapacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getBookedStudentIds() { return bookedStudentIds; }
    public void setBookedStudentIds(List<String> bookedStudentIds) { this.bookedStudentIds = bookedStudentIds; }

    public List<String> getBookedStudentNames() { return bookedStudentNames; }
    public void setBookedStudentNames(List<String> bookedStudentNames) { this.bookedStudentNames = bookedStudentNames; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}

