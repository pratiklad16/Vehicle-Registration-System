package com.project.Vehicle_Registration_System.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.Vehicle_Registration_System.Entity.Order;
import com.project.Vehicle_Registration_System.Entity.SparePart;
import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Enum.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findBySparePart(SparePart sparePart);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByOrderDateBetween(Date startDate, Date endDate);
    List<Order> findByUserAndStatus(User user, OrderStatus status);
    Optional<User> findByIsInventoryTransaction(boolean b);
    void deleteByUserId(Long userId);
}