import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";



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
});

//get current user orders=> /api/v1/me/orders
export const myOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        orders,
        
    })
})

//get order details => /api/v1/orders/:id 
export const getOrderDetails = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user")

    if(!order){
        return next(new ErrorHandler('Not order found with this id', 404))
    }

    res.status(200).json({
        order,
    })
})