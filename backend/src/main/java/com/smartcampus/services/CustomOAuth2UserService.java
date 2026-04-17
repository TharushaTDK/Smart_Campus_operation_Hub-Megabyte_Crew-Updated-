package com.smartcampus.services;

import com.smartcampus.models.CustomOAuth2User;
import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import com.smartcampus.repositories.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.logging.Logger;

/**
 * Custom OAuth2 user service.
 * Intercepts every Google login → persists/updates the user in MongoDB
 * → wraps the result as CustomOAuth2User so Spring Security knows the role.
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger log = Logger.getLogger(CustomOAuth2UserService.class.getName());

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        // 1. Let Spring fetch user info from Google
        OAuth2User oAuth2User = super.loadUser(request);

        // 2. Extract Google profile attributes
        String googleId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String photo = oAuth2User.getAttribute("picture");

        log.info("Google OAuth2 login attempt for: " + email);

        // 3. Upsert into MongoDB
        User user = userRepository.findFirstByEmail(email).orElse(null);

        if (user == null) {
            // First-time login → create with default role STUDENT
            Date now = new Date();
            user = User.builder()
                    .googleId(googleId)
                    .email(email)
                    .name(name)
                    .photo(photo)
                    .provider("google")
                    .role(Role.STUDENT)
                    .enabled(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .lastLogin(now)
                    .build();
            log.info("New user registered via Google: " + email);
        } else {
            // Returning user → refresh name/photo and lastLogin
            user.setGoogleId(googleId);
            user.setName(name);
            user.setPhoto(photo);
            user.setLastLogin(new Date());
            user.setUpdatedAt(new Date());
            log.info("Existing user logged in via Google: " + email + " [" + user.getRole() + "]");
        }

        // 4. Save to MongoDB (with error logging)
        User savedUser = user;
        try {
            savedUser = userRepository.save(user);
            log.info("User saved to MongoDB with id: " + savedUser.getId());
        } catch (Exception e) {
            log.severe("MONGODB SAVE FAILED for " + email + ": " + e.getMessage());
            log.severe("Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "none"));
            // Authentication still succeeds — user just won't be persisted this session
        }

        // 5. Return CustomOAuth2User so Spring Security picks up the MongoDB role
        return new CustomOAuth2User(oAuth2User, savedUser);
    }
}
