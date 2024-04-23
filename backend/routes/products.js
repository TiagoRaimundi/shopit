import express from "express";
import {
  deleteProduct,
  getProducts,
  getProductsDetails,
  newProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, authorizeRoles("admin"), getProducts);

router.route("/admin/products").post(newProduct);

router.route("/products/:id").get(getProductsDetails);

router.route("/admin/products/:id").patch(updateProduct);
router.route("/admin/products/:id").delete(deleteProduct);

export default router;
