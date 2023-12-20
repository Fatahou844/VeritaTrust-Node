'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");

const ReportReview = db.ReportReview;


exports.getReportReviews = function (req, res) {


 ReportReview.findAll()
.then((ReportReview) => {
  console.log(ReportReview);
  if (ReportReview) {
    res.status(200).json(ReportReview);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "ReportReviews Internal server error" });
});

    
  
};  


exports.createReportReview = function (req, res) {

    ReportReview.create(req.body)
    .then((ReportReview) => {
      console.log(ReportReview);
      if (ReportReview) {
        res.status(200).json(ReportReview);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "ReportReviews Internal server error" });
    });

};  


