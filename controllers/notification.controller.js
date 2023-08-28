'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const notification = db.notification;


exports.createnotification = function(req, res) {
  const { notification_type, userId, message } = req.body;
  notification.upsert({
    notification_type: notification_type,
    userId: userId,
    status: "1",
    message: message// définissez le statut sur 1 pour indiquer que la relation est active
  })
  .then(result => {
    if (result) {
      res.status(200).send('Notification avec succès');
    } else {
      res.status(400).send('Erreur lors de la création de la relation');
    }
  })
  .catch(error => {
    res.status(500).send(error.message);
  });
};



exports.deletenotification = function (req, res) {
  //update foll
  var data = notification.update(req.body, {
      where: {
           
             id  : req.params.id
         }
            
  }).then(foll => {
    if (foll) {
      res.status(200).send('notification have been deleted successfully');
    } else {
      res.status(400).send('error updated');
    }
  });
};

exports.updatenotification = function (req, res) {
  //update foll
  var data = notification.update(req.body, {
      where: {
           
             id  : req.params.id
         }
            
  }).then(foll => {
    if (foll) {
      res.status(200).send('notification have been updated successfully');
    } else {
      res.status(400).send('error updated');
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
  var data = notification.findAll({
    where: {
      [Op.and]: [
        {
          userId: req.params.userId
        },
        {
          status: "1"
        }
      ],
    },
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(notif => {
    if (notif) {
      res.status(200).json(notif);
    } else {
      res.status(400).send('error updated');
    }
  });
};







