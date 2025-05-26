package com.project.Vehicle_Registration_System.Services.order;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.Vehicle_Registration_System.Entity.Order;
import com.project.Vehicle_Registration_System.Entity.SparePart;
import com.project.Vehicle_Registration_System.Entity.User;
import com.project.Vehicle_Registration_System.Enum.OrderStatus;
import com.project.Vehicle_Registration_System.Repository.OrderRepository;
import com.project.Vehicle_Registration_System.Repository.SparePartRepository;
import com.project.Vehicle_Registration_System.Repository.UserRepository;
import com.project.Vehicle_Registration_System.dto.OrderDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final SparePartRepository sparePartRepository;

    @Override
    @Transactional
    public OrderDto placeOrder(OrderDto orderDto) {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<SparePart> sparePartOptional = sparePartRepository.findById(orderDto.getSparePartId());
        
        if (userOptional.isPresent() && sparePartOptional.isPresent()) {
            User currentUser = userOptional.get();
            SparePart sparePart = sparePartOptional.get();
            
            // Check if enough stock is available
            if (sparePart.getQuantityInStock() < orderDto.getQuantity()) {
                return null; // Not enough stock
            }
            
            // Create order
            Order order = new Order();
            order.setUser(currentUser);
            order.setSparePart(sparePart);
            order.setQuantity(orderDto.getQuantity());
            order.setTotalPrice(sparePart.getPrice() * orderDto.getQuantity());
            order.setDeliveryAddress(orderDto.getDeliveryAddress());
            order.setStatus(OrderStatus.PENDING);
            
            // Update stock
            sparePart.setQuantityInStock(sparePart.getQuantityInStock() - orderDto.getQuantity());
            sparePartRepository.save(sparePart);
            
            Order savedOrder = orderRepository.save(order);
            return savedOrder.getOrderDto();
        }
        
        return null;
    }

    @Override
    public OrderDto updateOrderStatus(Long id, OrderStatus status) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            
            // If cancelling an order that was not delivered, restore stock
            if (status == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.DELIVERED) {
                SparePart sparePart = order.getSparePart();
                sparePart.setQuantityInStock(sparePart.getQuantityInStock() + order.getQuantity());
                sparePartRepository.save(sparePart);
            }
            
            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            return updatedOrder.getOrderDto();
        }
        
        return null;
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(Order::getOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(Order::getOrderDto)
                .orElse(null);
    }

    @Override
    public List<OrderDto> getUserOrders() {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        
        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();
            return orderRepository.findByUser(currentUser).stream()
                    .map(Order::getOrderDto)
                    .collect(Collectors.toList());
        }
        
        return List.of();
    }

    @Override
    public List<OrderDto> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(Order::getOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean cancelOrder(Long id) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            
            // Only allow cancellation if order is not delivered yet
            if (order.getStatus() != OrderStatus.DELIVERED) {
                // Restore stock
                SparePart sparePart = order.getSparePart();
                sparePart.setQuantityInStock(sparePart.getQuantityInStock() + order.getQuantity());
                sparePartRepository.save(sparePart);
                
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
                return true;
            }
        }
        
        return false;
    }

    @Override
    public OrderDto updateTrackingInfo(Long id, String trackingNumber) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setTrackingNumber(trackingNumber);
            
            // If tracking number is added, update status to shipped
            if (trackingNumber != null && !trackingNumber.isEmpty()) {
                order.setStatus(OrderStatus.SHIPPED);
            }
            
            Order updatedOrder = orderRepository.save(order);
            return updatedOrder.getOrderDto();
        }
        
        return null;
    }
    
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    @Override
    @Transactional
    public boolean adminDeleteOrder(Long orderId) {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        
        if (userOptional.isPresent() && orderOptional.isPresent()) {
            User currentUser = userOptional.get();
            Order order = orderOptional.get();
            
            // Check if current user is admin
            if (currentUser.getUserRole().name().equals("ADMIN")) {
                // If order was not delivered or cancelled, restore stock
                if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.CANCELLED) {
                    SparePart sparePart = order.getSparePart();
                    if (sparePart != null) {
                        sparePart.setQuantityInStock(sparePart.getQuantityInStock() + order.getQuantity());
                        sparePartRepository.save(sparePart);
                    }
                }
                
                orderRepository.deleteById(orderId);
                return true;
            }
        }
        
        return false;
    }

    @Override
    public boolean userDeleteOrder(Long id) {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<Order> orderOptional = orderRepository.findById(id);
        
        if (userOptional.isPresent() && orderOptional.isPresent()) {
            User currentUser = userOptional.get();
            Order order = orderOptional.get();
            
            // Check if the current user owns this order
            if (order.getUser() != null && order.getUser().getId() == currentUser.getId()) {
                // If order was not delivered or cancelled, restore stock
                if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.CANCELLED) {
                    SparePart sparePart = order.getSparePart();
                    if (sparePart != null) {
                        sparePart.setQuantityInStock(sparePart.getQuantityInStock() + order.getQuantity());
                        sparePartRepository.save(sparePart);
                    }
                }
                
                orderRepository.deleteById(id);
                return true;
            }
        }
        
        return false;
    }

    @Override
    public List<OrderDto> getUserOrdersById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return orderRepository.findByUser(user).stream()
                    .map(Order::getOrderDto)
                    .collect(Collectors.toList());
        }
        
        return List.of();
    }
    /* 
    @Override
    public List<OrderDto> findByIsInventoryTransaction(boolean isInventoryTransaction) {
        return orderRepository.findByIsInventoryTransaction(isInventoryTransaction).stream().
                map(OrderDto::getOrderDto)
                .collect(Collectors.toList());
    }
    */
    
}