package com.smartcampus.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "session_attendance")
public class SessionAttendance {

    @Id
    private String id;
    private String sessionId;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private String qrToken;
    private boolean attended;
    private Date scannedAt;
    private Date createdAt;

    public SessionAttendance() {
        this.createdAt = new Date();
        this.attended = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }

    public boolean isAttended() { return attended; }
    public void setAttended(boolean attended) { this.attended = attended; }

    public Date getScannedAt() { return scannedAt; }
    public void setScannedAt(Date scannedAt) { this.scannedAt = scannedAt; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
