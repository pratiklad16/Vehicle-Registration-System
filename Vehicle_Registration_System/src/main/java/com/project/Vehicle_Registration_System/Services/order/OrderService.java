package com.project.Vehicle_Registration_System.Services.order;

import java.util.List;

import com.project.Vehicle_Registration_System.Enum.OrderStatus;
import com.project.Vehicle_Registration_System.dto.OrderDto;

public interface OrderService {

    OrderDto placeOrder(OrderDto orderDto);

    OrderDto updateOrderStatus(Long id, OrderStatus status);

    List<OrderDto> getAllOrders();

    OrderDto getOrderById(Long id);

    List<OrderDto> getUserOrders();

    List<OrderDto> getOrdersByStatus(OrderStatus status);

    boolean cancelOrder(Long id);

    OrderDto updateTrackingInfo(Long id, String trackingNumber);

    boolean adminDeleteOrder(Long id);

    boolean userDeleteOrder(Long id);
    //List<OrderDto> findByIsInventoryTransaction(boolean isInventoryTransaction);

    List<OrderDto> getUserOrdersById(Long userId);
}
