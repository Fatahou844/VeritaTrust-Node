const express = require("express");
const router = express.Router();

const {
  getBrandSearch,
  createBrand,
  getBrandById,
  getBrands,
  updateBrand,
  getTopbrands,
} = require("../controllers/brand.controller");

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


router.get("/search-results/:Category_id/:q", getBrandSearch);
router.post("/", createBrand);
router.get("/:id", getBrandById);
router.get("/search/getall", getBrands);
router.get("/search/topbrands", getTopbrands);

router.put("/:id", isAuthenticatedAdmin, updateBrand);






module.exports = router;

