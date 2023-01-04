const express = require('express');
const router = express.Router();

const transactionController =   require('../controllers/transaction.controller');

// Retrieve all transaction
router.get('/', transactionController.findAll);

// Create a new transaction
router.post('/', transactionController.create);

// Retrieve a single transaction with id
router.get('/:id', transactionController.findById);

// Delete a transaction with id
router.delete('/:id', transactionController.delete);

module.exports = router;