package com.smartcampus.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.models.Facility;
import com.smartcampus.repositories.FacilityRepository;
import com.smartcampus.repositories.MaintenanceItemRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FacilityController.class)
@AutoConfigureMockMvc(addFilters = false)
class FacilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FacilityRepository facilityRepository;

    @MockBean
    private MaintenanceItemRepository maintenanceRepository;

    @Test
    void testGetAllFacilities() throws Exception {
        Mockito.when(facilityRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/admin/facilities"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateFacility() throws Exception {
        Facility existingFacility = new Facility();
        existingFacility.setName("Lecture Hall A");
        existingFacility.setCategory("Study Area");
        existingFacility.setType("Lecture Hall");
        existingFacility.setCapacity(150);
        existingFacility.setLocation("Block A, Floor 1");
        existingFacility.setMaintenanceStatus("No Maintenance");

        Facility updatedFacility = new Facility();
        updatedFacility.setName("Lecture Hall A Updated");
        updatedFacility.setCategory("Study Area");
        updatedFacility.setType("Lecture Hall");
        updatedFacility.setCapacity(200);
        updatedFacility.setLocation("Block A, Floor 2");
        updatedFacility.setMaintenanceStatus("No Maintenance");

        Mockito.when(facilityRepository.findById("facility-1"))
                .thenReturn(Optional.of(existingFacility));
        Mockito.when(facilityRepository.save(Mockito.any(Facility.class)))
                .thenReturn(updatedFacility);

        mockMvc.perform(put("/api/admin/facilities/facility-1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedFacility)))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateFacilityNotFound() throws Exception {
        Facility updatedFacility = new Facility();
        updatedFacility.setName("Non-existent Facility");

        Mockito.when(facilityRepository.findById("non-existent-id"))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/api/admin/facilities/non-existent-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedFacility)))
                .andExpect(status().isNotFound());
    }

}

    