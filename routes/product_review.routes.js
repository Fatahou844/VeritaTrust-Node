const express = require('express');
const router = express.Router();
const product_reviewController = require('../controllers/product_review.controller');

// Retrieve all product_review
router.get('/', product_reviewController.findAll);

// Create a new product_review
//router.post('/', product_reviewController.create);

// Retrieve a single product_review with id
router.get('/:id', product_reviewController.findById);

router.get('/productreview/:id', product_reviewController.findProductReviewById);

// Update a product_review with id
router.put('/:id', product_reviewController.update);

// Delete a product_review with id
router.delete('/:id', product_reviewController.delete);
module.exports = router;