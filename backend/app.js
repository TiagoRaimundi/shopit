import express from 'express'
const app = express();
import dotenv from 'dotenv'
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from "./middleware/error.js"

dotenv.config({path: 'backend/config/config.env'});

//Connecting to database

connectDatabase();

app.use(express.json());
//Import all routes
import productRoutes from "./routes/products.js"

app.use("/api/v1", productRoutes)


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
