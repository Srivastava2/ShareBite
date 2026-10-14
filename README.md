# ShareBite 🌿🍲

**ShareBite** is a campus-first surplus food rescue network designed to connect student dormitories, dining halls, and campus clubs with hungry students in real-time. By bridging the gap between edible surplus food and campus residents, ShareBite helps eliminate food waste and supports zero-hunger initiatives on university campuses.

---

## 🌟 Key Features

### 1. Pre-Login Experience (Original Campus Portal)
* **Campus Landing Page**: Highlights food waste reduction metrics, student testimonials, and community impact.
* **Student Registration (`/register`)**: Captures Name, Student Email, Password, College/Student ID, and Hostel Residence.
* **Stateless Authentication (`/login`)**: Bcrypt password hashing and signed JWT authentication with auto session restoration on refresh.

### 2. Post-Login Modern AppShell & Responsive Design
* **Adaptive AppShell**:
  * **Desktop**: Persistent left sidebar with fast navigation across *Campus Feed*, *Event Surplus*, *Pickup Chat*, *Leaderboard*, and *My Dashboard*.
  * **Mobile Phones (360px – 640px)**: Bottom Navigation Bar for easy 1-thumb switching (`Feed` ➔ `Events` ➔ `+ Post` ➔ `Chat` ➔ `Impact`), plus an expandable search bar and touch slideout menu.
  * **Top Navigation Bar**: Global real-time search (`Ctrl+K`), campus location landmark indicator (*📍 North Campus Quad*), live notification alerts, and an instant **Profile & Logout Dropdown Menu**.

### 3. Campus Food Noticeboard (`/feed`)
* **Visual Food Photography Cards**: Heuristic food photography mapping (pizza, biryani, samosas, burgers, curries, fruits, pastries) with diet badges (🌱 Vegetarian / 🍗 Non-Veg).
* **Campus Landmark Pickups**: Clear building/room tags (*e.g., "CS Block Room 204"*, *"Hall C Lounge"*).
* **Live Expiration Countdown**: Urgent ticking countdown badges (*"2h 15m left"*).
* **One-Click Claiming**: Prevents double-claiming and self-claims with real-time feedback.
* **Hero of the Week & Leaderboard**: Celebrates top campus food donors and department ranks.

### 4. Listing Deep-Dive Inspection Modal
* Click any food card to open an interactive modal with:
  * Full-resolution photography and quantity badges.
  * **Animated Shelf-Life Progress Bar**: Dynamic percentage and countdown with visual color shifts (Emerald ➔ Amber ➔ Red).
  * **Donor Trust Score**: Verified Student ID and rating badge (⭐ 4.9).
  * **Detailed Room Instructions**: Floor, door, and desk pickup guidance.
  * **Safety & Allergen Checklist**: Packing hygiene and BYO-container guidelines.
  * One-click "Claim Meal Now" button.

### 5. Real-Time Pickup Coordination & Live Chat Hub
* Backed by a dedicated **MongoDB Atlas collection** and REST endpoints (`/api/messages`).
* **4-Step Transfer Stepper**:
  1. `1. Claimed` (Matched)
  2. `2. On My Way` (Walking)
  3. `3. At Landmark` (Outside room/desk)
  4. `4. Completed` (Food picked up & verified 🎉)
* **Live Chat Polling**: Real-time sync every 3.5 seconds so donors and claimants on different computers can chat live.
* **One-Tap Quick Chips**: Pre-set campus messages (*"I'm on my way, 5 mins! 🚶"*, *"Outside the room now 🚪"*, *"Picked it up, thank you! 🍱"*) + full text input.
* Accessible directly from **My Dashboard** on all active claims.

### 6. Environmental Impact Dashboard (`/dashboard`)
* **Student Profile Hero Card**: Displays user avatar, verified ID, and hostel hall.
* **SVG Wave Analytics**:
  * 🍱 **Total Meals Saved**: Personal cumulative meals shared & claimed.
  * 🌿 **CO₂ Prevented (kg)**: Environmental carbon footprint diversion estimate.
  * 🤝 **Campus Donations Created**: Count of community posts shared.
* **Activity Management**: Dual views for active claimed meals (with instant pickup chat) and your active food posts.

### 7. Event & Catering Surplus Mode (`/events`)
* Tailored for club workshops, hackathon buffets, seminars, and dining hall bulk surplus (>10 portions).

### 8. Food Sharing Form (`/post-food`)
* Quick 30-second form with Veg/Non-Veg pills, quantity, landmark room, expiry presets (1h, 2h, 4h, custom), and notes.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4** (Custom Emerald & Slate Design System)
- **React Router DOM 7** (Protected Routes & Navigation)
- **Axios** (Bearer Token Interceptor)
- **Lucide React** (Modern Icons)
- **React Hot Toast** (Toast Notifications)

### Backend & Database
- **Node.js** & **Express**
- **MongoDB Atlas** (Cloud Shared Database) + **Mongoose**
- **JSON Web Tokens (JWT)** & **bcryptjs**
- **Concurrently** (Runs full-stack with a single command)

---

## 📁 Repository Structure

```text
sharebite-frontend/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Me
│   │   └── foodController.js      # CRUD & Claiming endpoints
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── models/
│   │   ├── User.js                # Student user model
│   │   ├── FoodListing.js         # Food listing model
│   │   └── Message.js             # Real-time chat message model
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── foodRoutes.js          # /api/food routes
│   │   └── messageRoutes.js       # /api/messages chat routes
│   ├── .env.example               # Backend environment template
│   └── server.js                  # Express backend entry point
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── ProtectedRoute.jsx # Route authentication guard
│   │   ├── coordination/
│   │   │   └── PickupCoordinationModal.jsx  # Live chat & stepper modal
│   │   ├── feed/
│   │   │   ├── FoodCard.jsx       # Meal photography card
│   │   │   ├── FoodDetailModal.jsx# Deep-dive inspection modal
│   │   │   └── Leaderboard.jsx    # Hero donor & leaderboard widget
│   │   └── layout/
│   │       ├── AppShell.jsx       # Modern authenticated dashboard layout
│   │       └── Navbar.jsx         # Public navigation header
│   ├── context/
│   │   └── AuthContext.jsx        # Global user authentication state
│   ├── pages/
│   │   ├── LandingPage.jsx        # Public landing page
│   │   ├── Login.jsx              # Student sign-in
│   │   ├── Register.jsx           # Student registration
│   │   ├── Home.jsx               # Campus food feed noticeboard
│   │   ├── Dashboard.jsx          # Impact stats & activity hub
│   │   ├── EventListings.jsx      # Catering & event surplus mode
│   │   └── PostFood.jsx           # Post food listing form
│   ├── services/
│   │   └── api.js                 # Axios API service client
│   ├── utils/
│   │   └── foodAssets.js          # Image heuristics & leaderboard data
│   ├── App.jsx                    # Routing & global toaster
│   ├── main.jsx                   # React application mount
│   └── index.css                  # Tailwind CSS root imports
├── .env.example                   # Root environment template
├── .gitignore                     # Security & secrets ignore rules
└── package.json                   # Root package & scripts
```

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Srivastava2/ShareBite.git
cd ShareBite
```

### 2. Install Dependencies
```bash
npm install
```
*(The root `postinstall` script automatically installs backend dependencies as well).*

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the root (and in `backend/.env`):
```bash
cp .env.example .env
cp .env.example backend/.env
```

Ensure your `.env` contains your MongoDB Atlas URI and JWT Secret:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.f2iuhqi.mongodb.net/sharebite?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=sharebite_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### 4. Run Both Backend & Frontend with One Command
```bash
npm run dev
```

* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`
* **Health Check**: `http://localhost:5000/api/health`

---

## 🔒 Security & Environment Practices

* **`.gitignore` Rules**: Real `.env` files, certificates, private keys, and build artifacts are strictly ignored and never committed to version control.
* **Password Hashing**: User passwords are encrypted with `bcryptjs` salt hashing prior to storage.
* **Token Protection**: JWT tokens validate request origins and protect all sensitive mutation routes.
* **Self-Claim Protection**: The backend atomically prevents food creators from claiming their own listings or claiming already-claimed items.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student with ID & Hostel | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/users/me` | Restore user session on browser reload | Yes |
| `GET` | `/api/food` | List available meals (`?search=`, `?type=`) | No |
| `POST` | `/api/food` | Share a new surplus meal | Yes |
| `PATCH` | `/api/food/:id/claim` | Atomically claim an active meal | Yes |
| `GET` | `/api/food/my-activity` | Fetch user's shared and claimed meals | Yes |
| `DELETE` | `/api/food/:id` | Cancel/remove user's uncollected post | Yes |
| `GET` | `/api/messages/:foodId` | Retrieve real chat history for a meal | Yes |
| `POST` | `/api/messages/:foodId` | Send live message between donor & claimant | Yes |
| `GET` | `/api/health` | Backend status & health verification | No |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/campus-improvement`
2. Commit your changes: `git commit -m "feat: add feature"`
3. Push to branch: `git push origin feature/campus-improvement`
4. Open a Pull Request!
