//const userTransaction = require('../models/merchantReview');
const db = require("../models/index");
const userTransaction = db.userTransaction;
const { body, validationResult } = require("express-validator");

const validateData = [
  body("type").isString().withMessage("type must be string"),
  body("amount").isInt().withMessage("amount must be integer"),
  body("dateTransaction")
    .isString()
    .withMessage("dateTransaction must be string"),
  body("veritacoins").isString().withMessage("veritacoins must be string"),
  body("voucherValue").isString().withMessage("voucherValue must be string"),
  body("voucherWebsite")
    .isString()
    .withMessage("voucherWebsite must be string"),
  body("cryptoValue").isString().withMessage("cryptoValue must be string"),
  body("cryptoCode").isString().withMessage("cryptoCode must be string"),
  body("wallet_id").isString().withMessage("wallet_id must be string"),
  body("user_id").isInt().withMessage("user_id must be integer"),
];

exports.createuserTransaction = [
  ...validateData,
  function (req, res) {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //create user
    userTransaction.create(req.body).then((user) => {
      //if user created, send success
      if (user) {
        res.status(200).send("User created successfully");
      }
      //if user not created, send error
      else {
        res.status(400).send("User not created");
      }
    });
  },
];

exports.updateuserTransaction = function (req, res) {
  //update user
  var data = userTransaction
    .update(req.body, {
      where: {
        id: req.body.id,
      },
    })
    .then((user) => {
      if (user) {
        res.status(200).send("userTransaction have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.getuserTransaction = function (req, res) {
  //update user
  var data = userTransaction
    .findAll({
      where: {
        user_id: req.params.id,
      },
    })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).send("error updated");
      }
    });
};
