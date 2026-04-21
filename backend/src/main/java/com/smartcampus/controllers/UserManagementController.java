package com.smartcampus.controllers;

import com.smartcampus.dto.AdminAddUserRequest;
import com.smartcampus.dto.UpdateRoleRequest;
import com.smartcampus.dto.UpdateUserRequest;
import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import com.smartcampus.repositories.UserRepository;
import com.smartcampus.services.NotificationService;
import com.smartcampus.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Date;

/**
 * Admin-only REST API for managing all users.
 * Base path: /api/admin/users
 */
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public UserManagementController(UserService userService, UserRepository userRepository,
            PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    /** POST /api/admin/users — add a new user */
    @PostMapping
    public ResponseEntity<?> addUser(@Valid @RequestBody AdminAddUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(409).body(Map.of("error", "An account with this email already exists"));
        }

        Date now = new java.util.Date();
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .provider("local")
                .role(req.getRole())
                .enabled(true)
                .subject(req.getSubject())
                .seniority(req.getSeniority())
                .department(req.getDepartment())
                .createdAt(now)
                .updatedAt(now)
                .lastLogin(now)
                .build();

        User saved = userRepository.save(user);

        // Notify all admins about the new user
        String notifyMsg = "New user added: " + saved.getName() + " (" + saved.getRole() + ")";
        userService.getUsersByRole(Role.ADMIN).forEach(admin ->
            notificationService.createNotification(admin.getId(), notifyMsg, "USER", saved.getId())
        );

        return ResponseEntity.status(201).body(saved.withoutPassword());
    }

    /** PUT /api/admin/users/{id} — full user edit (all fields) */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestBody UpdateUserRequest request) {
        try {
            User updated = userService.updateUser(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/admin/users — list all users */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** GET /api/admin/users/{id} — get user by id */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/admin/users/role/{role} — filter by role */
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    /** PUT /api/admin/users/{id}/role — change user role */
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateRoleRequest request) {
        User updated = userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(updated);
    }

    /** PATCH /api/admin/users/{id}/enable?enabled=true|false */
    @PatchMapping("/{id}/enable")
    public ResponseEntity<User> setEnabled(
            @PathVariable String id,
            @RequestParam boolean enabled) {
        User updated = userService.setUserEnabled(id, enabled);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/admin/users/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted", "id", id));
    }

    /** GET /api/admin/users/stats — count per role */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = Map.of(
                "total", userService.countAll(),
                "admins", userService.countByRole(Role.ADMIN),
                "students", userService.countByRole(Role.STUDENT),
                "teachers", userService.countByRole(Role.TEACHER),
                "maintainStaff", userService.countByRole(Role.MAINTAIN_STAFF));
        return ResponseEntity.ok(stats);
    }
}
