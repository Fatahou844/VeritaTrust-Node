const express = require("express");
const router = express.Router();

const {
  findLastReviewOrCreate,
  findOrUpdate,
  
} = require("../controllers/LastReview.controller");


// // Create a new LastReview
router.post("/", findOrUpdate);

module.exports = router;
