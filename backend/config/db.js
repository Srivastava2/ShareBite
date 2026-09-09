const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sharebite";
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.warn("Tip: Check your MONGO_URI in .env or ensure MongoDB is running.");
    }
};

module.exports = connectDB;