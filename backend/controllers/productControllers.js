import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

//Create new Product => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
  const resPerPage = 4;

  const apiFilters = new APIFilters(Product, req.query).search().filters();

  console.log("req?.user", req?.user);

  let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
});

//Create new Product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
});

//Get single Product details => /api/v1/products/:id
export const getProductsDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    product,
  });
});

//Update product details => /api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    product,
  });
});

//Delete product => /api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted",
  });
});

// Create/Update product review   =>  /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get product reviews => /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    reviews: product.reviews,
  });
});

//Delete product review => /api/v1/admin/reviews
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const productId = req.query.productId; // Get productId from query parameters
  const reviewId = req.query.id; // Get reviewId from query parameters

  // Fetch the product by productId
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Filter out the review to delete
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== reviewId.toString()
  );

  // Calculate new number of reviews and average rating
  const numOfReviews = reviews.length;
  const ratings = reviews.reduce((acc, item) => acc + item.rating, 0) / (numOfReviews || 1);

  // Update the product with new reviews and rating
  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    reviews,
    numOfReviews,
    ratings
  }, { new: true, runValidators: true });

  // Send response
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: updatedProduct
  });
});
