package com.smartcampus.services;

import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import com.smartcampus.repositories.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.logging.Logger;

/**
 * Handles Google OAuth2 login via OpenID Connect (OIDC).
 * Google is an OIDC provider → must use OidcUserService, NOT
 * DefaultOAuth2UserService.
 * This service intercepts the login, saves/updates the user in MongoDB,
 * then returns the original OidcUser so Spring Security can complete
 * authentication.
 */
@Service
public class CustomOidcUserService extends OidcUserService {

    private static final Logger log = Logger.getLogger(CustomOidcUserService.class.getName());

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest request) throws OAuth2AuthenticationException {
        // 1. Let Spring fetch user info from Google
        OidcUser oidcUser = super.loadUser(request);

        // 2. Extract Google profile attributes
        String googleId = oidcUser.getAttribute("sub");
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String photo = oidcUser.getAttribute("picture");

        log.info("Google OIDC login attempt for: " + email);

        // 3. Upsert into MongoDB
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
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
            log.info("New user registered via Google OIDC: " + email);
        } else {
            user.setGoogleId(googleId);
            user.setName(name);
            user.setPhoto(photo);
            user.setLastLogin(new Date());
            user.setUpdatedAt(new Date());
            log.info("Existing user logged in via Google OIDC: " + email + " [" + user.getRole() + "]");
        }

        try {
            User saved = userRepository.save(user);
            log.info("User saved to MongoDB: " + saved.getId() + " | " + email);
        } catch (Exception e) {
            log.severe("MONGODB SAVE FAILED for " + email + ": " + e.getMessage());
        }

        // 4. Return the OidcUser — Spring Security uses this for the session
        return oidcUser;
    }
}
