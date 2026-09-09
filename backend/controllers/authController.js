const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password, collegeId, hostel } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            collegeId: collegeId || "Campus Student",
            hostel: hostel || "Campus Residence"
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
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
            message: "Server error during registration"
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

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
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
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "Server error during login"
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