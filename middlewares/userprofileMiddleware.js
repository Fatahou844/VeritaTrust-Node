const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require('../models/index');
const userprofile = db.userprofile;
const speakeasy = require("speakeasy");
const express = require('express');
const bcrypt = require("bcrypt");
const { sendConfirmation } = require("../service/sendConfirmation");
const { newUserConfirmation } = require("../service/newUserConfirmation");
const { resetPasswordNotif } = require("../service/resetPasswordNotif");
const { passwordNotifUpdate } = require("../service/passwordNotifUpdate");
const twoFactorRoutes = require('../routes/twoFactorAuth.routes');
const VeritatrustUsers = db.VeritatrustUsers;
const twoFactorAuth = db.twoFactorAuth;
const {OAuth2Client} = require('google-auth-library');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;


const QRCode = require("qrcode");
const GOOGLE_CLIENT_ID = "1036726798056-idduh86bhvsjo0mrhuuhoj8l87u4alvi.apps.googleusercontent.com"

const CryptoJS = require('crypto-js');
const queries = require("../queries");
const {
  QueryTypes
} = require('sequelize');

const googleClient = new OAuth2Client({
  clientId: `${GOOGLE_CLIENT_ID}`,
});

/*
passport.use(new BearerStrategy(
  function(token, done) {
    userprofile.findOne({ token: "" }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));
*/
const authenticateUser = async (req, res) => {
 
  let user = await userprofile.findOne({ where:{ googleId: req.params.googleid }});
  console.log("User found:", user);

    if (!user) {
      user = await new userprofile({
        googleId: req.params.googleid,
      });
    
      await user.save();
      console.log("User created:", user);
    }
    
    const userdata = {"city": user.city, "country": user.country, "currency":user.currency, "dateNaissance":user.dateNaissance, "email": user.email,"role":"user",
             "first_name":user.first_name, "gender":user.gender, "id":user.id, "last_name":user.last_name, "level_account":user.level_account, "localAdress":user.localAdress,
             "nickname":user.nickname, "profile_url":user.profile_url, "total_rewards":user.total_rewards, "twoFactorAuthEnabled":user.twoFactorAuthEnabled, "userWalletAddress":user.userWalletAddress,
             "verified": user.verified, "zip":user.zip, "phoneNumber": user.phoneNumber, "googleId":user.googleId
         }


  res.json({ userdata });
};

const router = express.Router();

 
// Activation de l'authentification 2FA pour l'utilisateur
router.post(
  "/enable-2fa",

  (req, res) => {
    // Générer le secret 2FA
    const secret2fa = speakeasy.generateSecret({ length: 20, name: 'VeritaTrust' }); // Fonction de génération de secret

    // Enregistrer le secret 2FA dans la base de données pour l'utilisateur
    twoFactorAuth.create({
      userId: req.body.userId,
      twoFactorySecretTemp: secret2fa.base32,
    });

    // Générer l'URL du QR Code à scanner avec Google Authenticator
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret2fa.base32,
      label: "VeritaTrust", //
      algorithm: 'sha1'    //
    });

    //Générer le QR Code à partir de l'URL OTPAuth
    QRCode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        // Gérer les erreurs
        console.error(err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la génération du QR Code" });
      }

      // Renvoyer le secret et le QR Code à l'utilisateur
      res.json({ secret: secret2fa.base32, qrcode: dataUrl, url: otpauthUrl });
    });
  }
);

//Verification

router.post(
  "/verify-otp",

  async (req, res) => {
    try {
      const { userId, token } = req.body; // Récupérer le code OTP saisi par l'utilisateur

      console.log(token);

      // Rechercher les informations de l'authentification 2FA de l'utilisateur
      const twoFactor = await twoFactorAuth.findOne({
        where: { userId: req.body.userId },
      });

      if (!twoFactor) {
        // L'authentification 2FA n'est pas activée pour cet utilisateur
        return res
          .status(400)
          .json({ message: "Authentification à deux facteurs non activée" });
      }

      const secret2fa = twoFactor.twoFactorySecretTemp;

      // Verify the TOTP token
      const verified = speakeasy.totp.verify({
        secret: secret2fa,
        encoding: "base32",
        token: token,
        algorithm: "sha1",
        window: 6,
      });

      if (!verified) {
        // Le code OTP est incorrect
        return res.status(400).json({
          message: "failure",
        });
      }

      // Mettre à jour le statut d'activation du 2FA pour l'utilisateur
      twoFactor.isActivated = true;
      await twoFactor.save();

      const uProfile = await userprofile.findOne({
        where: { id: req.body.userId },
      });

      if (uProfile) {
        uProfile.twoFactorAuthEnabled = true;
        await uProfile.save();
        uProfile.twoFactorAuthSecret = secret2fa;
        await uProfile.save();
      }

      // Renvoyer une réponse réussie
      res.json({
        message:
          "success",
      });
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la vérification du code OTP" });
    }
  }
);

router.get("/getuseranyway/:googleid", authenticateUser); // (This is actually /auth POST route)

// Désactivation de l'authentification 2FA pour l'utilisateur
router.post("/disable-2fa", async (req, res) => {
  // Supprimer les informations d'authentification 2FA de l'utilisateur dans la base de données
  await twoFactorAuth.destroy({ where: { userId: req.body.userId } });

  const uProfile = await userprofile.findOne({
    where: { id: req.body.userId },
  });

  if (uProfile) {
    uProfile.twoFactorAuthEnabled = false;
    await uProfile.save();
    uProfile.twoFactorAuthSecret = null;
    await uProfile.save();
  }

  // Envoyer la réponse de succès
  res.json({ message: "Authentification à deux facteurs désactivée" });
});

router.post("/connect-authweb3", async (req, res, next) => {
    try {
    const { id, userWalletAddress } = req.body;
  
    const updateUser = await userprofile.update({
 
      userWalletAddress: userWalletAddress,

    }, {
    where: {
      id: req.body.id
    }
        
    });
    
    res.send("ok");

  } catch (err) {
    next(err);
  }
  
  res.send("ok");
  
});

router.get("/",   (req, res) => {
  if (req.isAuthenticated()) {
    // Query the database to retrieve user data
    userprofile
      .findOne({ where: { email: req.user.email } })
      .then((user) => {
        if (!user) {
          res.send(null);
        }

        // Do something with the user data, such as render a dashboard 
         const userdata = {"city": req.user.city, "country": req.user.country, "currency":req.user.currency, "dateNaissance":req.user.dateNaissance, "email":req.user.email,"role":"user",
             "first_name":req.user.first_name, "gender":req.user.gender, "id":req.user.id, "last_name":req.user.last_name, "level_account":req.user.level_account, "localAdress":req.user.localAdress,
             "nickname":req.user.nickname, "profile_url":req.user.profile_url, "total_rewards":req.user.total_rewards, "twoFactorAuthEnabled":req.user.twoFactorAuthEnabled, "userWalletAddress":req.user.userWalletAddress,
             "verified": req.user.verified, "zip":req.user.zip, "facebookId":req.user.facebookId, "googleId":req.user.googleId, "phoneNumber": req.user.phoneNumber, "twoFactorAuthSecret": req.user.twoFactorAuthSecret, "CodeLangSession": req.user.CodeLangSession
         }
        // res.send(req.user || null);
        res.send(userdata || null);
      })
      .catch((err) => {
        res.send(null);
      });
  } else {
    res.send(null);
  }
});

router.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    // Query the database to retrieve user data
    VeritatrustUsers.findOne({
      where: { emailAddress: req.user.emailAddress },
    })
      .then((user) => {
        if (!user) {
          res.send(null);
        }

        const userdata = {
          email: user.emailAddress,
          first_name: user.firstName,
          id: user.id,
          last_name: user.lastName,
          role: user.role,
        };
        res.send(userdata || null);
      })
      .catch((err) => {
        res.send(null);
      });
  } else {
    res.send(null);
  }
});

router.get("/users/:id",  (req, res) => {
 
 
    // Query the database to retrieve user data
    userprofile
      .findOne({ where: { id: req.params.id } })
      .then((user) => {
        if (!user) {
          res.send(null);
        }

        // Do something with the user data, such as render a dashboard 
         const userdata = {"city": user.city, "country": user.country, "currency":user.currency,
             "first_name":user.first_name, "id":user.id, "last_name":user.last_name, "level_account":user.level_account, "localAdress":user.localAdress, "hasPassword":user.password || user.password!=""?true:false,
             "nickname":user.nickname, "profile_url":user.profile_url, "createdAt":user.createdAt
             
         }
        // res.send(req.user || null);
        res.send(userdata || null);
      })
      .catch((err) => {
        res.send(null);
      });
 
   
});

router.get("/data/userprofile/:id", (req, res) => {
  const sql = 'SELECT first_name, last_name, profile_url, level_account, createdAt FROM userprofile where id='+req.params['id'];
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });
  
});

module.exports = router;
