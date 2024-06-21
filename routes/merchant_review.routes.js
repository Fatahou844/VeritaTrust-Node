const express = require('express');
const router = express.Router();
const merchant_reviewController = require('../controllers/merchant_review.controller');
const {findMerchantAndProductReviews, getmerchant_reviews} = require('../controllers/merchant_review.controller');
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../models/index");
const userprofile = db.userprofile;
const passport = require("passport");


// Middleware pour vérifier l'accès à la ressource
const verifyAccess = (req, res, next) => {
  // Vérifier si l'utilisateur authentifié correspond à l'utilisateur de la ressource
  if (req.user.id === req.body.user_id) {
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


// Retrieve all merchant_review
router.get('/', merchant_reviewController.findMerchantAndProductReviews);

// Create a new merchant_review
router.post('/', passport.authenticate("jwt", { session: false }), verifyAccess,  merchant_reviewController.create);

// Retrieve a single merchant_review with id
router.get('/merchantreview/:id', merchant_reviewController.findMerchantReviewById);
router.get('/v2', getmerchant_reviews);

router.put(
  "/merchantreview/:id",
  merchant_reviewController.updateMerchantReviewById
); 


router.get(
  "/searchreviewby-transactionid/:transaction_id",
  merchant_reviewController.findMerchantAndProductReviewsByTransactionId
);


router.get(
  "/searchreviewbyall",
  merchant_reviewController.findMerchantAndProductReviews
);

router.put(
  "/merchantreviewbyjobid/:job_id",
  merchant_reviewController.updateMerchantReviewByJobId
);

module.exports = router;