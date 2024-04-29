
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

//checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler('No user found with this id', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler('Not authorized to access this resource', 401));
    }
});

//AUthorize user roles

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Roles (${req.user.role}) is not allowed to access this resource`, 403))
        }

        next()
    }
}