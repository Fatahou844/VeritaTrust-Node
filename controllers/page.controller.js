'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const page = db.page;

exports.createPage = function(req, res) {
  const { pageName, pageType, pageUrl } = req.body;

  db.page
    .findOrCreate({
      where: { pageUrl: pageUrl },
      defaults: { pageName, pageType }
    })
    .then(([page, created]) => {
      if (created) {
        res.status(201).json({ message: 'Page created successfully.' });
      } else {
        res.status(409).json({ message: 'Page already exists.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
};


exports.deletePage = function (req, res) {
  const pageId = req.params.id; // Supposons que l'ID soit passé en tant que paramètre dans l'URL

  db.page
    .destroy({
      where: { pageId: pageId }
    })
    .then(deletedRows => {
      if (deletedRows > 0) {
        res.status(200).json({ message: 'Page deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Page not found.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error.' });
    });
};





