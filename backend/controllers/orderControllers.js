import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/product.js"

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


//get all orders - ADMIN => /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find()

    res.status(200).json({
        orders,
        
    })
})


//update Order- ADMIN => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email",
    );

    if(!order){
        return next(new ErrorHandler("No order found with this ID", 404));
    }

    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order?.orderItems?.forEach(async(item) => {
        const product = await Product.findById(item?.product?.toString())
        if(!product){
            return next(new ErrorHandler("No product found with this ID", 404));
        }
        product.stock = product.stock - item.quantity
        await product.save({validateBeforeSave: false});
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
    })
})

export const deleteOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('Not order found with this id', 404))
    }

    await order.deleteOne()

    res.status(200).json({
        success: true
    })
})
