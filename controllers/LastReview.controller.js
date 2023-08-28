'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const LastReview = db.LastReview;

exports.findLastReviewOrCreate = function (req, res) {
  LastReview.findOrCreate({
    where: {
      userId: req.body.userId
    },
    defaults: {
      LastReviewSubmitDate	: req.body.LastReviewSubmitDate,
      userId: req.body.userId
    }
  }).then(lastReview => {
    if (lastReview) {
      res.status(200).json(lastReview);
    }
    //if productreview not created, send error
    else {
      res.status(400).send('error to select');
    }
  });
};

exports.findOrUpdate = function (req, res) {
  LastReview.findOrCreate({
    where: {
      userId: req.body.userId
    },
    defaults: {
      LastReviewSubmitDate: req.body.LastReviewSubmitDate,
      userId: req.body.userId
    }
  }).then(([lastReview, created]) => {
    if (created) {
      res.status(201).json(lastReview); // Nouvel enregistrement créé
    } else {
      // Enregistrement existant mis à jour
      lastReview.update({
        LastReviewSubmitDate: req.body.LastReviewSubmitDate,
        userId: req.body.userId
      }).then(updatedReview => {
        res.status(200).json(updatedReview);
      }).catch(error => {
        res.status(400).send('Erreur lors de la mise à jour');
      });
    }
  }).catch(error => {
    res.status(400).send('Erreur lors de la recherche ou de la création');
  });
};





