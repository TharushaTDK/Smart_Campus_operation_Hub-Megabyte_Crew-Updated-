package com.smartcampus.repositories;

import com.smartcampus.models.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FacilityRepository extends MongoRepository<Facility, String> {
    List<Facility> findByCategoryAndMaintenanceStatus(String category, String maintenanceStatus);
}
