package com.smartcampus.services;

import com.smartcampus.models.CustomOAuth2User;
import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import com.smartcampus.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class UserService {

    private static final Logger log = Logger.getLogger(UserService.class.getName());

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ── Current logged-in user ────────────────────────────────────────
    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            return Optional.empty();

        Object principal = auth.getPrincipal();

        // Google OAuth2 (OIDC) login — principal is OidcUser
        if (principal instanceof OidcUser oidcUser) {
            String email = oidcUser.getEmail();
            if (email != null)
                return userRepository.findByEmail(email);
        }

        // Legacy: CustomOAuth2User (non-OIDC flow)
        if (principal instanceof CustomOAuth2User customUser) {
            return Optional.of(customUser.getUser());
        }

        // Local email/password login — principal is the email string
        if (principal instanceof String email && !email.equals("anonymousUser")) {
            return userRepository.findByEmail(email);
        }

        return Optional.empty();
    }

    // ── Queries ───────────────────────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    // ── Mutations ─────────────────────────────────────────────────────
    public User updateUserRole(String id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        log.info("Role update: " + user.getRole() + " → " + newRole + " (user: " + user.getEmail() + ")");
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public User setUserEnabled(String id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepository.deleteById(id);
        log.info("User deleted: " + id);
    }

    // ── Stats ─────────────────────────────────────────────────────────
    public long countByRole(Role role) {
        return userRepository.countByRole(role);
    }

    public long countAll() {
        return userRepository.count();
    }
}
