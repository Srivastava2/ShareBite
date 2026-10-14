const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const FoodListing = require("../models/FoodListing");

// GET /api/messages/:foodId - Fetch all messages for a specific food item
router.get("/:foodId", authMiddleware, async (req, res) => {
    try {
        const { foodId } = req.params;
        const currentUserId = req.user.userId;

        const food = await FoodListing.findById(foodId)
            .populate("postedBy", "name collegeId hostel")
            .populate("claimedBy", "name collegeId hostel");

        if (!food) {
            return res.status(404).json({ message: "Food listing not found" });
        }

        const messages = await Message.find({ food: foodId })
            .populate("sender", "name collegeId hostel")
            .populate("recipient", "name collegeId hostel")
            .sort({ createdAt: 1 });

        res.json({
            food,
            messages
        });
    } catch (err) {
        console.error("Fetch messages error:", err);
        res.status(500).json({ message: "Failed to load messages", error: err.message });
    }
});

// POST /api/messages/:foodId - Send a new message
router.post("/:foodId", authMiddleware, async (req, res) => {
    try {
        const { foodId } = req.params;
        const { text } = req.body;
        const currentUserId = req.user.userId;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Message text cannot be empty" });
        }

        const food = await FoodListing.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food listing not found" });
        }

        const posterId = food.postedBy.toString();
        const claimantId = food.claimedBy ? food.claimedBy.toString() : null;

        // Determine recipient: if current user is poster, recipient is claimant; else recipient is poster
        let recipientId;
        if (currentUserId === posterId) {
            if (!claimantId) {
                return res.status(400).json({ message: "Cannot message: Food listing has no claimant yet" });
            }
            recipientId = claimantId;
        } else {
            recipientId = posterId;
        }

        const newMessage = await Message.create({
            food: foodId,
            sender: currentUserId,
            recipient: recipientId,
            text: text.trim()
        });

        const populated = await Message.findById(newMessage._id)
            .populate("sender", "name collegeId hostel")
            .populate("recipient", "name collegeId hostel");

        res.status(201).json({
            message: "Message sent successfully",
            chatMessage: populated
        });
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ message: "Failed to send message", error: err.message });
    }
});

module.exports = router;
