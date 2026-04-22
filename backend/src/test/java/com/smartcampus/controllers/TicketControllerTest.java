package com.smartcampus.controllers;

import com.smartcampus.models.User;
import com.smartcampus.models.Role;
import com.smartcampus.repositories.TicketRepository;
import com.smartcampus.services.CloudinaryService;
import com.smartcampus.services.NotificationService;
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

@WebMvcTest(TicketController.class)
@AutoConfigureMockMvc(addFilters = false)
class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TicketRepository ticketRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private CloudinaryService cloudinaryService;

    @Test
    void testGetMyTickets() throws Exception {
        User user = User.builder().name("Student").role(Role.STUDENT).build();
        user.setId("u1");

        Mockito.when(userService.getCurrentUser()).thenReturn(Optional.of(user));
        Mockito.when(ticketRepository.findBySenderId("u1")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/tickets/my"))
                .andExpect(status().isOk());
    }
}
