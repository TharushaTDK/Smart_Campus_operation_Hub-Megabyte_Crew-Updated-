package com.smartcampus.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.dto.LoginRequest;
import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import com.smartcampus.repositories.UserRepository;
import com.smartcampus.services.UserService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private UserService userService;

        @MockBean
        private UserRepository userRepository;

        @MockBean
        private PasswordEncoder passwordEncoder;

        @Autowired
        private ObjectMapper objectMapper;

        // ---------------- REGISTER SUCCESS ----------------

        @Test
        void testRegisterSuccess() throws Exception {

                RegisterRequest request = new RegisterRequest();
                request.setName("John");
                request.setEmail("john@test.com");
                request.setPassword("123456");

                Mockito.when(userRepository.existsByEmail("john@test.com"))
                                .thenReturn(false);

                Mockito.when(passwordEncoder.encode("123456"))
                                .thenReturn("encodedPassword");

                User savedUser = User.builder()
                                .name("John")
                                .email("john@test.com")
                                .password("encodedPassword")
                                .provider("local")
                                .role(Role.STUDENT)
                                .enabled(true)
                                .createdAt(new Date())
                                .updatedAt(new Date())
                                .build();
                savedUser.setId("1");

                Mockito.when(userRepository.save(Mockito.any(User.class)))
                                .thenReturn(savedUser);

                mockMvc.perform(post("/api/auth/register").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated());
        }

        // ---------------- REGISTER DUPLICATE EMAIL ----------------

        @Test
        void testRegisterDuplicateEmail() throws Exception {

                RegisterRequest request = new RegisterRequest();
                request.setName("John");
                request.setEmail("john@test.com");
                request.setPassword("123456");

                Mockito.when(userRepository.existsByEmail("john@test.com"))
                                .thenReturn(true);

                mockMvc.perform(post("/api/auth/register").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isConflict());
        }

        // ---------------- LOGIN USER NOT FOUND ----------------

        @Test
        void testLoginUserNotFound() throws Exception {

                LoginRequest request = new LoginRequest();
                request.setEmail("wrong@test.com");
                request.setPassword("123456");

                Mockito.when(userRepository.findFirstByEmail("wrong@test.com"))
                                .thenReturn(Optional.empty());

                mockMvc.perform(post("/api/auth/login").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized());
        }

        // ---------------- LOGIN WRONG PASSWORD ----------------

        @Test
        void testLoginWrongPassword() throws Exception {

                LoginRequest request = new LoginRequest();
                request.setEmail("john@test.com");
                request.setPassword("wrongpass");

                User user = User.builder()
                                .name("John")
                                .email("john@test.com")
                                .password("encodedPassword")
                                .provider("local")
                                .role(Role.STUDENT)
                                .enabled(true)
                                .build();
                user.setId("1");

                Mockito.when(userRepository.findFirstByEmail("john@test.com"))
                                .thenReturn(Optional.of(user));

                Mockito.when(passwordEncoder.matches("wrongpass", "encodedPassword"))
                                .thenReturn(false);

                mockMvc.perform(post("/api/auth/login").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isUnauthorized());
        }

        // ---------------- LOGIN SUCCESS ----------------

        @Test
        void testLoginSuccess() throws Exception {

                LoginRequest request = new LoginRequest();
                request.setEmail("john@test.com");
                request.setPassword("123456");

                User user = User.builder()
                                .name("John")
                                .email("john@test.com")
                                .password("encodedPassword")
                                .provider("local")
                                .role(Role.STUDENT)
                                .enabled(true)
                                .build();
                user.setId("1");

                Mockito.when(userRepository.findFirstByEmail("john@test.com"))
                                .thenReturn(Optional.of(user));

                Mockito.when(passwordEncoder.matches("123456", "encodedPassword"))
                                .thenReturn(true);

                Mockito.when(userRepository.save(Mockito.any(User.class)))
                                .thenReturn(user);

                mockMvc.perform(post("/api/auth/login").with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk());
        }
}