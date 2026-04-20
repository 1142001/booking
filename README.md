# Room / PG Booking (MERN)

This is a full-stack **MERN** internship-ready project for room/PG booking with a user side and an admin panel.

## Features

- User registration/login with JWT auth
- Browse room/PG listings with filters
- Create bookings and track your booking status
- Admin dashboard:
  - Add new properties
  - View all bookings
  - Update booking status (confirmed/cancelled/completed)
  - See basic property stats

## Tech Stack

- **Frontend:** React + Vite + React Router + Axios
- **Backend:** Node.js + Express + MongoDB + Mongoose + JWT

## Project Structure

```bash
booking/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   └── ...
└── docker-compose.yml
```

## Setup Instructions

### 0) Start MongoDB (Required)

Choose one option:

#### Option A: Docker (recommended)

```bash
docker compose up -d mongo
```

#### Option B: Local MongoDB service

Start your local MongoDB service so it listens on `127.0.0.1:27017`.

#### Option C: MongoDB Atlas

Use Atlas connection string in `backend/.env`.

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed   # optional: insert demo properties
npm run dev
```

Backend runs at: `http://localhost:5000`

### 2) Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

If backend runs on different URL, set:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## Common Error Fix

If you see:

```txt
DB connection failed: connect ECONNREFUSED 127.0.0.1:27017
```

it means MongoDB is not running at that address. Run `docker compose up -d mongo` (from project root) or update `MONGODB_URI` in `backend/.env` to a valid MongoDB server.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/properties`
- `POST /api/properties` (admin)
- `POST /api/bookings` (user)
- `GET /api/bookings/mine` (user)
- `GET /api/bookings/admin/all` (admin)
- `PATCH /api/bookings/admin/:id/status` (admin)

---

Great for internship submission and further improvements like payments, reviews, maps, and image uploads.
