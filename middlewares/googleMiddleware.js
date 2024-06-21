const GoogleStrategy = require("passport-google-oauth2").Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require("../models/index");
const userprofile = db.userprofile;
const express = require('express');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require('cors'); // Importez le module cors
const passport = require('passport');
const { newUserConfirmation } = require("../service/newUserConfirmation");

const router = express.Router();


// Middleware de redirection automatique après l'authentification
// Middleware pour stocker l'URL d'origine dans la session
function storeReturnTo(req, res, next) {
  req.session.returnTo = req.originalUrl;
  next();
}

passport.use(new BearerStrategy(
  function(token, done) {
    userprofile.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));

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

const generateJWT = (req, res, next) => {
  const token = jwt.sign({ sub: req.user.email, id: req.user.id }, jwtOptions.secretOrKey);
  req.token = token;
  next();
};


router.use((req, res, next) => {
  if (!req.session.originalUrl) {
    req.session.originalUrl = req.originalUrl || "/";
  }
  next();
});

router.use(cors());


router.get('/', passport.authenticate('google', { scope: ['profile','email'] }),
  (req, res) => {
    // Renvoie une réponse avec un modèle d'iframe
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google Sign-In</title>
      </head>
      <body>
        <iframe src="https://accounts.google.com/gsi/button?click_listener=()%3D%3E%7Bn(%22Button%20Clicked%22%2C%7Bname%3A%22google%22%2Caction%3A%22Google%20authentication%22%7D)%7D&amp;logo_alignment=left&amp;size=large&amp;shape=circle&amp;text=continue_with&amp;theme=outline&amp;type=standard&amp;width=320&amp;client_id=YOUR_CLIENT_ID&amp;iframe_id=gsi_154909_815446&amp;as=3ikm9wxW%2FrHI8CGzQfyHeQ&amp;hl=fr_FR" id="gsi_154909_815446" title="Bouton &quot;Se connecter avec Google&quot;" style="display: block; position: relative; top: 0px; left: 0px; height: 44px; width: 340px; border: 0px; margin: -2px -10px;" tabindex="-1"></iframe>
      </body>
      </html>
    `);
  });

/*router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/account",
    failureRedirect: config["urlClients"].urlRedirect,
  })
);
*/

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: config["urlClients"].urlRedirect,}), (req,res)=>{
         // Envoyer le JWT au client dans la réponse
            const token = jwt.sign({ sub: req.user.email }, jwtOptions.secretOrKey);  
            res.cookie('jwtToken', token);
            res.redirect("https://api.veritatrust.com/account")
            
  }
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
