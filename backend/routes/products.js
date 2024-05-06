import express from "express";
import {
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getProductReviews,
  getProducts,
  getProductsDetails,
  newProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getProducts);

router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);

router.route("/products/:id").get(getProductsDetails);

router
  .route("/admin/products/:id")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .put(isAuthenticatedUser, createProductReview)
  .get(isAuthenticatedUser, getProductReviews);

  router.route("/admin/reviews").delete(isAuthenticatedUser, deleteProductReview);


export default router;
