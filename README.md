# ShareBite 🌿🍲

**ShareBite** is a real-time campus food-rescue platform designed to connect students and campus organizations with leftover meals to eliminate food waste.

---

## Features

- **Noticeboard Feed**: Browse active surplus meals with Veg/Non-Veg badges, real-time expiration countdown, and pickup locations.
- **Search & Filters**: Instantly filter by dietary preference (Veg / Non-Veg) or search by food title, hostel, and pickup spot.
- **Surplus Food Sharing**: Simple, responsive form to post surplus meals with expiration presets (1h, 2h, 4h, custom).
- **One-Click Meal Claiming**: Fast, atomic claiming preventing food hoarding or expired picks.
- **Personal Dashboard**: Track your shared meals, claimed meals, and environmental impact (food waste avoided).
- **Authentication**: JWT authentication with campus profiles (Student ID, Residence Hall).

---

## Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS**
- **React Router DOM 7**
- **Axios** (with Bearer token interceptor)
- **Lucide React** (icons)
- **React Hot Toast** (notifications)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JSON Web Tokens (JWT)** & **bcryptjs**
- **CORS** & **Dotenv**

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd backend
npm install
```

Ensure `backend/.env` is configured (a preconfigured `.env` is already provided):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sharebite
JWT_SECRET=sharebite_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
# In backend directory
npm run dev
# or
node server.js
```

The server runs at `http://localhost:5000`.

### 2. Frontend Setup

In the root project directory:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with student ID & hostel | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Yes |
| `GET` | `/api/food` | List available meals (supports `?search=` and `?type=`) | No |
| `POST` | `/api/food` | Share a surplus meal | Yes |
| `PATCH` | `/api/food/:id/claim` | Claim an available meal | Yes |
| `GET` | `/api/food/my-activity` | Get user's posted and claimed meals | Yes |
| `DELETE` | `/api/food/:id` | Cancel/delete user's own listing | Yes |
