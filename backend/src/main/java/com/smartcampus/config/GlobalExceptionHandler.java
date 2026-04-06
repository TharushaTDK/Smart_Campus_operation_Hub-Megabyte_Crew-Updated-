package com.smartcampus.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * Converts any uncaught exception into a structured JSON response
 * instead of Spring's default HTML error page.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = Logger.getLogger(GlobalExceptionHandler.class.getName());

    /** Validation failures (e.g. @NotBlank, @Email on DTOs) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }

    /** Any other uncaught runtime exception → 500 with the real message */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAll(Exception ex, HttpServletRequest req) {
        log.severe("Unhandled error [" + req.getMethod() + " " + req.getRequestURI() + "]: " + ex);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Internal server error");
        body.put("detail", ex.getMessage() != null ? ex.getMessage() : ex.getClass().getName());
        body.put("path", req.getRequestURI());

        return ResponseEntity.status(500).body(body);
    }
}
