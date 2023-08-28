const express = require("express");
const router = express.Router();

const {
  getMerchantByWebsite,
  updateMerchantWebsite,
  updateNbReviewsRMMerchantProfile,
  getMerchantByMerchantId,
} = require("../controllers/merchant_profile.controller");

// // Retrieve all merchant_profile
// router.get("/", merchant_profileController.findAll);

// // Create a new merchant_profile
// router.post("/", merchant_profileController.create);

// Retrieve a single merchant_profile with id
router.get("/:website", getMerchantByWebsite);

router.get("/findmerchant/:merchantId", getMerchantByMerchantId);

router.put("/:website", updateNbReviewsRMMerchantProfile);

// // Update a merchant_profile with id
// router.put("/:id", merchant_profileController.update);

// // Delete a merchant_profile with id
// router.delete("/:id", merchant_profileController.delete);

module.exports = router;
