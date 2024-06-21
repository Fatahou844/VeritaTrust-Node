const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../models/index");
const userprofile = db.userprofile;
const passport = require("passport");

const {
  createVoucherGiftTransactions,
  getVoucherGiftTransactionss,
  getVoucherGiftTransactionsByUserId,
  updateVoucherGiftTransactions
} = require("../controllers/VoucherGiftTransactions.controller");

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

const verifyAccess = (req, res, next) => {
  // Vérifier si l'utilisateur authentifié correspond à l'utilisateur de la ressource
  if (req.user.id === req.body.userId || req.user.id === req.params.userId) {
    // L'utilisateur authentifié correspond à l'utilisateur de la ressource
    next();
  } else {
    // L'utilisateur n'est pas autorisé à accéder à la ressource
    return res.status(403).json({ message: "Forbidden" });
  }
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

passport.use(
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    console.log("JWT payload received:", jwt_payload);
    try {
      const user = await userprofile.findOne({
        where: { email: jwt_payload.sub },
      });

      if (user) {
        console.log("User found:", user);
        return done(null, user);
      } else {
        console.log("User not found for email:", jwt_payload.sub);
        return done(null, false);
      }
    } catch (err) {
      console.error("Error while finding user:", err);
      return done(err, false);
    }
  })
);


router.post("/", passport.authenticate("jwt", { session: false }),verifyAccess, createVoucherGiftTransactions);
router.get("/",isAuthenticatedAdmin, getVoucherGiftTransactionss);
router.put("/:id",isAuthenticatedAdmin, updateVoucherGiftTransactions);
router.get("/:userId",passport.authenticate("jwt", { session: false }),verifyAccess, getVoucherGiftTransactionsByUserId);




module.exports = router;

