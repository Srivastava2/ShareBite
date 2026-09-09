const FoodListing = require("../models/FoodListing");

const createFood = async (req, res) => {
    try {
        const {
            title,
            foodType,
            quantity,
            pickupLocation,
            bestBefore,
            description
        } = req.body;

        if (!title || !foodType || !quantity || !pickupLocation || !bestBefore) {
            return res.status(400).json({
                message: "Title, food type, quantity, pickup location, and best before date are required"
            });
        }

        const bestBeforeDate = new Date(bestBefore);
        if (isNaN(bestBeforeDate.getTime()) || bestBeforeDate <= new Date()) {
            return res.status(400).json({
                message: "Best before time must be a valid future date/time"
            });
        }

        const food = await FoodListing.create({
            title: title.trim(),
            foodType,
            quantity: String(quantity).trim(),
            pickupLocation: pickupLocation.trim(),
            bestBefore: bestBeforeDate,
            description: description ? description.trim() : "",
            postedBy: req.user.userId
        });

        const populatedFood = await FoodListing.findById(food._id)
            .populate("postedBy", "name collegeId hostel");

        res.status(201).json({
            message: "Food listing created successfully",
            food: populatedFood
        });

    } catch (error) {
        console.error("Create food error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Server error creating food listing"
        });
    }
};

const getFoodListings = async (req, res) => {
    try {
        const { search, type } = req.query;

        // Auto-update expired items
        await FoodListing.updateMany(
            {
                status: "AVAILABLE",
                bestBefore: { $lte: new Date() }
            },
            {
                status: "EXPIRED"
            }
        );

        const filter = {
            status: "AVAILABLE",
            bestBefore: { $gt: new Date() }
        };

        if (type && type !== "All") {
            filter.foodType = type;
        }

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { title: searchRegex },
                { pickupLocation: searchRegex },
                { description: searchRegex }
            ];
        }

        const foodListings = await FoodListing.find(filter)
            .sort({ createdAt: -1 })
            .populate("postedBy", "name collegeId hostel");

        res.status(200).json({
            foodListings
        });

    } catch (error) {
        console.error("Get food error:", error.message);
        res.status(500).json({
            message: "Server error retrieving food listings"
        });
    }
};

const getMyActivity = async (req, res) => {
    try {
        const userId = req.user.userId;

        const postedListings = await FoodListing.find({
            postedBy: userId
        })
            .sort({ createdAt: -1 })
            .populate("claimedBy", "name email collegeId hostel");

        const claimedListings = await FoodListing.find({
            claimedBy: userId
        })
            .sort({ updatedAt: -1 })
            .populate("postedBy", "name email collegeId hostel");

        res.status(200).json({
            postedListings,
            claimedListings
        });

    } catch (error) {
        console.error("My activity error:", error.message);
        res.status(500).json({
            message: "Server error retrieving user activity"
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
                message: "You cannot claim your own food post"
            });
        }

        if (food.status !== "AVAILABLE" || new Date(food.bestBefore) <= new Date()) {
            return res.status(409).json({
                message: "Food is no longer available or has expired"
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
        ).populate("postedBy", "name email collegeId hostel");

        if (!claimedFood) {
            return res.status(409).json({
                message: "Food is already claimed or expired"
            });
        }

        return res.status(200).json({
            message: "Food claimed successfully! Head over to pick it up.",
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
            message: "Server error claiming food"
        });
    }
};

const deleteFood = async (req, res) => {
    try {
        const foodId = req.params.id;
        const food = await FoodListing.findById(foodId);

        if (!food) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (food.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to delete this listing" });
        }

        await FoodListing.findByIdAndDelete(foodId);

        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.error("Delete food error:", error.message);
        res.status(500).json({ message: "Server error deleting listing" });
    }
};

module.exports = {
    createFood,
    getFoodListings,
    getMyActivity,
    claimFood,
    deleteFood
};