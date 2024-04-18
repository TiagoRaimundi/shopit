import mongoose from "mongoose";
import Product from "../models/product";
import products from './data.js'

const seedProducts = async () => {
    try {

        await mongoose.connect("mongodb://localhost:27017/shopit-v2");

        await product.deleteMany();
        console.log('Products are deleted')

        await Product.insertMany(products)
        console.log("Products are added");

    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}

seedProducts()