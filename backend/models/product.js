import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxLength: [5, 'Product price cannot exceed 5 digits'],
    },
    description: {
        type: String,
        required: [true, "Please enter product name"],
    },
    ratings: [{
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    }
],
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    category:{
        type: String,
        required: [true, "Please enter product category"],
        enum:{
            values: [ 

            'Electronics',
            'Cameras',
            'Laptops',
            'Accessories',
            'Headphones',
            'Food',
            "Books",
            'Clothes/Shoes',
            'Beauty/Health',
            'Sports',
            'Outdoor',
            'Home'],

            message: "Please select correct category",
            
        },
    
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"]
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
                
            }
        }
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, {timestamps: true})

export default mongoose.model('Product', productSchema);