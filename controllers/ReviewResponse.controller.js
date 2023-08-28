"use strict";

const { response } = require("express");
const Op = require("sequelize").Op;
const db = require("../models/index");
const ReviewResponse = db.ReviewResponse;
const merchantuser  = db.merchantuser;


exports.creatReviewResponse = function (req, res) {
  //create user
  ReviewResponse
    .create(req.body)
    .then((user) => {
      
      if (user) {
        res.status(200).send("Response created successfully");
      }
      else {
        res.status(400).send("Response not created");
      }
    });
};

exports.getResponses = function (req, res) {
  ReviewResponse.findAll().then((user) => {
    if (user) {
      res.status(200).json(user);
    }
    //if productreview not created, send error
    else {
      res.status(400).send("error to select");
    }
  });
};

/*
exports.getReviewResponseById =  function (req, res) {
  //update foll
  var data = ReviewResponse.findAll( {
    where: {
      ReviewId: req.params.ReviewId
    }
  }).then(foll => {
    if (foll) {
      res.status(200).json(foll);
    } else {
      res.status(400).send('error updated');
    }
  });
};
*/


exports.getReviewResponseById = async function (req, res) {
  try {
    const reviewId = req.params.ReviewId;

    // Récupérer les réponses de la revue
    const reviewResponses = await ReviewResponse.findAll({
      where: {
        ReviewId: reviewId
      }
    });

    if (reviewResponses.length > 0) {
      const results = [];

      // Récupérer les merchantuserIds distincts des réponses de la revue
      const merchantUserIds = reviewResponses.map(response => response.merchantUserId);
      const uniqueMerchantUserIds = [...new Set(merchantUserIds)];

      // Obtenir les informations du merchantuser pour chaque merchantUserId
      const merchantUsers = await merchantuser.findAll({
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
      reviewResponses.forEach(response => {
        const merchantUser = merchantUserDict[response.merchantUserId];
        if (merchantUser) {
          response.merchantUserName = `${merchantUser.first_name} ${merchantUser.last_name} (${merchantUser.nickname})`;
        }
        results.push({
            "id": response.id,
            "ReviewId": response.ReviewId,
            "ReviewType": response.ReviewType,
            "merchantUserId": response.merchantUserId,
            "content": response.content,
            "createdAt": response.createdAt,
            "merchantUserName": response.merchantUserName
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

exports.delete = function (req, res) {
  ReviewResponse.delete(req.params.id, function (err, ReviewResponse) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "ReviewResponse successfully deleted",
    });
  });
};
