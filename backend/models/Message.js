const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodListing",
            required: true,
            index: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Message", messageSchema);
