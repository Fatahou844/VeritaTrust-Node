const express = require("express");
const router = express.Router();

const {
  getLangByCode
} = require("../controllers/lang.controller");

router.get("/:q", getLangByCode);


module.exports = router;

