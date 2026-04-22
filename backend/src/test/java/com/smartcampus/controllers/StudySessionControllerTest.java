package com.smartcampus.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.models.Role;
import com.smartcampus.models.StudySession;
import com.smartcampus.models.User;
import com.smartcampus.repositories.FacilityRepository;
import com.smartcampus.repositories.StudySessionRepository;
import com.smartcampus.services.NotificationService;
import com.smartcampus.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StudySessionController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudySessionControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private StudySessionRepository studySessionRepository;

        @MockBean
        private FacilityRepository facilityRepository;

        @MockBean
        private UserService userService;

        @MockBean
        private NotificationService notificationService;

        // Admin user returned by userService.getCurrentUser() for admin-guarded tests
        private User adminUser;

        @BeforeEach
        void setUp() {
                adminUser = User.builder()
                                .email("admin@smartcampus.com")
                                .name("Admin User")
                                .role(Role.ADMIN)
                                .build();
        }

        @Test
        void testGetAvailableFacilities() throws Exception {
                Mockito.when(facilityRepository.findByCategoryAndMaintenanceStatus("Study Area", "No Maintenance"))
                                .thenReturn(Collections.emptyList());

                mockMvc.perform(get("/api/study-sessions/available-facilities"))
                                .andExpect(status().isOk());
        }

        /**
         * Tests the updated PUT /admin/{id}/reject endpoint with a reason body.
         * The controller accepts an optional @RequestBody Map<String, String>
         * containing the rejection reason, stores it on the session, and injects
         * it into the notification message sent to the lecturer.
         */
        @Test
        void testRejectSessionWithReason() throws Exception {
                // Mock admin identity so the controller's role guard passes
                Mockito.when(userService.getCurrentUser()).thenReturn(Optional.of(adminUser));

                StudySession session = new StudySession();
                session.setSubjectName("Computer Science");
                session.setLecturerId("lecturer-1");

                Mockito.when(studySessionRepository.findById("session-1"))
                                .thenReturn(Optional.of(session));
                Mockito.when(studySessionRepository.save(Mockito.any(StudySession.class)))
                                .thenReturn(session);

                Map<String, String> payload = Map.of("reason", "Facility is under scheduled maintenance this week.");

                mockMvc.perform(put("/api/study-sessions/admin/session-1/reject")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(payload)))
                                .andExpect(status().isOk());
        }

        /**
         * Tests the reject endpoint without a body — verifies the optional
         * 
         * @RequestBody(required = false) behaviour added to the controller.
         *                       Reason should default to empty string and no exception
         *                       should be thrown.
         */
        @Test
        void testRejectSessionWithoutReason() throws Exception {
                // Mock admin identity so the controller's role guard passes
                Mockito.when(userService.getCurrentUser()).thenReturn(Optional.of(adminUser));

                StudySession session = new StudySession();
                session.setSubjectName("Mathematics");
                session.setLecturerId("lecturer-2");

                Mockito.when(studySessionRepository.findById("session-2"))
                                .thenReturn(Optional.of(session));
                Mockito.when(studySessionRepository.save(Mockito.any(StudySession.class)))
                                .thenReturn(session);

                // No body — reason defaults to empty string per controller logic
                mockMvc.perform(put("/api/study-sessions/admin/session-2/reject")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk());
        }

        /**
         * Tests reject returns 404 when the session ID does not exist.
         * The controller passes the role check first, then returns 404 from the
         * repository.
         */
        @Test
        void testRejectSessionNotFound() throws Exception {
                // Mock admin identity so the controller's role guard passes (reaches 404 logic)
                Mockito.when(userService.getCurrentUser()).thenReturn(Optional.of(adminUser));

                Mockito.when(studySessionRepository.findById("non-existent"))
                                .thenReturn(Optional.empty());

                Map<String, String> payload = Map.of("reason", "Some reason.");

                mockMvc.perform(put("/api/study-sessions/admin/non-existent/reject")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(payload)))
                                .andExpect(status().isNotFound());
        }
}
