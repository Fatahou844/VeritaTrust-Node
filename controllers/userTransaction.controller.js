'use strict';

const {
  response
} = require('express');
const {
  requestToBodyStream
} = require('next/dist/server/body-streams');
//const userTransaction = require('../models/merchantReview');
const db = require('../models/index');
const userTransaction = db.userTransaction;

exports.createuserTransaction = function (req, res) {
  //create user
  userTransaction.create(req.body).then(user => {
    //if user created, send success
    if (user) {
      res.status(200).send('User created successfully');
    }
    //if user not created, send error
    else {
      res.status(400).send('User not created');
    }
  });
};

exports.updateuserTransaction = function (req, res) {
  //update user
  var data = userTransaction.update(req.body, {
    where: {
      id: req.body.id
    }
  }).then(user => {
    if (user) {
      res.status(200).send('userTransaction have been updated successfully');
    } else {
      res.status(400).send('error updated');
    }
  });
};

exports.getuserTransaction =  function (req, res) {
  //update user
  var data = userTransaction.findAll( {
    where: {
      user_id: req.params.id
    }
  }).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).send('error updated');
    }
  });
};

