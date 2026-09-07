const FoodListing = require("../models/FoodListing");

const createFood = async (req, res) => {
    try {
        const {
            title,
            foodType,
            quantity,
            pickupLocation,
            bestBefore
        } = req.body;

        const food = await FoodListing.create({
            title,
            foodType,
            quantity,
            pickupLocation,
            bestBefore,
            postedBy: req.user.userId
        });

        res.status(201).json({
            message: "Food listing created successfully",
            food
        });

    } catch (error) {
        console.error("Create food error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
};
const getFoodListings = async (req, res) => {
    try {
        const foodListings = await FoodListing.find({
            status: "AVAILABLE",
            bestBefore: { $gt: new Date() }
        }).sort({ createdAt: -1 }).populate("postedBy", "name");

        res.status(200).json({
            foodListings
        });

    } catch (error) {
        console.error("Get food error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyActivity = async (req, res) => {
    try {
        const postedListings = await FoodListing.find({
            postedBy: req.user.userId
        });

        const claimedListings = await FoodListing.find({
            claimedBy: req.user.userId
        });

        res.status(200).json({
            postedListings,
            claimedListings
        });

    } catch (error) {
        console.error("My activity error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
const claimFood = async (req, res) => {
    try {
        const foodId = req.params.id;

        const food = await FoodListing.findById(foodId);

        if (!food) {
            return res.status(404).json({
                message: "Food listing not found"
            });
        }

        if (food.postedBy.toString() === req.user.userId) {
            return res.status(400).json({
                message: "You cannot claim your own food"
            });
        }

        const claimedFood = await FoodListing.findOneAndUpdate(
            {
                _id: foodId,
                status: "AVAILABLE",
                bestBefore: { $gt: new Date() }
            },
            {
                status: "CLAIMED",
                claimedBy: req.user.userId
            },
            {
                new: true
            }
        );

        if (!claimedFood) {
            return res.status(409).json({
                message: "Food is already claimed or expired"
            });
        }

        return res.status(200).json({
            message: "Food claimed successfully",
            food: claimedFood
        });

    } catch (error) {
        console.error("Claim food error:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid food ID"
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    createFood,
    getFoodListings,
    getMyActivity,
    claimFood
};