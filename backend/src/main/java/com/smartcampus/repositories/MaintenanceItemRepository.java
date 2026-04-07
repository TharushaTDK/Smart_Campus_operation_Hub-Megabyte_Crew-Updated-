package com.smartcampus.repositories;

import com.smartcampus.models.MaintenanceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MaintenanceItemRepository extends MongoRepository<MaintenanceItem, String> {
    List<MaintenanceItem> findBySourceId(String sourceId);
}
