const express = require("express");
const router = express.Router();

const {
  getBrandSearch,
  createBrand,
  getBrandById,
  getBrands,
  updateBrand
} = require("../controllers/brand.controller");

router.get("/search-results/:Category_id/:q", getBrandSearch);
router.post("/", createBrand);
router.get("/:id", getBrandById);
router.get("/search/getall", getBrands);
router.put("/:id", updateBrand);






module.exports = router;

