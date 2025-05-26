package com.project.Vehicle_Registration_System.Entity;

import java.util.Date;

import com.project.Vehicle_Registration_System.Enum.OrderStatus;
import com.project.Vehicle_Registration_System.dto.OrderDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id",foreignKey = @ForeignKey(name = "FK_ORDER_USER"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "part_id")
    private SparePart sparePart;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double totalPrice;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate = new Date();

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.CONFIRMED;

    private String deliveryAddress;

    private String trackingNumber;

    @Temporal(TemporalType.TIMESTAMP)
    private Date deliveryDate;

    private boolean isInventoryTransaction;

    public void setIsInventoryTransaction(boolean isInventoryTransaction) {
        this.isInventoryTransaction = isInventoryTransaction;
    }

    public OrderDto getOrderDto() {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(this.id);
        orderDto.setQuantity(this.quantity);
        orderDto.setTotalPrice(this.totalPrice);
        orderDto.setOrderDate(this.orderDate);
        orderDto.setStatus(this.status);
        orderDto.setDeliveryAddress(this.deliveryAddress);
        orderDto.setTrackingNumber(this.trackingNumber);
        orderDto.setDeliveryDate(this.deliveryDate);
        orderDto.setIsInventoryTransaction(this.isInventoryTransaction);

        if (this.user != null) {
            orderDto.setUserId(this.user.getId());
            orderDto.setUserName(this.user.getName());
            orderDto.setUserEmail(this.user.getEmail());
        }

        if (this.sparePart != null) {
            orderDto.setPartId(this.sparePart.getId());
            orderDto.setPartName(this.sparePart.getPartName());
            orderDto.setPartNumber(this.sparePart.getPartNumber());
            orderDto.setUnitPrice(this.sparePart.getPrice());
        }

        return orderDto;
    }

}
