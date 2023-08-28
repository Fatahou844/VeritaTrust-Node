const express = require("express");
const router = express.Router();

const {
  getAllcountriesbyName,
  getcountriesbyName,
} = require("../controllers/countries.controller");


router.get("/countries", getAllcountriesbyName);
router.get("/country/:name", getcountriesbyName);


module.exports = router;
