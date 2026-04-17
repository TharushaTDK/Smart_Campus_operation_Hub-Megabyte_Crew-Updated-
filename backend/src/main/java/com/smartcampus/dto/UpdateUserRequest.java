package com.smartcampus.dto;

import com.smartcampus.models.Role;
import jakarta.validation.constraints.Email;

/**
 * DTO for admin full-user update (PUT /api/admin/users/{id}).
 * All fields are optional — only non-blank values are applied.
 */
public class UpdateUserRequest {

    private String name;

    @Email(message = "Please provide a valid email")
    private String email;

    /** If blank/null the existing password is kept unchanged. */
    private String password;

    private Role role;

    // Role-specific optional fields
    private String subject;
    private String seniority;
    private String department;

    public String getName()             { return name; }
    public void setName(String name)    { this.name = name; }

    public String getEmail()            { return email; }
    public void setEmail(String email)  { this.email = email; }

    public String getPassword()                 { return password; }
    public void setPassword(String password)    { this.password = password; }

    public Role getRole()               { return role; }
    public void setRole(Role role)      { this.role = role; }

    public String getSubject()                  { return subject; }
    public void setSubject(String subject)      { this.subject = subject; }

    public String getSeniority()                { return seniority; }
    public void setSeniority(String seniority)  { this.seniority = seniority; }

    public String getDepartment()                   { return department; }
    public void setDepartment(String department)    { this.department = department; }
}
