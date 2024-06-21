const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../models/index");
const userprofile = db.userprofile;
const passport = require("passport");


const {
  createLike,
  getlikebyReviewId,
  deleteLike,
  getlikebyReviewUserId
} = require("../controllers/like.controller");

// Middleware pour vérifier l'accès à la ressource
const verifyAccess = (req, res, next) => {
  // Vérifier si l'utilisateur authentifié correspond à l'utilisateur de la ressource
  if (req.user.id === req.body.userId) {
    // L'utilisateur authentifié correspond à l'utilisateur de la ressource
    next();
  } else {
    // L'utilisateur n'est pas autorisé à accéder à la ressource
    return res.status(403).json({ message: "Forbidden" });
  }
};

const verifyAccess2 = (req, res, next) => {
  // Vérifier si l'utilisateur authentifié correspond à l'utilisateur de la ressource
  if (req.user.id === req.params.userId) {
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

router.post("/", passport.authenticate("jwt", { session: false }), verifyAccess,  createLike);
router.get("/get/:review_id", getlikebyReviewId);
router.get("/delete/:userId/:like_type/:review_id", passport.authenticate("jwt", { session: false }), verifyAccess2, deleteLike);
router.get("/getbyuserid/:userId", getlikebyReviewUserId);




module.exports = router;

