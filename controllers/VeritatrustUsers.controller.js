const bcrypt = require("bcrypt");
const db = require("../models/index");
const VeritatrustUsers = db.VeritatrustUsers;

const { body, validationResult } = require("express-validator");

const validateData = [
  body("id").isInt().withMessage("id must be integer"),
  body("lastName").isString().withMessage("lastName must be string"),
  body("firstName").isString().withMessage("firstName must be string"),
  body("emailAddress").isString().withMessage("emailAddress must be string"),
  body("password").isString().withMessage("password must be string"),
];

exports.finduserOrCreate = [
  ...validateData,
  function (req, res) {
    // Hasher le mot de passe
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (err) {
        // Gérer les erreurs de hachage ici
        console.error(err);
        res.status(500).send("Erreur de hachage de mot de passe");
        return;
      }

      // Enregistrer l'utilisateur avec le mot de passe hashé
      VeritatrustUsers.findOrCreate({
        where: {
          emailAddress: req.body.emailAddress,
        },
        defaults: {
          id: req.body.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hash, // Utilisez le mot de passe hashé ici
        },
      }).then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(400).send("Erreur lors de la sélection");
        }
      });
    });
  },
];

exports.getUserById = async function (req, res) {
  var data = VeritatrustUsers.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (data) {
    console.log(data);
    res.status(200).json(data);
  } else {
    res.status(400).send("error to select");
  }
};

exports.updateVeritatrustUsers = function (req, res) {
  //update user
  var data = VeritatrustUsers.update(req.body, {
    where: {
      id: req.body.id,
    },
  }).then((user) => {
    if (user) {
      res.status(200).send("VeritatrustUsers have been updated successfully");
    } else {
      res.status(400).send("error updated");
    }
  });
};

exports.delete = function (req, res) {
  VeritatrustUsers.delete(req.params.id, function (err, VeritatrustUsers) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "VeritatrustUsers successfully deleted",
    });
  });
};

exports.updatePassword = function (req, res) {
  bcrypt
    .hash(req.body.actualpassword, 10)
    .then((password_hashed) => {
      VeritatrustUsers.update(
        { password: password_hashed },
        {
          where: {
            id: req.body.userId,
          },
        }
      ).then((profile) => {
        console.log(profile);
        if (profile) {
          res.status(200).json(profile);
        }
        //if user not created, send error
        else {
          res.status(400).send("error updated data");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("error hashing password");
    });
};
