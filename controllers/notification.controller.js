const Op = require("sequelize").Op;
const db = require("../models/index");
const notification = db.notification;

const { body, validationResult } = require("express-validator");

const validateData = [
  body("notification_type")
    .isString()
    .withMessage("notification_type must be string"),
  body("status").isString().withMessage("status must be string"),
  body("message").isString().withMessage("message must be string"),
  body("userId").isInt().withMessage("userId must be string"),
];

exports.createnotification = [
  ...validateData,
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { notification_type, userId, message } = req.body;

    // Vérifiez si req.io et req.userConnections existent
    if (!req.io || !req.userConnections) {
      return res
        .status(500)
        .send(
          "Erreur interne du serveur: Socket.io ou les connexions utilisateur ne sont pas définis..."
        );
    }

    notification
      .upsert({
        notification_type: notification_type,
        userId: userId,
        status: "1",
        message: message, // définissez le statut sur 1 pour indiquer que la relation est active
      })
      .then((result) => {
        if (result) {
          // Récupération de l'ID du socket utilisateur
          const userSocketId = req.userConnections[userId];

          // Vérifiez si l'utilisateur est connecté
          if (userSocketId) {
            // Emission de la notification en temps réel à l'utilisateur spécifique
            req.io.to(userSocketId).emit("notification", result);
          }
          res.status(200).send("Notification avec succès");
        } else {
          res.status(400).send("Erreur lors de la création de la relation");
        }
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  },
];

exports.deletenotification = function (req, res) {
  //update foll
  var data = notification
    .update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).send("notification have been deleted successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.updatenotification = function (req, res) {
  //update foll
  var data = notification
    .update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).send("notification have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

/*

exports.getnotificationbyuserId =  function (req, res) {
    
 
  var data = notification.findAll( {
     where: {
    [Op.and]: [
              {
                  userId : req.params.userId },
              {   status : "1" },
            ],
     },
  }).then(notif => {
    if (notif) {
      res.status(200).json(notif);
    } else {
      res.status(400).send('error updated');
    }
  });
};

*/

exports.getnotificationbyuserId = function (req, res) {
  var data = notification
    .findAll({
      where: {
        [Op.and]: [
          {
            userId: req.params.userId,
          },
          {
            status: "1",
          },
        ],
      },
      order: [["createdAt", "DESC"]],
    })
    .then((notif) => {
      if (notif) {
        res.status(200).json(notif);
      } else {
        res.status(400).send("error updated");
      }
    });
};
