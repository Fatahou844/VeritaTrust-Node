const express = require('express');
const router = express.Router();

const merchant_reviewController =   require('../controllers/merchant_review.controller');

// Retrieve all merchant_review
router.get('/', merchant_reviewController.findAll);

// Create a new merchant_review
router.post('/', merchant_reviewController.create);

// Retrieve a single merchant_review with id
router.get('/:id', merchant_reviewController.findById);

// Update a merchant_review with id
router.put('/:id', merchant_reviewController.update);

// Delete a merchant_review with id
router.delete('/:id', merchant_reviewController.delete);

module.exports = router;