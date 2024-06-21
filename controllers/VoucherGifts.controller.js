'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");
const {
  QueryTypes
} = require('sequelize');


const VoucherGift = db.VoucherGift;
const countries = db.countries;



exports.getVoucherGifts = function (req, res) {


 VoucherGift.findAll({ 
     include: [
        {
          model: countries,
          attributes: ["id", "name",],
        },
       
      ],})
.then((VoucherGift) => {
  console.log(VoucherGift);
  if (VoucherGift) {
    res.status(200).json(VoucherGift);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "VoucherGifts Internal server error" });
});

  
};  

exports.getVoucherGiftById = function (req, res) {


 VoucherGift.findOne({ 
       include: [
        {
          model: countries,
          attributes: ["id", "name",],
        },
       
      ],
      where: {
        id: req.params.voucherid,
      },
 })
.then((VoucherGift) => {
  console.log(VoucherGift);
  if (VoucherGift) {
    res.status(200).json(VoucherGift);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "VoucherGifts Internal server error" });
});

  
};  

