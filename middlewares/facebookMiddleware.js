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


router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: config["urlClients"].urlSuccess,
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


module.exports = router;

