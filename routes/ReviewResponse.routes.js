const express = require("express");
const router = express.Router();

const {
  creatReviewResponse,
  getReviewResponseById,
} = require("../controllers/ReviewResponse.controller");


router.post("/response", creatReviewResponse );

router.get("/responses/:ReviewId", getReviewResponseById);

module.exports = router;
