const GoogleStrategy = require("passport-google-oauth2").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require("../models/index");
const userprofile = db.userprofile;
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { newUserConfirmation } = require("../service/newUserConfirmation");

const router = express.Router();


// Middleware de redirection automatique après l'authentification
// Middleware pour stocker l'URL d'origine dans la session
function storeReturnTo(req, res, next) {
  req.session.returnTo = req.originalUrl;
  next();
}

passport.use(
  new GoogleStrategy(
    {
      clientID: config["google"].clientID,
      clientSecret: config["google"].clientSecret,
      callbackURL: config["google"].callbackURL,
      passReqToCallback: true,
      scope: ["profile", "email"],
      proxy: true,
      debug: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in the database
      console.log("profile");
      console.log(profile);
      userprofile
        .findOne({
          where: {
            [Op.or]: [
              { googleId: profile.id },
              { email: profile.emails[0].value },
            ],
          },
        })
        .then((user) => {
          if (user) {
              
              // Update user or create
              userprofile
              .update(
                { googleId: profile.id },
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
                  
//done(null, user);
          } else {
            // Create a new user in the database
            const passwordValue = Math.random().toString(36).slice(2, 10);
            const verificationToken = uuid.v4();
            userprofile
              .create({
                googleId: profile.id,
                email: profile.emails[0].value,
                password: passwordValue,
                displayName: profile.displayName,
                token: accessToken,
                verification_token: verificationToken,
                verified: 1,
              })
              .then((newUser) => {
                  
                const confirmation_link =
                  "https://api.veritatrust.com/user-changepassword/" + verificationToken;
                newUserConfirmation(profile.displayName, profile.displayName, confirmation_link, profile.emails[0].value, passwordValue )
                done(null, newUser);
              });
          }
        });
    }
  )
);

passport.use('google-part-reviewform',
  new GoogleStrategy(
    {
      clientID: config["google"].clientID,
      clientSecret: config["google"].clientSecret,
      callbackURL: config["google"].callBackUrlReviewForm,
      passReqToCallback: true,
      scope: ["profile", "email"],
      proxy: true,
      debug: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      // Check if the user already exists in the database
      console.log("profile");
      console.log(profile);
      
      
      userprofile
        .findOne({
          where: {
            [Op.or]: [
              { googleId: profile.id },
              { email: profile.emails[0].value },
            ],
          },
        })
        .then((user) => {
          if (user) {
              
              // Update user or create
              userprofile
              .update(
                { googleId: profile.id,
                  CodeLangSession: request.query.lang},
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
                  
//done(null, user);
          } else {
            // Create a new user in the database
            const passwordValue = Math.random().toString(36).slice(2, 10);
            const verificationToken = uuid.v4();
            userprofile
              .create({
                googleId: profile.id,
                email: profile.emails[0].value,
                password: passwordValue,
                displayName: profile.displayName,
                token: accessToken,
                verification_token: verificationToken,
                verified: 1,
              })
              .then((newUser) => {
                  
                const confirmation_link =
                  "https://api.veritatrust.com/user-changepassword/" + verificationToken;
                newUserConfirmation(profile.displayName, profile.displayName, confirmation_link, profile.emails[0].value, passwordValue )
                done(null, newUser);
              });
          }
        });
    }
  )
);

router.use((req, res, next) => {
  if (!req.session.originalUrl) {
    req.session.originalUrl = req.originalUrl || "/";
  }
  next();
});


router.get('/', passport.authenticate('google', { scope: ['profile','email'] }));

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/account",
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

// Route pour l'authentification avec la deuxième stratégie
router.get('/reviewform', (req, res, next) => {
    
    const Lang = req.query.returnTo.split('/')[3];

    const returnTo = req.query.returnTo ||  '/add-review-create-for-beta';
    
    req.session.returnTo = returnTo;
    req.CustomLang = Lang;


    
       req.session.save(() => {
          next();
       });
       
  }, passport.authenticate('google-part-reviewform',{ scope: ['profile', 'email'] }));
 


// Route pour le rappel après l'authentification avec la deuxième stratégie
router.get('/reviewform/callback',
  passport.authenticate('google-part-reviewform', { failureRedirect: config["urlClients"].urlRedirect }),
   (req, res) => {
    // Rediriger vers l'URL d'origine
    const Lang = req.session.Lang;
    const returnUrl = req.session.returnTo ||  '/add-review-create-for-beta';
    delete req.session.returnTo; // Effacer la valeur après utilisation
        // Update user or create
    const lang = req.cookies.lang;
          userprofile
          .update(
            { 
              CodeLangSession: lang},
            {
              where: {
                email: req.user.email,
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
    
    res.redirect(returnUrl);
   //res.send('<script>window.opener.postMessage({ user: ' + JSON.stringify(req.user) + ' }, "*"); window.close();</script>');
  }
);

module.exports = router;
