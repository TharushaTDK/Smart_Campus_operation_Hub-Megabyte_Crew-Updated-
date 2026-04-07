package com.smartcampus.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "maintenance_items")
public class MaintenanceItem {

    @Id
    private String id;

    private String name; // e.g. "Science Lab 1"
    private String description;
    private String type; // Lecture Hall, PC Laboratory, Science Laboratory, Auditorium, Lift
    private String location;
    private String status; // "Pending", "In Progress", "Completed"
    private String sourceId; // To link back to Study Area if needed

    public MaintenanceItem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }
}
