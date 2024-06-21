'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");
const {
  QueryTypes
} = require('sequelize');

const Subscription = db.Subscriptions;
const userprofile = db.userprofile;
const merchant_profile = db.merchant_profile;



exports.getSubscriptions = function (req, res) {


 Subscription.findAll({ include: [
        {
          model: merchant_profile,
          attributes: ["id", "website"],
        },
       
      ],})
.then((Subscription) => {
  console.log(Subscription);
  if (Subscription) {
    res.status(200).json(Subscription);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "Subscriptions Internal server error" });
});

  
};  

exports.getSubscriptionByMerchantId = function (req, res) {


 Subscription.findOne({ 
     include: [
        {
          model: merchant_profile,
          attributes: ["id", "website"],
        },
       
      ],
      where: {
        merchantId : req.params.merchantId ,
      },
 })
.then((Subscription) => {
  console.log(Subscription);
  if (Subscription) {
    res.status(200).json(Subscription);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "Subscriptions Internal server error" });
});

  
};  

exports.createSubscription = function (req, res) {

    Subscription.create(req.body)
    .then((Subscription) => {
      console.log(Subscription);
      if (Subscription) {
        res.status(200).json(Subscription);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Subscriptions Internal server error" });
    });

};  
