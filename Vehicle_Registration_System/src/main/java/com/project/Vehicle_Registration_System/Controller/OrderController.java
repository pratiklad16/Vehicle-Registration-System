package com.project.Vehicle_Registration_System.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.Vehicle_Registration_System.Enum.OrderStatus;
import com.project.Vehicle_Registration_System.Services.order.OrderService;
import com.project.Vehicle_Registration_System.Services.sparePart.SparePartService;
import com.project.Vehicle_Registration_System.dto.OrderDto;
import com.project.Vehicle_Registration_System.dto.SparePartDto;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final SparePartService sparePartService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderDto orderDto) {
        // Validate that spare part exists and has sufficient stock
        SparePartDto sparePart = sparePartService.getSparePartById(orderDto.getSparePartId());
        if (sparePart == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Spare part not found");
        }
        
        if (sparePart.getQuantityInStock() < orderDto.getQuantity()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Not enough stock available. Currently available: " + sparePart.getQuantityInStock());
        }
        
        OrderDto createdOrder = orderService.placeOrder(orderDto);
        if (createdOrder != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create order");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserOrders() {
        return ResponseEntity.ok(orderService.getUserOrders());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String statusStr = statusUpdate.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body("status is required");
        }
        
        try {
            OrderStatus status = OrderStatus.valueOf(statusStr);
            OrderDto updatedOrder = orderService.updateOrderStatus(id, status);
            
            if (updatedOrder != null) {
                return ResponseEntity.ok(updatedOrder);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid order status: " + statusStr);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        boolean cancelled = orderService.cancelOrder(id);
        if (cancelled) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to cancel order. The order may not exist or has already been delivered.");
        }
    }

    @PutMapping("/{id}/tracking")
    public ResponseEntity<?> updateTrackingInfo(@PathVariable Long id, @RequestBody Map<String, String> trackingInfo) {
        String trackingNumber = trackingInfo.get("trackingNumber");
        if (trackingNumber == null) {
            return ResponseEntity.badRequest().body("trackingNumber is required");
        }
        
        OrderDto updatedOrder = orderService.updateTrackingInfo(id, trackingNumber);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrdersById(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrdersById(userId));
    }
    
}