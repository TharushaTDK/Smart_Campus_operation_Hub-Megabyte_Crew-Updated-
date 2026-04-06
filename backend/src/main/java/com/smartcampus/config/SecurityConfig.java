package com.smartcampus.config;

import com.smartcampus.services.CustomOidcUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final Logger log = Logger.getLogger(SecurityConfig.class.getName());

    private final CustomOidcUserService customOidcUserService;

    public SecurityConfig(CustomOidcUserService customOidcUserService) {
        this.customOidcUserService = customOidcUserService;
    }

    /** BCrypt password encoder — used for local registration & login */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // ── Session fixation: keep the same JSESSIONID after OAuth ─────
                // In dev (Vite proxy), Spring's default changeSessionId() creates a
                // new JSESSIONID after auth, and that new Set-Cookie doesn't always
                // reach the browser through the proxy redirect chain.
                // none() = reuse the same session ID → no extra Set-Cookie needed.
                .sessionManagement(session -> session
                        .sessionFixation().none())

                .authorizeHttpRequests(auth -> auth
                        // Public: auth endpoints + root
                        .requestMatchers(
                                "/",
                                "/error",
                                "/favicon.ico",
                                "/.well-known/**",
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/debug",
                                "/api/public/**")
                        .permitAll()
                        // Admin only
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Everything else requires login
                        .anyRequest().authenticated())

                // ── KEY FIX: for /api/** requests return 401 JSON instead of
                // redirecting to Google OAuth (which axios cannot follow) ──
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            String path = request.getRequestURI();
                            if (path.startsWith("/api/")) {
                                // REST client — return 401 JSON, do NOT redirect
                                response.setStatus(401);
                                response.setContentType("application/json");
                                response.getWriter().write("{\"error\":\"Not authenticated\"}");
                            } else {
                                // Browser page — redirect to login as normal
                                response.sendRedirect("/login");
                            }
                        }))

                // Google OAuth2 (OIDC) — must use oidcUserService() for Google
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(info -> info
                                .oidcUserService(customOidcUserService))
                        .successHandler((request, response, authentication) -> response
                                .sendRedirect("http://localhost:5173/dashboard"))
                        .failureHandler((request, response, exception) -> {
                            // Log the real cause so we can see it in the backend console
                            String msg = exception.getMessage() != null
                                    ? exception.getMessage()
                                    : exception.getClass().getName();
                            log.severe("Google OAuth2 login FAILED: " + msg);
                            if (exception.getCause() != null) {
                                log.severe("Caused by: " + exception.getCause());
                            }
                            String encoded = URLEncoder.encode(msg, StandardCharsets.UTF_8);
                            response.sendRedirect("http://localhost:5173/login?error=" + encoded);
                        }))

                // Logout
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\":\"Logged out\"}");
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll())

                .build();
    }
}
