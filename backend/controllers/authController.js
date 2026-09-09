const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "sharebite_super_secret_jwt_key_2026";

const register = async (req, res) => {
    try {
        const { name, email, password, collegeId, hostel } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            collegeId: collegeId ? collegeId.trim() : "Campus Student",
            hostel: hostel ? hostel.trim() : "Campus Residence"
        });

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                collegeId: user.collegeId,
                hostel: user.hostel
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            message: error.message || "Server error during registration"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        let isPasswordCorrect = false;
        try {
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        } catch (bcryptErr) {
            console.warn("Bcrypt comparison warning:", bcryptErr.message);
            // Graceful fallback if password was saved in plain text
            isPasswordCorrect = (password === user.password);
        }

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                collegeId: user.collegeId,
                hostel: user.hostel
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: error.message || "Server error during login"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            collegeId: user.collegeId,
            hostel: user.hostel
        });
    } catch (error) {
        console.error("GetMe error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    login,
    getMe
};