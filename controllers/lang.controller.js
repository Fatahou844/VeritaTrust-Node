'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");

const Lang = db.Lang;

exports.getLangByCode = function (req, res) {
  const CodeLang = req.params.q;
   
         Lang.findAll({
          where: {
            LangCode: CodeLang,
          },
        })
        .then((Lang) => {
          console.log(Lang);
          if (Lang) {
            res.status(200).json(Lang);
          } else {
            res.status(400).json(-1);
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Langs Internal server error" });
        });

};  


