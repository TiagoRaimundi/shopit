import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error"
    };

    //Handle Invalid Mongoose Object ID Error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ErrorHandler(message, 404);
    }

    //Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(value => value.message);
        error = new ErrorHandler(messages.join('. '), 400);
    }

    //Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue);
        const message = `Duplicate ${field} entered.`;
        error = new ErrorHandler(message, 400); // Mudado de 404 para 400
    }

       //Handle wrong JWT Error
       if (err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid. Try Again!!!`;
        error = new ErrorHandler(message, 400); // Mudado de 404 para 400
    }

         //Handle expired JWT Error
         if (err.name === "TokenExpiredError") {
            const message = `JSON Web Token is expired. Try Again!!!`;
            error = new ErrorHandler(message, 400); // Mudado de 404 para 400
        }


    // Send response based on environment
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error(err); // Log detailed error in development
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV === "PRODUCTION") {
        let response = { message: error.message };
        if (error.statusCode === 500) { // Log internal server errors
            console.error(err);
        }
        res.status(error.statusCode).json(response);
    } else {
        // In case of an unexpected NODE_ENV, default to the development error handler
        console.error(err);
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err.stack
        });
    }
};
