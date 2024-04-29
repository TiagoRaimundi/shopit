import express from "express"
import { isAuthenticatedUser } from "../middleware/auth.js";
import { newOrder } from "../controllers/orderControllers.js";
const router = express.Router();

router.route('/orders/new').post(isAuthenticatedUser, newOrder)

export default router