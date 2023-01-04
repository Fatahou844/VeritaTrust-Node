const express = require('express');
const router = express.Router();

const user_profileController =   require('../controllers/user_profile.controller');

// Retrieve all user_profile
router.get('/', user_profileController.findAll);

// Create a new user_profile
router.post('/', user_profileController.create);

// Retrieve a single user_profile with id
router.get('/findbyid/:id', user_profileController.findById);

// Retrieve a single user_profile with wallet_id
router.get('/:email', user_profileController.findByEmail);

// Retrieve a single user_profile with wallet_id
router.get('/findbywalletid/:wallet_id', user_profileController.findByWallet_id);


// Update a user_profile with id
router.put('/:id', user_profileController.update);

// Delete a user_profile with id
router.delete('/:id', user_profileController.delete);

module.exports = router;