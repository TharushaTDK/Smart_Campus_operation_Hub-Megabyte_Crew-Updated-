package com.smartcampus.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
public class MainController {

    @GetMapping("/")
    public String home() {
        return "Smart Campus System API - v1.0";
    }
}
