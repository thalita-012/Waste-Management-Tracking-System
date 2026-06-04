# Waste Management Tracking System

**A Real-Time Garbage Truck Tracking & Payment Management Platform**

---

## Project Information

**Group A8**  
**Course/Project**: Waste Management Tracking System

### Team Members
- SOK Thalita
- KHON Ream
- HO Rina
- SOENG Vicheka

---

## Project Overview

The **Waste Management Tracking System** is a web-based application designed to help residents track garbage collection trucks in real-time. It provides live location tracking, estimated arrival times, and digital payment management for monthly waste collection fees.

This system addresses the common challenge faced by residents in narrow or small streets, where garbage trucks are difficult to see or hear, often resulting in missed collections and accumulating waste.

### Problem Statement
- Unpredictable garbage truck arrival times
- Difficulty for residents on narrow streets to detect approaching trucks
- Missed collections leading to neighborhood waste accumulation
- Inefficient manual paper-based payment collection

### Objectives
- Enable real-time GPS tracking of garbage trucks on an interactive map
- Send timely notifications when trucks are approaching
- Provide a seamless and stress-free waste collection experience
- Facilitate secure online monthly bill payments

---

## System Users

- **Residents (Customers)**: Track trucks, receive alerts, and manage payments
- **Truck Drivers**: Update truck status and share live location
- **System Administrators (Managers)**: Manage users, trucks, schedules, and financial reports

---

## 🛠️ Backend Technologies

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2C2E3A?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-000000?style=for-the-badge&logo=lock&logoColor=white)

---

## Key Features

### User Management
- Secure user registration and authentication
- Profile management (Full Name, Phone Number, Address, Email, GPS Location)

### Real-Time Truck Tracking
- Live map visualization of all active garbage trucks
- Truck status indicators (`Available` / `Collecting Waste`)
- Estimated Time of Arrival (ETA) calculation
- Powered by **Socket.io** for real-time updates

### Alerts & Notifications
- Automatic notifications when truck is nearby
- Scheduled reminder messages

### Online Payment System
- Monthly subscription billing
- Payment history and digital receipts
- Status tracking (`Paid`, `Pending`, `Overdue`)
- Integration with ABA Pay, ACLEDA Bank, and mobile banking

---

## Backend Architecture

### Project Structure
```bash
waste-management-system/
├── src/
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handling
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── models/             # Data models & schemas
│   ├── routes/             # API route definitions
│   ├── middleware/         # Authentication & error handling
│   ├── sockets/            # WebSocket real-time tracking
│   ├── utils/              # Helper utilities (JWT, etc.)
│   └── app.js
├── prisma/
│   └── schema.prisma
├── server.js
├── .env
└── package.json