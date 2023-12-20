const express = require("express");
const router = express.Router();

const {
  getReportReviews,
  createReportReview
} = require("../controllers/reportreview.controller");


router.post("/", createReportReview);
router.get("/", getReportReviews);


module.exports = router;

