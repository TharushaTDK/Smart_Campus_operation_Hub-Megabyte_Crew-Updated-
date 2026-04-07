package com.smartcampus.repositories;

import com.smartcampus.models.Ticket;
import com.smartcampus.models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findBySenderId(String senderId);
    List<Ticket> findBySenderRole(Role senderRole);
    List<Ticket> findByAssignedTo(String assignedTo);
}
