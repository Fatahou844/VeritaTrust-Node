const express = require("express");
const router = express.Router();

const { updatePassword, getUsersByFilterName } = require("../controllers/userprofile.controller");

// Retrieve a single merchant_profile with id
router.put("/", updatePassword);

//router.get("/users/resultsfiltered", getUsersByFilterName);


module.exports = router;
