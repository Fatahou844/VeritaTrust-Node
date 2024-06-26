const db = require("../models/index");
const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");

const like = db.like;

const validateData = [
  body("userId").isInt().withMessage("userId must be integer"),
  body("review_id").isInt().withMessage("review_id must be integer"),
  body("like_type").isString().withMessage("like_type must be string"),
  body("status").isString().withMessage("status must be string"),
];

exports.createLike = [
  ...validateData,
  function (req, res) {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    like
      .create(req.body)
      .then((lk) => {
        console.log(lk);
        if (lk) {
          res.status(200).json(lk);
        } else {
          res.status(400).json(-1);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Likes Internal server error" });
      });
  },
];

exports.getlikebyid = function (req, res) {
  var data = like
    .findAll({
      where: {
        id: req.params.id,
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).json(foll);
      } else {
        res.status(400).send(-1);
      }
    });
};

exports.getlikebyReviewId = function (req, res) {
  var data = like
    .findAll({
      where: {
        review_id: req.params.review_id,
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).json(foll);
      } else {
        res.status(400).send(-1);
      }
    });
};

exports.deleteLike = async function (req, res) {
  const { userId, like_type, review_id } = req.params;

  try {
    const deletedRows = await like.destroy({
      where: {
        userId: userId,
        like_type: like_type,
        review_id: review_id,
      },
    });

    if (deletedRows > 0) {
      res.status(200).json({ message: "Suppression réussie" });
    } else {
      res.status(404).json({
        message: "Aucun enregistrement trouvé pour les conditions spécifiées",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
