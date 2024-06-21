"use strict";

const { response } = require("express");
const Op = require("sequelize").Op;
const db = require("../models/index");
const ReportResponse = db.ReportResponse;
const merchantuser  = db.merchantuser;
const VeritatrustUsers = db.VeritatrustUsers;
const merchant_review = db.merchant_review;
const product_review = db.product_review;


exports.creatReportResponse = function (req, res) {
      // Vérifiez si req.io et req.userConnections existent
  if (!req.io || !req.userConnections) {
    return res.status(500).send('Erreur interne du serveur: Socket.io ou les connexions utilisateur ne sont pas définis...');
  }
  //create user
  ReportResponse
    .create(req.body)
    .then((user) => {
      
      if (user) {
          // Récupération de l'ID du socket utilisateur
      const userSocketId = req.userConnections[req.body.SupportUserId];

      // Vérifiez si l'utilisateur est connecté
      if (userSocketId) {
        // Emission de la notification en temps réel à l'utilisateur spécifique
        req.io.to(userSocketId).emit("reportresponse", user);
      }
        res.status(200).send("Response created successfully");
      }
      else {
        res.status(400).send("Response not created");
      }
    });
};

exports.getResponses = function (req, res) {
  ReportResponse.findAll({
      include: [
        {
          model: merchant_review, // Remplacez Vehicule par le nom de votre modèle de véhicule
           attributes: [
            "id",
            "content",
            "title",
            "rating",
          ], // Sélectionnez les attributs que vous souhaitez inclure
          where: {
            ReviewType: 'merchant_review', // Condition pour l'inclusion
          },
        },
        {
          model: product_review, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: [
            "id",
            "content",
            "title",
            "rating",
          ], // Sélectionnez les attributs que vous souhaitez inclure
          where: {
            ReviewType: 'product_review', // Condition pour l'inclusion
          },
        },
      ],
    }).then((user) => {
    if (user) {
      res.status(200).json(user);
    }
    else {
      res.status(400).send("error to select");
    }
  });
};

exports.getReportResponseById = async function (req, res) {
  try {
    const reportId = req.params.reportId;

    // Récupérer les réponses de la revue
    const reportResponses = await ReportResponse.findAll({
      where: {
        ReportReviewId: reportId
      }
    });

    if (reportResponses.length > 0) {
      const results = [];

      // Récupérer les merchantuserIds distincts des réponses de la revue
      const merchantUserIds = reportResponses.map(response => response.SupportUserId);
      const uniqueMerchantUserIds = [...new Set(merchantUserIds)];

      const merchantUsers = await VeritatrustUsers.findAll({
        where: {
          id: {
            [Op.in]: uniqueMerchantUserIds
          }
        }
      });

      // Créer un dictionnaire pour accéder facilement aux informations du merchantuser
      const merchantUserDict = {};
      merchantUsers.forEach(user => {
        merchantUserDict[user.id] = user;
      });

      // Ajouter le nom du merchantuser à chaque réponse de la revue
      reportResponses.forEach(response => {
        const merchantUser = merchantUserDict[response.SupportUserId];
        if (merchantUser) {
          response.VeritaTrustUserName = `${merchantUser.firstName} ${merchantUser.lastName}`;
        }
        results.push({
            "id": response.id,
            "ReportReviewId": response.ReportReviewId,
            "SupportUserId": response.SupportUserId,
            "Message": response.Message,
            "createdAt": response.createdAt,
            "VeritaTrustUserName": response.VeritaTrustUserName
        });
      });

      res.status(200).json(results);
    } else {
      res.status(400).send('Aucune réponse de revue trouvée');
    }
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des réponses de la revue');
  }
};
