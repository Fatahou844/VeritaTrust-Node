'use strict';

const user_profile = require('../models/user_profile.model');
exports.findAll = function (req, res) {
  user_profile.findAll(function (err, user_profile) {
    console.log('controller');
    if (err) res.send(err);
    console.log('res', user_profile);
    res.send(user_profile);
  });
};
exports.create = function (req, res) {
  const new_user_profile = new user_profile(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: 'Please provide all required field'
    });
  } else {
    user_profile.create(new_user_profile, function (err, user_profile) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: "user_profile added successfully!",
        data: user_profile
      });
    });
  }
};
exports.findById = function (req, res) {
  user_profile.findById(req.params.id, function (err, user_profile) {
    if (err) res.send(err);
    res.json(user_profile);
  });
};
exports.findByEmail = function (req, res) {
  user_profile.findByEmail(req.params.email, function (err, user_profile) {
    if (err) res.send(err);
    res.json(user_profile);
  });
};
exports.findByWallet_id = function (req, res) {
  user_profile.findByWallet_id(req.params.wallet_id, function (err, user_profile) {
    if (err) res.send(err);
    res.json(user_profile);
  });
};
exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: 'Please provide all required field'
    });
  } else {
    user_profile.update(req.params.id, new user_profile(req.body), function (err, user_profile) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: 'user_profile successfully updated'
      });
    });
  }
};
exports.delete = function (req, res) {
  user_profile.delete(req.params.id, function (err, user_profile) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: 'user_profile successfully deleted'
    });
  });
};