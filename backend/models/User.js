const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    collegeId: {
        type: String,
        default: "Campus Student"
    },
    hostel: {
        type: String,
        default: "Main Campus"
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("User", userSchema);