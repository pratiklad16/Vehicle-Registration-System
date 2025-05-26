package com.project.Vehicle_Registration_System.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Enum.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByEmail(String email);

    public User findByUserRole(UserRole userRole);
}
