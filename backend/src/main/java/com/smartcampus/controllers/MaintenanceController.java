package com.smartcampus.controllers;

import com.smartcampus.models.MaintenanceItem;
import com.smartcampus.models.Facility;
import com.smartcampus.repositories.MaintenanceItemRepository;
import com.smartcampus.repositories.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceItemRepository maintenanceItemRepository;
    
    @Autowired
    private FacilityRepository facilityRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MAINTAIN_STAFF')")
    public ResponseEntity<List<MaintenanceItem>> getAllMaintenanceItems() {
        return ResponseEntity.ok(maintenanceItemRepository.findAll());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MAINTAIN_STAFF')")
    public ResponseEntity<?> updateMaintenanceStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        Optional<MaintenanceItem> opt = maintenanceItemRepository.findById(id);
        if (opt.isPresent()) {
            MaintenanceItem item = opt.get();
            item.setStatus(newStatus);
            MaintenanceItem saved = maintenanceItemRepository.save(item);
            
            // If completed, reset the maintenanceStatus on the Facility (root field + attributes)
            if ("Completed".equals(newStatus) && item.getSourceId() != null) {
                Optional<Facility> saOpt = facilityRepository.findById(item.getSourceId());
                if (saOpt.isPresent()) {
                    Facility sa = saOpt.get();
                    // Update root-level field (drives admin card display)
                    sa.setMaintenanceStatus("No Maintenance");
                    facilityRepository.save(sa);
                }
            }
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createMaintenanceItem(@RequestBody MaintenanceItem item) {
        if (item.getStatus() == null || item.getStatus().isEmpty()) {
            item.setStatus("Pending"); // Default status
        }
        
        if (item.getSourceId() != null) {
            Optional<Facility> opt = facilityRepository.findById(item.getSourceId());
            if (opt.isPresent()) {
                Facility f = opt.get();
                f.setMaintenanceStatus("Under Maintenance");
                facilityRepository.save(f);
            }
        }
        
        MaintenanceItem saved = maintenanceItemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMaintenanceItem(@PathVariable String id, @RequestBody MaintenanceItem updatedItem) {
        Optional<MaintenanceItem> opt = maintenanceItemRepository.findById(id);
        if (opt.isPresent()) {
            MaintenanceItem item = opt.get();
            item.setName(updatedItem.getName());
            item.setDescription(updatedItem.getDescription());
            item.setType(updatedItem.getType());
            item.setLocation(updatedItem.getLocation());
            if (updatedItem.getStatus() != null && !updatedItem.getStatus().isEmpty()) {
                item.setStatus(updatedItem.getStatus());
            }
            if (updatedItem.getSourceId() != null) {
                item.setSourceId(updatedItem.getSourceId());
            }
            MaintenanceItem saved = maintenanceItemRepository.save(item);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMaintenanceItem(@PathVariable String id) {
        Optional<MaintenanceItem> opt = maintenanceItemRepository.findById(id);
        if (opt.isPresent()) {
            MaintenanceItem item = opt.get();
            if (!"Completed".equals(item.getStatus()) && item.getSourceId() != null) {
                Optional<Facility> fOpt = facilityRepository.findById(item.getSourceId());
                if (fOpt.isPresent()) {
                    Facility f = fOpt.get();
                    f.setMaintenanceStatus("No Maintenance");
                    facilityRepository.save(f);
                }
            }
            maintenanceItemRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

