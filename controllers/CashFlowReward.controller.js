'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");
const {
  QueryTypes
} = require('sequelize');

const CashFlowReward = db.CashFlowReward;
const userprofile = db.userprofile;
const VoucherGift = db.VoucherGift;


exports.getCashFlowRewards = function (req, res) {


 CashFlowReward.findAll({ include: [
        {
          model: userprofile,
          attributes: ["id", "first_name", "last_name","gender","nickname","localAdress","city","country","userWalletAddress","level_account","currency","profile_url"],
        },
       
      ],})
.then((CashFlowReward) => {
  console.log(CashFlowReward);
  if (CashFlowReward) {
    res.status(200).json(CashFlowReward);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "CashFlowRewards Internal server error" });
});

  
};  

exports.getCashFlowRewardByUserId = function (req, res) {


 CashFlowReward.findOne({ 
     include: [
        {
          model: userprofile,
          attributes: ["id", "first_name", "last_name","gender","nickname","localAdress","city","country","userWalletAddress","level_account","currency","profile_url"],
        },
       
      ],
      where: {
        userId: req.params.userId,
      },
 })
.then((CashFlowReward) => {
  console.log(CashFlowReward);
  if (CashFlowReward) {
    res.status(200).json(CashFlowReward);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "CashFlowRewards Internal server error" });
});

  
};  

exports.createCashFlowReward = function (req, res) {

    CashFlowReward.create(req.body)
    .then((CashFlowReward) => {
      console.log(CashFlowReward);
      if (CashFlowReward) {
        res.status(200).json(CashFlowReward);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "CashFlowRewards Internal server error" });
    });

};  
exports.getCashFlowRewardById = function (req, res) {


 const sql = `SELECT * FROM CashFlowReward WHERE id=${req.params.id}`;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });
    
  
};  