package com.project.Vehicle_Registration_System.dto;

import java.util.Date;

import com.project.Vehicle_Registration_System.Enum.OrderStatus;

import lombok.Data;

@Data
public class OrderDto {

    private Long id;
    private Integer quantity;
    private Double totalPrice;
    private Date orderDate;
    private OrderStatus status;
    private String deliveryAddress;
    private String trackingNumber;
    private Date deliveryDate;
    private boolean isInventoryTransaction;

    // User information
    private Long userId;
    private String userName;
    private String userEmail;

    // Spare part information
    private Long partId;
    private String partName;
    private String partNumber;
    private Double unitPrice;

    // Additional fields for order creation
    private Long sparePartId; // Used when creating an order

    public void setIsInventoryTransaction(boolean isInventoryTransaction) {
        this.isInventoryTransaction = isInventoryTransaction;
    }
}
