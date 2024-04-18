import express from "express"
import { deleteProduct, getProducts, getProductsDetails, newProduct, updateProduct } from "../controllers/productControllers.js"

const router = express.Router()

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProduct);
router.route("/products/:id").get(getProductsDetails);
router.route("/products/:id").patch(updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;