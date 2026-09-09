const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const authController = require("./controllers/authController");

const app = express();

// CORS configuration
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);

// Alias /api/users/me for AuthContext compatibility
app.get("/api/users/me", authMiddleware, authController.getMe);

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "ShareBite API is running healthy!",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "ShareBite backend is running!",
        docs: {
            auth: "/api/auth",
            food: "/api/food",
            health: "/api/health"
        }
    });
});

// Global 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`ShareBite backend running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to DB, starting server anyway...", err.message);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`ShareBite backend running on port ${PORT} (no DB connection)`);
    });
});