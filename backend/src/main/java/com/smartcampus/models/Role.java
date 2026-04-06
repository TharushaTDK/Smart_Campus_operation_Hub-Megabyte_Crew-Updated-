package com.smartcampus.models;

public enum Role {
    ADMIN,
    STUDENT,
    TEACHER,
    OPERATOR, // Legacy role to prevent MongoDB deserialization crashes
    MAINTAIN_STAFF
}
