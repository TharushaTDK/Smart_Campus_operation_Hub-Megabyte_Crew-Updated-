package com.smartcampus.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Wraps the raw OAuth2User from Google and injects the user's
 * MongoDB role as a Spring Security GrantedAuthority.
 * This allows @PreAuthorize("hasRole('ADMIN')") etc. to work.
 */
public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User delegate;
    private final User user;

    public CustomOAuth2User(OAuth2User delegate, User user) {
        this.delegate = delegate;
        this.user = user;
    }

    /** Returns ROLE_ADMIN / ROLE_STUDENT / ROLE_TEACHER … */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public String getName() {
        return delegate.getName();
    }

    /** Convenience accessor to get the full MongoDB User object */
    public User getUser() {
        return user;
    }
}
