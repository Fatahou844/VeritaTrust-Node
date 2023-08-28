'use strict';

const {
  response
} = require('express');
const {
  requestToBodyStream
} = require('next/dist/server/body-streams');
//const userprofile = require('../models/merchantReview');
const {
  Op
} = require("sequelize");
const db = require('../models/index');
const invitations = db.invitations;
exports.findAll = function (req, res) {
  invitations.findAll(function (err, invitations) {
    console.log('controller');
    if (err) res.send(err);
    console.log('res', invitations);
    res.send(invitations);
  });
};
exports.create = function (req, res) {
  const new_invitations = new invitations(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: 'Please provide all required field'
    });
  } else {
    invitations.create(new_invitations, function (err, invitations) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: "invitations added successfully!",
        data: invitations
      });
    });
  }
};
exports.findByReference_number = function (req, res) {
  invitations.findByReference_number(req.params.Reference_number, function (err, invitations) {
    if (err) res.send(err);
    res.json(invitations);
  });
};
exports.delete = function (req, res) {
  invitations.delete(req.params.Reference_number, function (err, invitations) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: 'invitations successfully deleted'
    });
  });
};
exports.createInvitation = async function (req, res) {
  //create user
  var data = invitations.create({
    Reference_number: req.body.Reference_number,
    customer_lastname: req.body.customer_lastname,
    invitation_url: req.body.invitation_url
  });
  return data;
};
exports.getInvitations = function (req, res) {
  invitations.findOne({
    where: {
      invitation_url: req.query.invitationUrl
    }
  }).then(invitation => {
    if (invitation) {
      res.status(200).json(invitation);
    }
    //if productreview not created, send error
    else {
      res.status(400).send('error to select');
    }
  });
};
exports.getInvitations2 = function (req, res) {
  invitations.findOne({
    where: {
      invitation_url: {
        [Op.like]: `%${req.query.invitationUrl.split('/')[4]}%`
      }
    }
  }).then(invitation => {
    if (invitation) {
      res.status(200).json(invitation);
    }
    //if productreview not created, send error
    else {
      res.status(400).send('error to select');
    }
  });
};