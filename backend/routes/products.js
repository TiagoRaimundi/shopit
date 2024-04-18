import express from "express"
import { getProducts, getProductsDetails, newProduct } from "../controllers/productControllers.js"

const router = express.Router()

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProduct);

router.route("/products/:id").get(getProductsDetails);

export default router;