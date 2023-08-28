"use strict";

const { response } = require("express");
const Op = require("sequelize").Op;
const uuid = require('uuid');

//const merchantuser = require('../models/merchantReview');
const bcrypt = require("bcrypt");
const db = require("../models/index");
const merchantuser = db.merchantuser;
exports.findAll = function (req, res) {
  merchantuser.findAll(
    req.query.page,
    req.query.site,
    function (err, merchantuser) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", merchantuser);
      // res.send(merchantuser);

      const filters = req.query;
      const filteredUsers = merchantuser.filter((user) => {
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

/*exports.create = function(req, res) {
    const new_merchantuser = new merchantuser(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        merchantuser.create(new_merchantuser, function(err, merchantuser) {
          if (err)
          res.send(err);
          res.json({error:false,message:"merchantuser added successfully!",data:merchantuser});
        });
    }
};
*/

exports.createuser = function (req, res) {
  //create user
  merchantuser
    .create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: "password",
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
};
exports.getUsers = function (req, res) {
  merchantuser.findAll().then((user) => {
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
  merchantuser
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

 /*exports.finduserOrCreate = function (req, res) {
  merchantuser
    .findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
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
};  */

exports.findUserOrCreate = async function (req, res, next) {
  try {
    const { first_name, last_name, email, password, corporate_name, website, country, phoneNumber, jobTitle } = req.body;

    const existingUser = await merchantuser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuid.v4();
    const confirmation_link =
      "https://b2b.veritatrust.com/api/verify?token=" + verificationToken;
    const [newUser, created] = await merchantuser.findOrCreate({
      where: {
        email: email,
      },
      defaults: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: hashedPassword,
      },
    });

    if (created) {
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        // sendConfirmation(firstname, lastname, confirmation_link, email);
        return res.json({ message: "Signup successful" });
      });
    } else {
      res.status(400).send("Error occurred while creating the user");
    }
  } catch (err) {
    next(err);
  }
};


exports.getUserByEmail = async function (req, res) {
  var data = await merchantuser.findOne({
    where: {
      email: "fatahouahamadi88@gmail.com",
    },
  });
  return data;
};
exports.getUserByUsername = async function (req, res) {
  var data = merchantuser.findOne({
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
  var data = merchantuser.findOne({
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
  merchantuser.findById(req.params.id, function (err, merchantuser) {
    if (err) res.send(err);
    res.json(merchantuser);
  });
};

exports.updatemerchantuser = function (req, res) {
  //update user
  var data = merchantuser
    .update(req.body, {
      where: {
        id: req.body.id,
      },
    })
    .then((user) => {
      if (user) {
        res.status(200).send("merchantuser have been updated successfully");
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
    merchantuser.update(
      req.params.id,
      new merchantuser(req.body),
      function (err, merchantuser) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "merchantuser successfully updated",
        });
      }
    );
  }
};
exports.delete = function (req, res) {
  merchantuser.delete(req.params.id, function (err, merchantuser) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "merchantuser successfully deleted",
    });
  });
};

exports.updatePassword = function (req, res) {
  bcrypt
    .hash(req.body.actualpassword, 10)
    .then((password_hashed) => {
      merchantuser
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
