# Vehicle Registration System

## Overview

The Vehicle Registration System is a full-stack web application designed to streamline the registration and management of vehicles, spare parts, users, and orders. It features a secure, scalable backend built with **Spring Boot (Java 17)** and **Hibernate ORM**, and a modern, responsive frontend developed using **React** and **Material UI**. The system supports role-based access for users and administrators, ensuring data integrity and security through JWT authentication.

---

## Features

- User and Admin authentication (JWT-based)
- Role-based access control
- Vehicle registration and management
- Spare part registration and management
- Order placement and management
- Profile management for users and admins
- Search and listing for vehicles, spare parts, and orders
- Responsive, modern UI with Material UI
- Data validation and error handling

---

## Technology Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Spring Boot, Spring Security (JWT), Hibernate ORM (JPA), SQLite, Lombok, Maven |
| Frontend   | React, Material UI, Axios, React Router DOM     |
| Build Tool | Maven (backend), npm/yarn (frontend)            |

---

## System Architecture

- **Frontend:**  
  React SPA with Material UI, Axios for API calls, React Router for navigation.
- **Backend:**  
  Spring Boot REST API, Spring Security for authentication/authorization, Hibernate ORM for persistence, SQLite database.
- **Authentication:**  
  JWT tokens issued on login, required for all protected endpoints.
- **Role Management:**  
  Users and Admins have different access levels and UI experiences.

---

## REST API Endpoints (Sample)

| Endpoint                                   | Method | Description                           |
|---------------------------------------------|--------|---------------------------------------|
| `/api/auth/login`                          | POST   | User/Admin login                      |
| `/api/auth/signup`                         | POST   | User registration                     |
| `/api/user/registerVehicle`                | POST   | Register a new vehicle                |
| `/api/user/registerSparePart`              | POST   | Register a new spare part             |
| `/api/user/GetUserProfile`                 | GET    | Get current user's profile            |
| `/api/admin/getAllOwners`                  | GET    | Get all users (admin)                 |
| `/api/admin/SpareParts`                    | GET    | Get all spare parts (admin)           |
| `/api/orders/user`                         | GET    | Get all orders for the current user   |
| ...                                        | ...    | ...                                   |

---

## Setup Instructions

### Backend

1. **Clone the repository:**
   ```sh
   git clone https://github.com/<your-username>/Vehicle-Registration-System.git
   cd Vehicle-Registration-System/Vehicle_Registration_System
   ```

2. **Configure the database:**  
   The project uses SQLite by default (see `src/main/resources/application.properties`).

3. **Build and run the backend:**
   ```sh
   ./mvnw spring-boot:run
   ```
   or on Windows:
   ```sh
   mvnw.cmd spring-boot:run
   ```

### Frontend

1. **Navigate to the frontend directory:**
   ```sh
   cd ../Vehicle_Registration_System_Frontend/vehicleapp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the frontend:**
   ```sh
   npm start
   ```

---


## Future Enhancements

- PDF/CSV report generation
- Enhanced admin dashboard with analytics
- Payment gateway integration
- Notification system (email/SMS)
- Mobile app frontend (Flutter/React Native)
- Multi-language support
- Cloud deployment and scalability improvements

---

## License

This project is for educational purposes (KPIT Nova Training).

---

## Contributors

- [Pratik Lad](https://github.com/pratiklad16)
