const LocalStrategy = require("passport-local").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require("../models/index");
const userprofile = db.userprofile;
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { sendConfirmation } = require("../service/sendConfirmation");
// const { newUserConfirmation } = require("../service/newUserConfirmation");
const { resetPasswordNotif } = require("../service/resetPasswordNotif");
const { passwordNotifUpdate } = require("../service/passwordNotifUpdate");
const CryptoJS = require("crypto-js");

const router = express.Router();

passport.use(
  "local-auto-signin",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email

      usernameField: "userId",

      passwordField: "password",

      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, userId, password, done) => {
      try {
        const user = await userprofile.findOne({
          where: {
            [Op.and]: [{ id: userId }, { id: userId }],
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "local-signin-web2",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email

      usernameField: "email",

      passwordField: "password",

      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      /*const encryptedPayload = req.body.encryptedPayload;
  
      // Déchiffrement
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload, privateKey);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    // Convertir en objet JSON
    const dataUser = JSON.parse(decryptedString);*/

      try {
        const user = await userprofile.findOne({
          where: {
            [Op.and]: [{ email: email }, { email: email }],
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

router.post("/signup", async (req, res, next) => {
  try {
    const { firstname, lastname, email, gender, password } = req.body;

    /*firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordconfirm: "",
    gender: ""*/

    const existingUser = await userprofile.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "UserExist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuid.v4();
    const confirmation_link =
      "https://api.veritatrust.com/api/verify?token=" + verificationToken;
    const newUser = await userprofile.create({
      first_name: firstname,
      last_name: lastname,
      email: email,
      gender: gender,
      password: hashedPassword,
      verification_token: verificationToken,
    });

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      sendConfirmation(firstname, lastname, confirmation_link, email);
      return res.json({ message: "Signup successful" });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/data/update-email", async (req, res, next) => {
  try {
    const { id, first_name, last_name, email, password } = req.body;

    if (email !== "") {
      //Verify if email exist

      const actualuser = await userprofile.findOne({
        where: {
          email: email,
        },
      });

      if (actualuser) {
        res.status(400).json({ message: "emailExist" });
      } else {
        const verificationToken = uuid.v4();
        const confirmation_link =
          "https://api.veritatrust.com/api/verify?token=" + verificationToken;
        const updateUser = await userprofile.update(
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            verification_token: verificationToken,
            verified: 0,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );

        sendConfirmation(first_name, last_name, confirmation_link, email);
        res.clearCookie("connect.sid"); // This logs out the user.
        res.send("email-confirmation-update");
      }
    } else if (password !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateUser = await userprofile.update(
        {
          first_name: first_name,
          last_name: last_name,
          password: hashedPassword,
        },
        {
          where: {
            id: req.body.id,
          },
        }
      );

      passwordNotifUpdate(first_name, last_name, email);
      res.clearCookie("connect.sid"); // This logs out the user.
      res.send("email-confirmation-update");
    }
  } catch (err) {
    next(err);
  }

  res.send("ok");
});

router.post("/userprofile/resetpassword", async (req, res, next) => {
  try {
    const { email } = req.body;

    const userdaata = await userprofile.findOne({
      where: {
        email: email,
      },
    });

    const verificationToken = uuid.v4();
    const confirmation_link =
      "https://api.veritatrust.com/user-changepassword/" + verificationToken;
    const updateUser = await userprofile.update(
      {
        verification_token: verificationToken,
      },
      {
        where: {
          email: req.body.email,
        },
      }
    );

    resetPasswordNotif(
      userdaata.first_name,
      userdaata.last_name,
      confirmation_link,
      email
    );
    //res.clearCookie("connect.sid"); // This logs out the user.
    res.send("email-confirmation-update");
  } catch (err) {
    next(err);
  }

  res.send("ok");
});

router.get("/verify", (req, res) => {
  userprofile
    .update(
      { verified: true },
      {
        where: {
          verification_token: req.query.token,
        },
      }
    )
    .then(() => {
      console.log("Userprofile updated successfully");
    })
    .catch((err) => {
      console.error("Error updating user: ", err);
    });

  res.redirect("/account");
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local-signin-web2", function (err, user, info) {
    if (err) {
      return res.status(500).json({ error: err.message }); // Gérer les erreurs d'authentification
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Gérer les identifiants incorrects
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message }); // Gérer les erreurs de connexion
      }
      return res.status(200).json({ success: true }); // Connexion réussie
    });
  })(req, res, next);
});

router.post("/auto-login", function (req, res, next) {
  passport.authenticate("local-auto-signin", function (err, user, info) {
    if (err) {
      return res.status(500).json({ error: err.message }); // Gérer les erreurs d'authentification
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Gérer les identifiants incorrects
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message }); // Gérer les erreurs de connexion
      }
      return res.status(200).json({ success: true }); // Connexion réussie
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  // req.logout(); // clears the login session
  res.clearCookie("connect.sid"); // This logs out the user.
  //res.redirect("/");
  //req.logout(); // clears the login session
  res.redirect("/");
});

router.post(
  "/login-authweb3",
  passport.authenticate("local-signin-web3", {
    successRedirect: config["urlClients"].urlSuccess,
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

router.get("/current_user", (req, res) => {
  res.send(req.user || null);
});

router.get("/auth/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.post("/changepassword", async (req, res, next) => {
  try {
    const { token, actualpassword } = req.body;

    // const encryptedPayload = req.body.encryptedPayload;

    // Déchiffrement
    //  const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload, privateKey);
    //    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // Convertir en objet JSON
    //  const dataUser = JSON.parse(decryptedString);

    const hashedPassword = await bcrypt.hash(actualpassword, 10);

    const updateUser = await userprofile.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          verification_token: token,
        },
      }
    );
    res.clearCookie("connect.sid"); // This logs out the user.
    res.send("email-confirmation-update");
  } catch (err) {
    next(err);
  }

  res.send("ok");
});

module.exports = router;
