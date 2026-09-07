const mongoose = require("mongoose");
const foodListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    foodType: {
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    pickupLocation:{
        type:String, 
        required: true 
    },
    bestBefore:{
        type: Date, 
        required: true
    },
    status: {
    type: String,
    enum: ["AVAILABLE", "CLAIMED", "EXPIRED"],
    default: "AVAILABLE"
},
postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
}}, {
    timestamps: true
}
); 
module.exports = mongoose.model("FoodListing", foodListingSchema);