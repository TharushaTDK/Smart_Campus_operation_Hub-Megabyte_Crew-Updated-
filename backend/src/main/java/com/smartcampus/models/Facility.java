package com.smartcampus.models;

import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = "Facilities & Asset")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Facility {

    @Id
    private String id;

    private String name;
    private String category; // "Study Area", "Equipment", "Other Asset"
    private String type; // e.g., "Lecture Hall" or "Air Conditioner"
    private Integer capacity;
    private String location;
    private String maintenanceStatus; // "No Maintenance" or "Under Maintenance"

    // Dynamic type-specific attributes (hasProjector, labEquipmentType, etc.)
    private Map<String, Object> attributes;

    public Facility() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getMaintenanceStatus() { return maintenanceStatus; }
    public void setMaintenanceStatus(String maintenanceStatus) { this.maintenanceStatus = maintenanceStatus; }

    public Map<String, Object> getAttributes() { return attributes; }
    public void setAttributes(Map<String, Object> attributes) { this.attributes = attributes; }
}
