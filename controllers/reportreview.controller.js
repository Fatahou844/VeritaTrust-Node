const db = require("../models/index");
const { Op } = require("sequelize");

const ReportReview = db.ReportReview;

const { body, validationResult } = require("express-validator");

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

const validateData = [
  body("ReportReviewId").isInt().withMessage("ReportReviewId must be integer"),
  body("SupportUserId").isString().withMessage("SupportUserId must be string"),
  body("Message").isString().withMessage("Message must be string"),
];

exports.createReportReview = [
  ...validateData,
  function (req, res) {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  },
];
