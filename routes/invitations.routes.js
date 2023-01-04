const express = require('express');
const router = express.Router();

const invitationsController =   require('../controllers/invitations.controller');

// Retrieve all invitations
router.get('/', invitationsController.findAll);

// Create a new invitations
router.post('/', invitationsController.create);

// Retrieve a single invitations with Reference_number
router.get('/:Reference_number', invitationsController.findByReference_number);


// Delete a invitations with Reference_number
router.delete('/:Reference_number', invitationsController.delete);

module.exports = router;