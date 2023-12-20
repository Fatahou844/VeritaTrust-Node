const express = require("express");
const router = express.Router();

const { updatePassword, getUsersByFilterName, updateUserprofile } = require("../controllers/userprofile.controller");

// Retrieve a single merchant_profile with id
router.put("/", updatePassword);

router.put("/sessionlang", updateUserprofile);


//router.get("/users/resultsfiltered", getUsersByFilterName);


module.exports = router;
