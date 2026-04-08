package com.smartcampus.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Wraps the raw OidcUser from Google and injects the user's
 * MongoDB role as a Spring Security GrantedAuthority.
 * Specifically for OIDC login (Google default).
 */
public class CustomOidcUser implements OidcUser {

    private final OidcUser delegate;
    private final User user;

    public CustomOidcUser(OidcUser delegate, User user) {
        this.delegate = delegate;
        this.user = user;
    }

    @Override
    public Map<String, Object> getClaims() {
        return delegate.getClaims();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return delegate.getUserInfo();
    }

    @Override
    public OidcIdToken getIdToken() {
        return delegate.getIdToken();
    }

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

    public User getUser() {
        return user;
    }
}
