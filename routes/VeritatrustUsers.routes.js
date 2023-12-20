const express = require("express");
const router = express.Router();

const { finduserOrCreate, updateVeritatrustUsers, updatePassword } = require("../controllers/VeritatrustUsers.controller");

// Retrieve a single merchant_profile with id
router.put("/", updateVeritatrustUsers);
router.post("/", finduserOrCreate);


module.exports = router;
