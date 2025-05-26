package com.project.Vehicle_Registration_System.Entity;

import java.util.Date;
import java.util.List;

import com.project.Vehicle_Registration_System.Enum.VehicleType;
import com.project.Vehicle_Registration_System.dto.SparePartDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Data
@Table(name = "spare_parts")
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Long id;

    @Column(nullable=false)
    private String partName;

    @Column(nullable = false, unique = true)
    private String partNumber;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    private String compatibleModels;

    @Column(nullable = false)
    private Integer quantityInStock;

    private String vendorName;

    @Column(nullable = false)
    private Double price;

    @Temporal(TemporalType.TIMESTAMP)
    private Date addedOn = new Date();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "sparePart",cascade = jakarta.persistence.CascadeType.ALL)
    private List<Order> orders;

    public SparePartDto getSparePartDto() {
        SparePartDto sparePartDto = new SparePartDto();
        sparePartDto.setId(this.id);
        sparePartDto.setPartName(this.partName);
        sparePartDto.setPartNumber(this.partNumber);
        sparePartDto.setVehicleType(this.vehicleType);
        sparePartDto.setCompatibleModels(this.compatibleModels);
        sparePartDto.setQuantityInStock(this.quantityInStock);
        sparePartDto.setVendorName(this.vendorName);
        sparePartDto.setPrice(this.price);
        sparePartDto.setAddedOn(this.addedOn);

        if (this.user != null) {
            sparePartDto.setUserId(this.user.getId());
            sparePartDto.setUserName(this.user.getName());
            sparePartDto.setUserEmail(this.user.getEmail());
        }
        return sparePartDto;
    }
}
