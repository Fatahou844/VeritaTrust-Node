const express = require("express");
const router = express.Router();

const {
  getVoucherGifts,
  getVoucherGiftById
} = require("../controllers/VoucherGifts.controller");


router.get("/", getVoucherGifts);
router.get("/:voucherid", getVoucherGiftById);




module.exports = router;
