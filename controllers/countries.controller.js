'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const countries = db.countries;


exports.getcountriesbyName =  function (req, res) {
  //update foll
  var data = countries.findOne( {
    where: {
      name: req.params.name
    }
  }).then(country => {
    if (country) {
      res.status(200).json(country);
    } else {
      res.status(400).send('error updated');
    }
  });
};

exports.getAllcountriesbyName = function (req, res) {
var term = req.query.q; // Terme de recherche

countries.findAll({
    where: {[Op.or]: [
        { name: { [Op.like]: term + '%' } }, // Recherche par nom
        { name_en: { [Op.like]: term + '%' } }, // Recherche par nom en anglais
        { name_es: { [Op.like]: term + '%' } } // Recherche par nom en espagnol
               ]
            }
        }).then(countries => {
            if (countries.length > 0) {
                    res.status(200).json(countries);
            } else {
                res.status(400).send('Aucun pays trouvé.');
                }
                }).catch(err => {
                console.log(err);
        res.status(500).send('Erreur interne du serveur.');
    });
};




