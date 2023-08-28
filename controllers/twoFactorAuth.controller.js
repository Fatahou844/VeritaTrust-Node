'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const twoFactorAuth = db.twoFactorAuth;


exports.gettwoFactorAuthbyUserId =  function (req, res) {
  //update foll
  var data = twoFactorAuth.findOne( {
    where: {
      userId: req.params.userId
    }
  }).then(secret => {
    if (secret) {
      res.status(200).json(secret);
    } else {
      res.status(400).send('error updated');
    }
  });
};





