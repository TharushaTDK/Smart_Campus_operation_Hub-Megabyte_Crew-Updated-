package com.smartcampus.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import java.util.logging.Logger;

@Configuration
public class MigrationConfig {

    private static final Logger log = Logger.getLogger(MigrationConfig.class.getName());

    @Bean
    public CommandLineRunner migrateStudyAreas(MongoTemplate mongoTemplate) {
        return args -> {
            try {
                MongoDatabase db = mongoTemplate.getDb();

                // 1. Rename collection if 'study_areas' exists
                boolean studyAreasExists = false;
                for (String name : db.listCollectionNames()) {
                    if ("study_areas".equals(name)) {
                        studyAreasExists = true;
                        break;
                    }
                }

                if (studyAreasExists) {
                    log.info("Migration: Found 'study_areas' collection. Renaming to 'Facilities & Asset'...");
                    db.getCollection("study_areas").renameCollection(
                            new com.mongodb.MongoNamespace(db.getName(), "Facilities & Asset"));
                    log.info("Migration: Collection renamed successfully.");
                }

                // 2. Data Alignment Migration
                // a) Migrate old class names
                log.info("Migration: Fixing class structures and missing categories...");
                mongoTemplate.getCollection("Facilities & Asset").updateMany(
                        new Document("_class", "com.smartcampus.models.StudyArea"),
                        Updates.combine(
                                Updates.set("_class", "com.smartcampus.models.Facility"),
                                Updates.set("category", "Study Area")));

                // b) Default missing categories
                mongoTemplate.getCollection("Facilities & Asset").updateMany(
                        new Document("category", new Document("$exists", false)),
                        Updates.set("category", "Study Area"));

                log.info("Migration: Successfully aligned campus resource and asset data.");

            } catch (Exception e) {
                log.warning("Migration skipped: " + e.getMessage());
            }
        };
    }
}
