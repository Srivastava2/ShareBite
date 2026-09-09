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

## Quickstart for Teammates 🚀

### 1. Clone & Install
```bash
git clone https://github.com/Srivastava2/ShareBite.git
cd ShareBite
npm install
```
*(Running `npm install` in the root automatically installs both frontend and backend dependencies).*

### 2. Configure Environment (`.env`)
Create a `.env` file in the root or copy from `.env.example`:
```bash
cp .env.example .env
```
Inside `.env` (and `backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sharebite
JWT_SECRET=sharebite_super_secret_jwt_key_2026
```
> **Note for teammates without local MongoDB**: If a teammate doesn't have MongoDB installed locally, they can sign up for a free cloud cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and set `MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sharebite?retryWrites=true&w=majority`.

### 3. Start the Project (Backend + Frontend)
```bash
npm run dev
```
This single command runs **both**:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:5173`

Open `http://localhost:5173` in your browser!

---

## Troubleshooting Common Teammate Issues

1. **`MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`**
   - **Reason**: MongoDB is not installed or not running on their system.
   - **Fix**: Either start the local MongoDB service (`mongod` / `net start MongoDB` on Windows, or `brew services start mongodb-community` on Mac), OR use a free MongoDB Atlas cloud connection URI in `.env`.

2. **`Cannot find module 'express'` or `'cors'`**
   - **Reason**: Backend dependencies were not installed.
   - **Fix**: Run `npm install` in root (which triggers postinstall) or `cd backend && npm install`.

3. **Missing `.env` file**
   - **Reason**: Git ignores `.env` files for security.
   - **Fix**: Copy `.env.example` to `.env` in both root and `backend/`.

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
