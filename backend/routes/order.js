import express from "express"
import { isAuthenticatedUser } from "../middleware/auth.js";
import { getOrderDetails, myOrders, newOrder } from "../controllers/orderControllers.js";
const router = express.Router();

router.route('/orders/new').post(isAuthenticatedUser, newOrder)
router.route('/orders/:id').get(isAuthenticatedUser, getOrderDetails)
router.route('/me/orders').get(isAuthenticatedUser, myOrders)


export default router