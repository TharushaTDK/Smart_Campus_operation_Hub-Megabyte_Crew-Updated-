package com.smartcampus.repositories;

import com.smartcampus.models.Role;
import com.smartcampus.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findFirstByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    List<User> findByRole(Role role);

    boolean existsByEmail(String email);

    long countByRole(Role role);
}
