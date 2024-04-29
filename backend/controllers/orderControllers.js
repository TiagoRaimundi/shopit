import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";



//creating new order => /api/v1/orders/new

export const newOrder = catchAsyncErrors(async(req, res, next) => {
    const {
        orderItems, 
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;


    const order = await Order.create({
        orderItems, 
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    })

    res.status(200).json({
        order,
    })
})