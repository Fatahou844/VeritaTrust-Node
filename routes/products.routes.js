const express = require("express");
const router = express.Router();

const { updateProduct,getRateMeanProductReview, updateNbReviewsRMProduct, createNewProduct, getProducts, updateProduct2, getProductByID2, deleteProductByID } = require("../controllers/products.controller");

// // Retrieve all merchant_profile
// router.get("/", merchant_profileController.findAll);

// // Create a new merchant_profile
// router.post("/", merchant_profileController.create);

// Retrieve a single merchant_profile with id
const isAuthenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    // L'utilisateur est authentifié, continuez avec la prochaine étape de la route
    
     if (req.user.role != 'moderator') {
            // L'utilisateur authentifié ne peut pas accéder aux données d'autres utilisateurs
            return res.status(403).json({ error: 'forbidden' });
     }
  
    return next();
  }
  
  
  // L'utilisateur n'est pas authentifié, renvoyez une erreur ou redirigez-le vers la page de connexion
  res.status(401).json({ error: 'Unauthorized' });
};


router.put("/:product_name", updateNbReviewsRMProduct);
router.get("/:product_name", getRateMeanProductReview);
router.post("/", createNewProduct);

router.get("/getall", getProducts);

router.get("/getone/:id", getProductByID2);

router.get("/deleteone/:id",isAuthenticatedAdmin, deleteProductByID);

router.put("/admin-update/:id", isAuthenticatedAdmin, updateProduct2);

// // Update a merchant_profile with id
// router.put("/:id", merchant_profileController.update);

// // Delete a merchant_profile with id
// router.delete("/:id", merchant_profileController.delete);

module.exports = router;
