const Op = require("sequelize").Op;
const db = require("../models/index");
const follow = db.follow;
const { body, validationResult } = require("express-validator");

const validateData = [
  body("follower_userId")
    .isInt()
    .withMessage("follower_userId must be integer"),
  body("following_userId")
    .isInt()
    .withMessage("following_userId must be integer"),
];

exports.createfollow = [
  ...validateData,
  function (req, res) {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { follower_userId, following_userId } = req.body;
    follow
      .upsert({
        follower_userId: follower_userId,
        following_userId: following_userId,
        status: "1", // définissez le statut sur 1 pour indiquer que la relation est active
      })
      .then((result) => {
        if (result) {
          const userSocketId = req.userConnections[userId];

          if (userSocketId) {
            req.io.emit("follows", result);
          }
          res.status(200).send("Relation suivie avec succès");
        } else {
          res.status(400).send("Erreur lors de la création de la relation");
        }
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  },
];

exports.deleteFollow = function (req, res) {
  //update foll
  var data = follow
    .update(req.body, {
      where: {
        [Op.and]: [
          {
            follower_userId: req.body.follower_userId,
          },
          { following_userId: req.body.following_userId },
        ],
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).send("follow have been deleted successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.getfollowbyuser = function (req, res) {
  //update foll
  var data = follow
    .findAll({
      where: {
        foll_id: req.params.id,
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).json(foll);
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.getfollowers = function (req, res) {
  //update foll
  var data = follow
    .findAll({
      where: {
        following_userId: req.params.id,
        status: "1",
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).json(foll);
      } else {
        res.status(400).send("error");
      }
    });
};

exports.getfollowings = function (req, res) {
  //update foll
  var data = follow
    .findAll({
      where: {
        follower_userId: req.params.id,
        status: "1",
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).json(foll);
      } else {
        res.status(400).send("error");
      }
    });
};

exports.verifyUserIsFollowed = function (req, res) {
  //update foll
  var data = follow
    .findOne({
      where: {
        [Op.and]: [
          { following_userId: req.params.id },
          { follower_userId: req.query["followingId"] },
        ],
      },
    })
    .then((foll) => {
      if (foll) {
        res.status(200).json(foll);
      } else {
        res.status(400).send("error");
      }
    });
};
