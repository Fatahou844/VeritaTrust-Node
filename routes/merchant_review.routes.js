const express = require('express');
const router = express.Router();
const merchant_reviewController = require('../controllers/merchant_review.controller');
const {findMerchantAndProductReviews} = require('../controllers/merchant_review.controller');

// Retrieve all merchant_review
router.get('/', merchant_reviewController.findMerchantAndProductReviews);

// Create a new merchant_review
router.post('/', merchant_reviewController.create);

// Retrieve a single merchant_review with id
router.get('/:id', merchant_reviewController.findById);

// Retrieve a single merchant_review with id
router.get('/merchantreview/:id', merchant_reviewController.findMerchantReviewById);


router.put(
  "/merchantreview/:id",
  merchant_reviewController.updateMerchantReviewById
); 

// Delete a merchant_review with id
router.delete('/:id', merchant_reviewController.delete);


router.get(
  "/searchreviewby-transactionid/:transaction_id",
  merchant_reviewController.findMerchantAndProductReviewsByTransactionId
);


router.get(
  "/searchreviewbyall",
  merchant_reviewController.findMerchantAndProductReviews
);

router.put(
  "/merchantreviewbyjobid/:job_id",
  merchant_reviewController.updateMerchantReviewByJobId
);

module.exports = router;