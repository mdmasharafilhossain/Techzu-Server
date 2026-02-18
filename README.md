# Techzu Real-Time Sneaker Drop Backend API

A scalable, modular, and concurrency-safe backend for a **Real-Time High-Traffic Inventory System (Limited Edition Sneaker Drop)**.

Built using **Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, and Socket.io**, this API ensures atomic reservations, prevents overselling under heavy concurrency, and provides real-time stock synchronization across all connected clients.

This system simulates high-demand product launches where users compete for limited inventory.

---

# Features

## Real-Time Inventory System

- Live stock updates using WebSockets (Socket.io)
- Instant synchronization across multiple browser sessions
- Event-based architecture for reservation, expiration, and purchase updates

## Atomic Reservation System

- 60-second temporary reservation window
- Database transaction with row-level locking
- Guaranteed prevention of overselling
- Concurrent-safe stock decrement logic

## Stock Recovery Mechanism

- Automatic expiration of reservations
- Background worker restores stock if reservation expires
- Real-time notifications sent to all clients

## Purchase Flow

- Purchase allowed only for valid active reservations
- Reservation ownership verification
- Expiration validation before purchase
- Permanent stock deduction after purchase

## Merch Drop Management

- API to create new product drops
- Automatic stock initialization
- Timestamp handling for drop start time
- Validation using Zod

## Activity Feed

- Displays top 3 recent purchasers per drop
- Optimized database queries with relations
- Nested response for frontend consumption

## Code Quality & Architecture

- Modular service-based architecture
- Type-safe controllers and services
- Global error handling
- Clean folder structure
- Background job processing
- ESLint & Prettier support

---

# Tech Stack

| Category     | Technology  |
| ------------ | ----------- |
| Runtime      | Node.js     |
| Language     | TypeScript  |
| Framework    | Express.js  |
| Database     | PostgreSQL  |
| ORM          | Prisma      |
| Real-Time    | Socket.io   |
| Validation   | Zod         |
| Scheduling   | Node Timers |
| Date Library | Dayjs       |

---

# Related Links

Frontend Repository:  
https://github.com/mdmasharafilhossain/Techzu-Client

Backend Repository:  
https://github.com/mdmasharafilhossain/Techzu-Server

Live Application (Backend):  
https://techzu-server.onrender.com

Live Application (Frontend):  
https://techzu-client.vercel.app

---

# API Endpoints

## Drops

| Endpoint     | Method | Description         |
| ------------ | ------ | ------------------- |
| `/api/drops` | POST   | Create merch drop   |
| `/api/drops` | GET    | Get all active drop |

---

## Reservations

| Endpoint            | Method | Description     |
| ------------------- | ------ | --------------- |
| `/api/reservations` | POST   | Reserve an item |

---

## Purchases

| Endpoint         | Method | Description       |
| ---------------- | ------ | ----------------- |
| `/api/purchases` | POST   | Complete purchase |

---

# Setup Instructions

## Prerequisites

Before running the project, ensure you have:

- Node.js v18+
- PostgreSQL Database
- npm or yarn
- Prisma CLI

---

## 1️⃣ Clone & Install
```bash
git clone https://github.com/mdmasharafilhossain/Techzu-Server
cd Techzu-Server
npm install
````
## 2️⃣ Setup Environment Variables
Create a .env file 
```bash
DATABASE_URL="postgresql://database_user:database_password@localhost:5432/database_name?schema=public"
PORT=5000
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=your_production_url 
````
## 3️⃣ Prisma Setup
```bash
# Generate Prisma client:
npx prisma generate
# Run migrations:
npx prisma migrate dev
````
## 4️⃣ Seed Sample Users
```bash
npm run seed
````
## 5️⃣ Start Development Server
```bash
npm run dev
````
---

# Architecture Choice: How did you handle the 60-second expiration logic?
When a user makes a reservation for a product, the system stores the reservation expiration time.
```bash
expiresAt = current time + 60 seconds
```
In backround function runs after 5 seconds to find expired reservations.If expired, then mark them as expired and also retrieve stock automatically. Emit websockets events to notify clientsWhen a user makes a reservation for a product, the system stores the reservation expiration time.

---
# Concurrency: How did you prevent multiple users from claiming the same last item?

When multiple users try to reserve at the same time, that’s a big problem. That’s why I used PostgreSQL’s row-level locking (FOR UPDATE) inside a database transaction to prevent overselling in the reservation system. First, I lock the row of the drop I want to reserve from the database, so that no other request can change the same row at the same time. To do this locking, I used a SELECT ... FOR UPDATE query. For example:

```bash
$queryRawUnsafe(
            `SELECT * FROM "Drop" WHERE id = $1 FOR UPDATE`,
            dropId
        );
```
Here, using FOR UPDATE, the database locks that particular row until the transaction ends. Then I check the available stock from that locked row. If the stock is more than 0, then I reduce the stock by 1 and create a reservation.

```bash 
  await transaction.drop.update({
            where: { id: dropId },
            data: { availableStock: { decrement: 1 } }
        });
```
Since this entire process is inside a transaction, it works as an atomic operation  that is, all steps must succeed, otherwise nothing will happen.
