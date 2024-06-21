const express = require('express');
const router = express.Router();
const invitationsController = require('../controllers/invitations.controller');

// Retrieve all invitations
router.get('/:merchant_id', invitationsController.getInvitationbyMerchantId);

// Create a new invitations
router.post('/', invitationsController.create);


module.exports = router;