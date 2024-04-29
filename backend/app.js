import express from 'express'
const app = express();
import dotenv from 'dotenv'
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from "./middleware/error.js"
import cookieParser from 'cookie-parser';

//Handle Uncaugth exceptions 
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shuting down due to uncaught exception')
    process.exit(1);
});

dotenv.config({path: 'backend/config/config.env'});

//Connecting to database

connectDatabase();

app.use(express.json());
app.use(cookieParser())

//Import all routes
import productRoutes from "./routes/products.js"
import authRoutes from "./routes/auth.js"
import orderRouter from "./routes/order.js"

app.use("/api/v1", productRoutes)
app.use("/api/v1", authRoutes)
app.use("/api/v1", orderRouter)

//Using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

//Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR ${err}`);
    console.log('Shuttig down server due to Unhandle Promise Rejection')
    server.close(() => {
        process.exit(1);
    }) 
})
