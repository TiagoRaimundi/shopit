import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
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

//Encrypting password before saving the user
userSchema.pre('save', async function (next) {
    if(!this.isModified("password")){
        next();
    }

    this.password = await  bcrypt.hash(this.password, 10)
})


//return JWT Token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_TIME,
    });
}


export default mongoose.model("User", userSchema);