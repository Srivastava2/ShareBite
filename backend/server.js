const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const app = express();
 
// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/food",foodRoutes)

// Test route
const authMiddleware = require("./middleware/authMiddleware");

app.get("/test-protected", authMiddleware, (req, res) => {
    res.json({
        message: "You reached a protected route",
        user: req.user
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "ShareBite backend is running!"
    });
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});