'use strict';

const moment = require('moment');
const {sendValidationCode} = require('../service/sendValidationCode');


const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const transactionCode = db.transactionCode;
const CryptoJS = require('crypto-js');

const config = require('../config');

const privateKey = config.encryptionKey;

exports.createtransactionCode = function(req, res) {
    
    //const {userId, validationCode } = req.body;
    
  const encryptedPayload = req.body.encryptedPayload;
  
      // Déchiffrement
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload, privateKey);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    // Convertir en objet JSON
    const dataUser = JSON.parse(decryptedString);

  transactionCode.upsert(dataUser)
  .then(result => {
    if (result) {
        
        
     // sendNotification(3); 
     sendValidationCode(dataUser.userId, dataUser.validationCode)
      res.status(200).send('Code validation created');
      
    } else {
      res.status(400).send('erreur de création code');
    }
  })
  .catch(error => {
    res.status(500).send(error.message);
  });
};



exports.gettransactionCodebyCode =  function (req, res) {
    
    var tenMinutesAgo = moment().subtract(10, 'minutes');
  //update foll
  var data = transactionCode.findOne( {
    where:  {
            [Op.and]: [
              { validationCode : req.params.validationCode },
              { createdAt : { [Op.gte]: tenMinutesAgo.toDate() } },
            ],
          },
  }).then(foll => {
    if (foll) {
      res.status(200).json(foll);
    } else {
      res.status(400).send('error updated');
    }
  });
};

exports.verifyCode =  function (req, res) {
    
   var tenMinutesAgo = moment().subtract(10, 'minutes');
    
  var data = transactionCode.findOne( {
    where:  {
              [Op.and]: [
              { validationCode : req.body.validationCode },
              { createdAt : { [Op.gte]: tenMinutesAgo.toDate() } },
            ],
            },
  }).then(foll => {
    if (foll) {
      res.status(200).json(true);
    } else {
      res.status(400).json(false);
    }
  });
};



