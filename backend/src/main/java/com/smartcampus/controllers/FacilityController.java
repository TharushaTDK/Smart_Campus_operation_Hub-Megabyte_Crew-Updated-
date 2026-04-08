package com.smartcampus.controllers;

import com.smartcampus.models.Facility;
import com.smartcampus.models.MaintenanceItem;
import com.smartcampus.repositories.FacilityRepository;
import com.smartcampus.repositories.MaintenanceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/facilities")
@PreAuthorize("hasRole('ADMIN')")
public class FacilityController {

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private MaintenanceItemRepository maintenanceRepository;

    @PostMapping
    public ResponseEntity<?> addFacility(@RequestBody Facility facility) {
        try {
            Facility saved = facilityRepository.save(facility);

            if ("Under Maintenance".equals(saved.getMaintenanceStatus())) {
                MaintenanceItem mainItem = new MaintenanceItem();
                mainItem.setName(saved.getName());
                mainItem.setType(saved.getType());
                mainItem.setLocation(saved.getLocation());
                mainItem.setStatus("Pending");
                mainItem.setSourceId(saved.getId());
                maintenanceRepository.save(mainItem);
            }

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add facility/asset: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(facilityRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable String id, @RequestBody Facility updatedFacility) {
        try {
            java.util.Optional<Facility> opt = facilityRepository.findById(id);
            if (opt.isPresent()) {
                Facility facility = opt.get();
                facility.setName(updatedFacility.getName());
                facility.setCategory(updatedFacility.getCategory());
                facility.setType(updatedFacility.getType());
                facility.setCapacity(updatedFacility.getCapacity());
                facility.setLocation(updatedFacility.getLocation());
                facility.setMaintenanceStatus(updatedFacility.getMaintenanceStatus());
                facility.setAttributes(updatedFacility.getAttributes());
                
                Facility saved = facilityRepository.save(facility);
                return ResponseEntity.ok(saved);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update facility/asset: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFacility(@PathVariable String id) {
        facilityRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
