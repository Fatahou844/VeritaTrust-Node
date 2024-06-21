const express = require('express');
const router = express.Router();
const product_reviewController = require('../controllers/product_review.controller');

// Retrieve all product_review
router.get('/', product_reviewController.findAll);


router.get('/productreview/:id', product_reviewController.findProductReviewById);

router.get('/v2', product_reviewController.getproduct_reviews);


router.put(
  "/productreview/:id",
  product_reviewController.updateProductReviewById
);

router.put(
  "/productreviewbyjobid/:job_id",
  product_reviewController.updateProductReviewByJob_id
);

router.put(
  "/productreviewbyproductid/:product_id",
  product_reviewController.updateProductReviewByProductId
);


module.exports = router;