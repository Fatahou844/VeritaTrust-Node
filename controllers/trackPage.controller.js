'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const trackPage = db.trackPage;


exports.createTrackPage = function(req, res) {
  const { pageUrl, ipAddress } = req.body;

  db.page
    .findOne({
      where: { pageUrl: pageUrl }
    })
    .then(page => {
      if (page) {
        const pageId = page.pageId;
        db.trackPage
          .create({ pageId, ipAddress })
          .then(trackPage => {
            res.status(201).json({ message: 'TrackPage created successfully.', trackPage });
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error.' });
          });
      } else {
        res.status(404).json({ message: 'Page not found.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
};

exports.getTrackPagesByPageId = function(req, res) {
  const { pageId } = req.params; // Supposons que pageId soit passé en tant que paramètre dans l'URL

  db.trackPage
    .findAll({
      where: { pageId: pageId }
    })
    .then(trackPages => {
      res.status(200).json({ trackPages });
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
};







