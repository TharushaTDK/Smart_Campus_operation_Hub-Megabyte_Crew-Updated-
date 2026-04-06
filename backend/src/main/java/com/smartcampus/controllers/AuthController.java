package com.smartcampus.controllers;

import com.smartcampus.dto.LoginRequest;
import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import com.smartcampus.repositories.UserRepository;
import com.smartcampus.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ── GET /api/auth/debug (public) — shows session/cookie info ───────
    @GetMapping("/debug")
    public ResponseEntity<?> debug(HttpServletRequest req) {
        Map<String, Object> info = new LinkedHashMap<>();

        // Cookies sent by browser
        info.put("cookies", req.getCookies() == null ? "none"
                : Arrays.stream(req.getCookies())
                        .map(c -> c.getName() + "=" + c.getValue().substring(0, Math.min(8, c.getValue().length()))
                                + "...")
                        .collect(Collectors.toList()));

        // Session state
        HttpSession session = req.getSession(false);
        info.put("sessionId", session != null ? session.getId().substring(0, 8) + "..." : "NO SESSION");
        info.put("hasSpringCtx", session != null &&
                session.getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY) != null);

        // SecurityContext
        var auth = SecurityContextHolder.getContext().getAuthentication();
        info.put("authenticated", auth != null && auth.isAuthenticated() &&
                !"anonymousUser".equals(auth.getPrincipal()));
        info.put("principal", auth != null ? auth.getPrincipal().toString() : "null");

        return ResponseEntity.ok(info);
    }

    // ── GET /api/auth/me ────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return userService.getCurrentUser()
                .map(u -> ResponseEntity.ok(u.withoutPassword()))
                .orElse(ResponseEntity.status(401).build());
    }

    // ── POST /api/auth/register ─────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {

        // Duplicate check
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "An account with this email already exists"));
        }

        Date now = new Date();

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .provider("local")
                .role(Role.STUDENT)
                .enabled(true)
                .createdAt(now)
                .updatedAt(now)
                .lastLogin(now)
                .build();

        User saved = userRepository.save(user);
        return ResponseEntity.status(201).body(saved.withoutPassword());
    }

    // ── POST /api/auth/login ────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req,
            HttpServletRequest httpRequest) {

        User user = userRepository.findByEmail(req.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }

        if (!"local".equals(user.getProvider())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error",
                            "This account uses Google sign-in. Please use the 'Continue with Google' button."));
        }

        if (!user.isEnabled()) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Your account has been disabled. Contact an administrator."));
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }

        // ── Create Spring Security session ───────────────────────────
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        var auth = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext());

        // Update last login timestamp
        user.setLastLogin(new Date());
        user.setUpdatedAt(new Date());
        userRepository.save(user);

        return ResponseEntity.ok(user.withoutPassword());
    }
}
