const express = require("express");
const router = express.Router();

const {
  createLike,
  getlikebyReviewId,
  deleteLike
} = require("../controllers/like.controller");

router.post("/", createLike);
router.get("/get/:review_id", getlikebyReviewId);
router.get("/delete/:userId/:like_type/:review_id", deleteLike);



module.exports = router;

