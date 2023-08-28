const express = require("express");
const router = express.Router();

const {
  updatePassword,
  getUsersByFilterName,
  finduserOrCreate,
} = require("../controllers/merchantUser.controller");

// Retrieve a single merchant_profile with id

router.post("/", function(req, res){
  finduserOrCreate();
});

router.put("/", updatePassword);

//router.get("/users/resultsfiltered", getUsersByFilterName);

module.exports = router;
