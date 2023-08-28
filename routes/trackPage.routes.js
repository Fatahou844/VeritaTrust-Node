const express = require("express");
const router = express.Router();

const {
  createTrackPage,
  getTrackPagesByPageId,
  
} = require("../controllers/trackPage.controller");


// // Create a new trackPage
router.post("/", createTrackPage);

router.get("/:pageId", getTrackPagesByPageId);

module.exports = router;
