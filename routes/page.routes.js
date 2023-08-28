const express = require("express");
const router = express.Router();

const {
  createPage,
} = require("../controllers/page.controller");


// // Create a new page
router.post("/", createPage);


module.exports = router;
