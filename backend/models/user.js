import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please your name'],
        maxLength: [50, 'Your name cannot exceed 50 characters'],
    },
    name: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "User",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {timestamps: true}

)

export default mongoose.model("User", userSchema);