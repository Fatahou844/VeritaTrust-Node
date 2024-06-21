'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");
const {
  QueryTypes
} = require('sequelize');


const supportMessage = db.supportMessage;
const userprofile = db.userprofile;


exports.getsupportMessages = function (req, res) {


 supportMessage.findAll()
.then((supportMessage) => {
  console.log(supportMessage);
  if (supportMessage) {
    res.status(200).json(supportMessage);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "supportMessages Internal server error" });
});

  
};  


exports.createsupportMessage = function (req, res) {
    
     if (!req.io || !req.userConnections) {
    return res.status(500).send('Erreur interne du serveur: Socket.io ou les connexions utilisateur ne sont pas définis...');
  }

    supportMessage.create(req.body)
    .then((supportMessage) => {
      console.log(supportMessage);
      if (supportMessage) {
               // Récupération de l'ID du socket utilisateur
      const userSocketId = req.userConnections[req.body.userId];

      // Vérifiez si l'utilisateur est connecté
      if (userSocketId) {
        // Emission de la notification en temps réel à l'utilisateur spécifique
        req.io.to(userSocketId).emit("supportmessage", supportMessage);
      }
        res.status(200).json(supportMessage);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "supportMessages Internal server error" });
    });

};  


exports.getsupportMessageByReportReviewId = function (req, res) {


 const sql = `SELECT * FROM supportMessage WHERE reportReviewId=${req.params.reportreviewid} AND isWritingBy="user"`;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });
    
  
};  