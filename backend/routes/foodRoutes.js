const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, foodController.createFood);
router.get("/", foodController.getFoodListings);
router.get("/my-activity", authMiddleware, foodController.getMyActivity);
router.patch("/:id/claim", authMiddleware, foodController.claimFood);
router.delete("/:id", authMiddleware, foodController.deleteFood);

module.exports = router;