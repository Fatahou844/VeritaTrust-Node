const Op = require("sequelize").Op;

//const userprofile = require('../models/merchantReview');
const bcrypt = require("bcrypt");
const db = require("../models/index");
const userprofile = db.userprofile;
const { body, validationResult } = require("express-validator");

exports.findAll = function (req, res) {
  userprofile.findAll(
    req.query.page,
    req.query.site,
    function (err, userprofile) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", userprofile);
      // res.send(userprofile);

      const filters = req.query;
      const filteredUsers = userprofile.filter((user) => {
        let isValid = true;
        for (var key in filters) {
          var keys_filr = filters[key].toString().split(",");
          if (key == "rating")
            isValid = isValid && keys_filr.includes(user[key].toString());
        }
        return isValid;
      });
      res.render("pages-review", {
        title: "All reviews",
        merchantReviews: filteredUsers,
        webmerchant: req.query.site,
      });
    }
  );
};

const validateData = [
  body("first_name").isString().withMessage("first_name must be string"),
  body("last_name").isString().withMessage("last_name must be string"),
  body("email").isString().withMessage("email must be string"),
];

exports.createuser = [
  ...validateData,
  function (req, res) {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //create user
    userprofile
      .create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: "VeritaTrust@2024",
      })
      .then((user) => {
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
exports.getUsers = function (req, res) {
  userprofile.findAll().then((user) => {
    if (user) {
      res.status(200).json(user);
    }
    //if productreview not created, send error
    else {
      res.status(400).send("error to select");
    }
  });
};

exports.getUsersByFilterName = function (req, res) {
  userprofile
    .findAll({
      where: {
        [Op.like]: `${req.query.q}%`,
      },
    })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      }
      //if productreview not created, send error
      else {
        res.status(400).send("error to select");
      }
    });
};

exports.finduserOrCreate = function (req, res) {
  userprofile
    .findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: "password",
      },
    })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      }
      //if productreview not created, send error
      else {
        res.status(400).send("error to select");
      }
    });
};
exports.getUserByEmail = async function (req, res) {
  var data = await userprofile.findOne({
    where: {
      email: "fatahouahamadi88@gmail.com",
    },
  });
  return data;
};
exports.getUserByUsername = async function (req, res) {
  var data = userprofile.findOne({
    where: {
      email: req.query.username,
    },
  });
  if (data) {
    console.log(data);
    res.status(200).json(data);
  } else {
    res.status(400).send("error to select");
  }
};

exports.getUserById = async function (req, res) {
  var data = userprofile.findOne({
    where: {
      email: req.params.id,
    },
  });
  if (data) {
    console.log(data);
    res.status(200).json(data);
  } else {
    res.status(400).send("error to select");
  }
};
exports.findById = function (req, res) {
  userprofile.findById(req.params.id, function (err, userprofile) {
    if (err) res.send(err);
    res.json(userprofile);
  });
};

exports.updateUserprofile = function (req, res) {
  //update user
  var data = userprofile
    .update(req.body, {
      where: {
        id: req.body.id,
      },
    })
    .then((user) => {
      if (user) {
        res.status(200).send("Userprofile have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    userprofile.update(
      req.params.id,
      new userprofile(req.body),
      function (err, userprofile) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "userprofile successfully updated",
        });
      }
    );
  }
};
exports.delete = function (req, res) {
  userprofile.delete(req.params.id, function (err, userprofile) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "userprofile successfully deleted",
    });
  });
};

exports.updatePassword = function (req, res) {
  bcrypt
    .hash(req.body.actualpassword, 10)
    .then((password_hashed) => {
      userprofile
        .update(
          { password: password_hashed },
          {
            where: {
              id: req.body.userId,
            },
          }
        )
        .then((profile) => {
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
