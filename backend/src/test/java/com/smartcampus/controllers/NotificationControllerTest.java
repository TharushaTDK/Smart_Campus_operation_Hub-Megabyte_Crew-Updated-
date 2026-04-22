package com.smartcampus.controllers;

import com.smartcampus.models.User;
import com.smartcampus.services.NotificationService;
import com.smartcampus.services.SseNotificationService;
import com.smartcampus.services.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private UserService userService;

    @MockBean
    private SseNotificationService sseNotificationService;

    @Test
    void testGetMyNotifications() throws Exception {
        User user = new User();
        user.setId("u1");

        Mockito.when(userService.getCurrentUser()).thenReturn(Optional.of(user));
        Mockito.when(notificationService.getNotificationsForUser("u1")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk());
    }
}
