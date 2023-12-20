const FacebookStrategy = require("passport-facebook").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require("../models/index");
const userprofile = db.userprofile;
const express = require('express');
const passport = require('passport');
const { newUserConfirmation } = require("../service/newUserConfirmation");


const router = express.Router();

passport.use(
  new FacebookStrategy(
    {
      clientID: config["facebook"].clientID,
      clientSecret: config["facebook"].clientSecret,
      callbackURL: config["facebook"].callbackURL,
      profileFields: ["id", "email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in the database
      userprofile
        .findOne({
          where: {
            [Op.or]: [
              { facebookId: profile.id },
              { email: profile.emails[0].value },
            ],
          },
        })
        .then((user) => {
          if (user) {
              
            // Update user with Facebook ID
            userprofile
              .update(
                { facebookId: profile.id },
                {
                  where: {
                    email: user.email,
                  },
                }
              )
              .then(() => {
                console.log("Userprofile updated successfully");
                done(null, user);
              })
              .catch((err) => {
                console.error("Error updating user: ", err);
              }); 
                    
          } else {
            userprofile
              .create({
            // Create a new user in the database
                facebookId: profile.id,
                email: profile.emails[0].value,
                password: "xpassword",
                displayName: profile.displayName,
                token: accessToken,
                 verified: 1,

              })
              .then((newUser) => {
                  const verificationToken = uuid.v4();
                const confirmation_link =
                  "https://api.veritatrust.com/user-changepassword/" + verificationToken;
                newUserConfirmation(profile.displayName, profile.displayName, confirmation_link, profile.emails[0].value, "xpassword" )
                done(null, newUser);
              });
          }
        });
    }
  )
);

passport.use('facebook-part-reviewform',
  new FacebookStrategy(
    {
      clientID: config["facebook"].clientID,
      clientSecret: config["facebook"].clientSecret,
      callbackURL: config["facebook"].callbackURL,
      profileFields: ["id", "email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in the database
      userprofile
        .findOne({
          where: {
            [Op.or]: [
              { facebookId: profile.id },
              { email: profile.emails[0].value },
            ],
          },
        })
        .then((user) => {
          if (user) {
              
            // Update user with Facebook ID
            userprofile
              .update(
                { facebookId: profile.id },
                {
                  where: {
                    email: user.email,
                  },
                }
              )
              .then(() => {
                console.log("Userprofile updated successfully");
                done(null, user);
              })
              .catch((err) => {
                console.error("Error updating user: ", err);
              }); 
                    
          } else {
            userprofile
              .create({
            // Create a new user in the database
                facebookId: profile.id,
                email: profile.emails[0].value,
                password: "xpassword",
                displayName: profile.displayName,
                token: accessToken,
                 verified: 1,

              })
              .then((newUser) => {
                  const verificationToken = uuid.v4();
                const confirmation_link =
                  "https://api.veritatrust.com/user-changepassword/" + verificationToken;
                newUserConfirmation(profile.displayName, profile.displayName, confirmation_link, profile.emails[0].value, "xpassword" )
                done(null, newUser);
              });
          }
        });
    }
  )
);


router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: config["urlClients"].urlSuccessForFB,
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

router.get("/api/associate/facebook", passport.authenticate("facebook"));

router.get(
  "/api/associate/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: config["urlClients"].urlSuccessAssociated,
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

// Route pour l'authentification avec la deuxième stratégie
router.get('/reviewform', (req, res, next) => {
    const returnTo = req.query.returnTo || '/add-review-create-for-beta';
    req.session.returnTo = returnTo;
    
    next();
  }, passport.authenticate('facebook-part-reviewform'));

// Route pour le rappel après l'authentification avec la deuxième stratégie
router.get('/reviewform/callback',
  passport.authenticate('facebook-part-reviewform', { failureRedirect: config["urlClients"].urlRedirect }),
   (req, res) => {
    // Rediriger vers l'URL d'origine
    const returnUrl = req.session.returnTo || '/add-review-create-for-beta';
    delete req.session.returnTo; // Effacer la valeur après utilisation
    res.redirect(returnUrl);
  }
);

module.exports = router;

