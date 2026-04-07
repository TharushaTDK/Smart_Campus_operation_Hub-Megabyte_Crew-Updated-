package com.smartcampus.controllers;

import org.springframework.web.bind.annotation.*;

/**
 * General application controller.
 */
@RestController
public class UserController {

    @GetMapping("/api/user/ping")
    public String ping() {
        return "Smart Campus API is running.";
    }
}
