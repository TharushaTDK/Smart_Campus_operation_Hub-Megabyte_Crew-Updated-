package com.smartcampus.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * User document stored in MongoDB.
 * Uses java.util.Date for timestamps — MongoDB handles Date natively,
 * no custom converters needed.
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String googleId;

    private String email;

    private String name;

    private String photo;

    /** "local" = email/password | "google" = Google OAuth */
    private String provider = "local";

    /** BCrypt hashed password — null for Google users */
    private String password;

    private String subject;

    private String seniority;

    private String department;

    private Role role = Role.STUDENT;

    private boolean enabled = true;

    private Date createdAt;

    private Date updatedAt;

    private Date lastLogin;

    // ── Constructors ───────────────────────────────────────
    public User() {
    }

    // ── Getters ────────────────────────────────────────────
    public String getId() {
        return id;
    }

    public String getGoogleId() {
        return googleId;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPhoto() {
        return photo;
    }

    public String getProvider() {
        return provider;
    }

    public String getPassword() {
        return password;
    }

    public String getSubject() {
        return subject;
    }

    public String getSeniority() {
        return seniority;
    }

    public String getDepartment() {
        return department;
    }

    public Role getRole() {
        return role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    // ── Setters ────────────────────────────────────────────
    public void setId(String id) {
        this.id = id;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setSeniority(String seniority) {
        this.seniority = seniority;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    // ── Builder ────────────────────────────────────────────
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final User u = new User();

        public Builder googleId(String v) {
            u.googleId = v;
            return this;
        }

        public Builder email(String v) {
            u.email = v;
            return this;
        }

        public Builder name(String v) {
            u.name = v;
            return this;
        }

        public Builder photo(String v) {
            u.photo = v;
            return this;
        }

        public Builder provider(String v) {
            u.provider = v;
            return this;
        }

        public Builder password(String v) {
            u.password = v;
            return this;
        }

        public Builder subject(String v) {
            u.subject = v;
            return this;
        }

        public Builder seniority(String v) {
            u.seniority = v;
            return this;
        }

        public Builder department(String v) {
            u.department = v;
            return this;
        }

        public Builder role(Role v) {
            u.role = v;
            return this;
        }

        public Builder enabled(boolean v) {
            u.enabled = v;
            return this;
        }

        public Builder createdAt(Date v) {
            u.createdAt = v;
            return this;
        }

        public Builder updatedAt(Date v) {
            u.updatedAt = v;
            return this;
        }

        public Builder lastLogin(Date v) {
            u.lastLogin = v;
            return this;
        }

        public User build() {
            return u;
        }
    }

    /** Safe for API responses — never serialize the password */
    public User withoutPassword() {
        this.password = null;
        return this;
    }
}
