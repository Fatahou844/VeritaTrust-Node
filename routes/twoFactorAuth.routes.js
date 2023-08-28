const express = require("express");
const router = express.Router();

const {
  gettwoFactorAuthbyUserId,
} = require("../controllers/twoFactorAuth.controller");


const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // L'utilisateur est authentifié, continuez avec la prochaine étape de la route
    
     if (req.params.userId != req.user.id) {
            // L'utilisateur authentifié ne peut pas accéder aux données d'autres utilisateurs
            return res.status(403).json({ error: 'Forbidden'});
     }
  
    return next();
  }
  
  
  // L'utilisateur n'est pas authentifié, renvoyez une erreur ou redirigez-le vers la page de connexion
  res.status(401).json({ error: 'Unauthorized' });
};

router.get("/:userId",isAuthenticated, gettwoFactorAuthbyUserId);


module.exports = router;
