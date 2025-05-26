package com.project.Vehicle_Registration_System.Services.sparePart;

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
import com.project.Vehicle_Registration_System.Enum.VehicleType;
import com.project.Vehicle_Registration_System.Repository.OrderRepository;
import com.project.Vehicle_Registration_System.Repository.SparePartRepository;
import com.project.Vehicle_Registration_System.Repository.UserRepository;
import com.project.Vehicle_Registration_System.dto.SparePartDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository sparePartRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository; // Added OrderRepository

    @Override
    @Transactional
    public SparePartDto addSparePart(SparePartDto sparePartDto) {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);

        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();

            // Create spare part
            SparePart sparePart = new SparePart();
            sparePart.setPartName(sparePartDto.getPartName());
            sparePart.setPartNumber(sparePartDto.getPartNumber());
            sparePart.setVehicleType(sparePartDto.getVehicleType());
            sparePart.setCompatibleModels(sparePartDto.getCompatibleModels());
            sparePart.setQuantityInStock(sparePartDto.getQuantityInStock());
            sparePart.setVendorName(sparePartDto.getVendorName());
            sparePart.setPrice(sparePartDto.getPrice());
            sparePart.setUser(currentUser);

            // Save spare part
            SparePart savedPart = sparePartRepository.save(sparePart);

            // Create an automatic order record to track this transaction
            Order orderRecord = new Order();
            orderRecord.setUser(currentUser);
            orderRecord.setSparePart(savedPart);
            orderRecord.setQuantity(sparePartDto.getQuantityInStock()); // Initial stock quantity
            orderRecord.setTotalPrice(savedPart.getPrice() * sparePartDto.getQuantityInStock());
            //orderRecord.setStatus(OrderStatus.INVENTORY_ADJUSTMENT); // Using specific status for inventory transactions
            orderRecord.setDeliveryAddress("Inventory Addition"); // Mark as inventory transaction
            orderRecord.setIsInventoryTransaction(true); // Set the inventory transaction flag

            // Save the order record
            orderRepository.save(orderRecord);

            return savedPart.getSparePartDto();
        }

        return null;
    }

    @Override
    @Transactional
    public SparePartDto updateSparePart(Long id, SparePartDto sparePartDto) {
        Optional<SparePart> sparePartOptional = sparePartRepository.findById(id);

        if (sparePartOptional.isPresent()) {
            SparePart existingSparePart = sparePartOptional.get();

            // Get current user
            String currentUserEmail = getCurrentUserEmail();
            Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);

            if (!userOptional.isPresent()) {
                throw new UnauthorizedException("User not authenticated");
            }

            User currentUser = userOptional.get();

            // Check if current user is the owner of this spare part
            if (existingSparePart.getUser() != null
                    && existingSparePart.getUser().getId() != currentUser.getId()) {
                throw new UnauthorizedException("You can only edit spare parts that you created");
            }

            // Track changes for creating a history record
            boolean hasChanges = false;
            StringBuilder changeDescription = new StringBuilder("Updated: ");

            // Check and track name changes
            if (!existingSparePart.getPartName().equals(sparePartDto.getPartName())) {
                changeDescription.append("name (").append(existingSparePart.getPartName())
                        .append(" → ").append(sparePartDto.getPartName()).append("), ");
                existingSparePart.setPartName(sparePartDto.getPartName());
                hasChanges = true;
            }

            // Check and track vehicle type changes
            if (!existingSparePart.getVehicleType().equals(sparePartDto.getVehicleType())) {
                changeDescription.append("vehicle type (").append(existingSparePart.getVehicleType())
                        .append(" → ").append(sparePartDto.getVehicleType()).append("), ");
                existingSparePart.setVehicleType(sparePartDto.getVehicleType());
                hasChanges = true;
            }

            // Check and track compatible models changes
            if (!existingSparePart.getCompatibleModels().equals(sparePartDto.getCompatibleModels())) {
                changeDescription.append("compatible models, ");
                existingSparePart.setCompatibleModels(sparePartDto.getCompatibleModels());
                hasChanges = true;
            }

            // Check and track vendor name changes
            if (!existingSparePart.getVendorName().equals(sparePartDto.getVendorName())) {
                changeDescription.append("vendor (").append(existingSparePart.getVendorName())
                        .append(" → ").append(sparePartDto.getVendorName()).append("), ");
                existingSparePart.setVendorName(sparePartDto.getVendorName());
                hasChanges = true;
            }

            // Check and track price changes
            if (!existingSparePart.getPrice().equals(sparePartDto.getPrice())) {
                changeDescription.append("price (").append(existingSparePart.getPrice())
                        .append(" → ").append(sparePartDto.getPrice()).append("), ");
                existingSparePart.setPrice(sparePartDto.getPrice());
                hasChanges = true;
            }

            // Check and track quantity changes
            int oldQuantity = existingSparePart.getQuantityInStock();
            int newQuantity = sparePartDto.getQuantityInStock();
            int quantityChange = newQuantity - oldQuantity;

            if (quantityChange != 0) {
                changeDescription.append("quantity (").append(oldQuantity)
                        .append(" → ").append(newQuantity).append("), ");
                existingSparePart.setQuantityInStock(newQuantity);
                hasChanges = true;
            }

            // Remove trailing comma and space if changes were made
            if (hasChanges && changeDescription.toString().endsWith(", ")) {
                changeDescription.setLength(changeDescription.length() - 2);
            }

            SparePart updatedPart = sparePartRepository.save(existingSparePart);

            // Create an order record if any changes were made
            if (hasChanges) {
                Order orderRecord = new Order();
                orderRecord.setUser(currentUser);
                orderRecord.setSparePart(updatedPart);
                //orderRecord.setStatus(OrderStatus.INVENTORY_ADJUSTMENT);
                orderRecord.setIsInventoryTransaction(true);

                // Set quantity if it changed, otherwise set to 0
                if (quantityChange != 0) {
                    orderRecord.setQuantity(Math.abs(quantityChange));
                    orderRecord.setTotalPrice(updatedPart.getPrice() * Math.abs(quantityChange));

                    if (quantityChange > 0) {
                        orderRecord.setDeliveryAddress("Inventory Addition: " + changeDescription.toString());
                    } else {
                        orderRecord.setDeliveryAddress("Inventory Reduction: " + changeDescription.toString());
                    }
                } else {
                    // For non-quantity changes, set these fields accordingly
                    orderRecord.setQuantity(0);
                    orderRecord.setTotalPrice(0.0);
                    orderRecord.setDeliveryAddress("Metadata Update: " + changeDescription.toString());
                }

                // Save the order record
                orderRepository.save(orderRecord);
            }

            return updatedPart.getSparePartDto();
        }

        return null;
    }

    @Override
    @Transactional
    public boolean updateStock(Long id, Integer quantityChange) {
        Optional<SparePart> sparePartOptional = sparePartRepository.findById(id);

        if (sparePartOptional.isPresent()) {
            SparePart sparePart = sparePartOptional.get();

            int newQuantity = sparePart.getQuantityInStock() + quantityChange;

            // Prevent negative stock
            if (newQuantity < 0) {
                return false;
            }

            sparePart.setQuantityInStock(newQuantity);
            sparePartRepository.save(sparePart);

            // Create an order record to track this stock change
            String currentUserEmail = getCurrentUserEmail();
            Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);

            if (userOptional.isPresent()) {
                User currentUser = userOptional.get();

                Order orderRecord = new Order();
                orderRecord.setUser(currentUser);
                orderRecord.setSparePart(sparePart);
                orderRecord.setQuantity(Math.abs(quantityChange));
                orderRecord.setTotalPrice(sparePart.getPrice() * Math.abs(quantityChange));

                // Set appropriate status for inventory adjustment
                orderRecord.setStatus(OrderStatus.INVENTORY_ADJUSTMENT);
                orderRecord.setIsInventoryTransaction(true);
                if (quantityChange > 0) {
                    orderRecord.setDeliveryAddress("Stock Addition");
                } else {
                    orderRecord.setDeliveryAddress("Stock Reduction");
                }

                // Save the order record
                orderRepository.save(orderRecord);
            }

            return true;
        }

        return false;
    }

    // Existing methods remain the same...
    @Override
    public List<SparePartDto> getAllSpareParts() {
        return sparePartRepository.findAll().stream()
                .map(SparePart::getSparePartDto)
                .collect(Collectors.toList());
    }

    @Override
    public SparePartDto getSparePartById(Long id) {
        return sparePartRepository.findById(id)
                .map(SparePart::getSparePartDto)
                .orElse(null);
    }

    @Override
    public List<SparePartDto> getSparePartsByVehicleType(VehicleType vehicleType) {
        return sparePartRepository.findByVehicleType(vehicleType).stream()
                .map(SparePart::getSparePartDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SparePartDto> getSparePartsByModel(String model) {
        return sparePartRepository.findByCompatibleModelsContaining(model).stream()
                .map(SparePart::getSparePartDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean hasSparePartWithPartNumber(String partNumber) {
        return sparePartRepository.findByPartNumber(partNumber).isPresent();
    }

    @Override
    public List<SparePartDto> getUserSpareParts() {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);

        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();
            return sparePartRepository.findByUser(currentUser).stream()
                    .map(SparePart::getSparePartDto)
                    .collect(Collectors.toList());
        }

        return List.of();
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    public class UnauthorizedException extends RuntimeException {

        public UnauthorizedException(String message) {
            super(message);
        }
    }

    @Override
@Transactional
public boolean adminDeleteSparePart(Long id) {
    String currentUserEmail = getCurrentUserEmail();
    Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
    Optional<SparePart> sparePartOptional = sparePartRepository.findById(id);

    if (userOptional.isPresent() && sparePartOptional.isPresent()) {
        User currentUser = userOptional.get();

        // Check if current user is admin
        if (currentUser.getUserRole().name().equals("ADMIN")) {
            sparePartRepository.deleteById(id);
            return true;
        }
    }

    return false;
}

    @Override
    public boolean userDeleteSparePart(Long id) {
        String currentUserEmail = getCurrentUserEmail();
        Optional<User> userOptional = userRepository.findFirstByEmail(currentUserEmail);
        Optional<SparePart> sparePartOptional = sparePartRepository.findById(id);

        if (userOptional.isPresent() && sparePartOptional.isPresent()) {
            User currentUser = userOptional.get();
            SparePart sparePart = sparePartOptional.get();

            // Check if the current user owns this spare part
            if (sparePart.getUser() != null && sparePart.getUser().getId() == currentUser.getId()) {
                sparePartRepository.deleteById(id);
                return true;
            }
        }

        return false;
    }

    @Override
    public List<SparePartDto> getUserSparePartsById(Long userId) {
        return sparePartRepository.findByUserId(userId).stream()
                .map(SparePart::getSparePartDto)
                .collect(Collectors.toList());
    }

}
