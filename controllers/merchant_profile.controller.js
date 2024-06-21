//const userprofile = require('../models/merchantReview');
const db = require("../models/index");
const merchant_review = db.merchant_review;
const { body, validationResult } = require("express-validator");

const merchant_profile = db.merchant_profile;
exports.findAll = function (req, res) {
  merchant_profile.findAll(function (err, merchant_profile) {
    console.log("controller");
    if (err) res.send(err);
    else {
      console.log("res", merchant_profile);
      const filters = req.query;
      const filteredUsers = merchant_profile.filter((user) => {
        let isValid = true;
        for (var key in filters) {
          var keys_filr = filters[key].toString().split(",");
          if (key === "created_at") {
            const date1 = new Date(keys_filr[0].toString());
            const date2 = new Date(keys_filr[1].toString());
            const date_user = new Date(user[key].toString());
            isValid =
              isValid &&
              date_user.getTime() >= date1.getTime() &&
              date_user.getTime() <= date2.getTime();
          } else if (key === "search") {
            var desci = user["description"]
              .toString()
              .search(keys_filr[0].toString());
            var value = false;
            if (desci >= 0) value = true;
            else value = false;
            isValid = isValid && value;
          } else isValid = isValid && keys_filr.includes(user[key].toString());
        }
        return isValid;
      });
      res.send(filteredUsers);
      //res.send(merchant_profile);
    }
  });
};

const validateData = [
  body("name").isString().withMessage("name must be string"),
  body("website").isString().withMessage("website must be string"),
];

exports.createmerchantprofile = [
  ...validateData,
  function (req, res) {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    merchant_profile
      .create({
        name: req.body.name,
        website: req.body.website,
      })
      .then((merchant) => {
        console.log(merchant);
        if (merchant) {
          res.status(200).json(merchant);
        } else {
          res.status(400).json(-1);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Brands Internal server error" });
      });
  },
];

exports.getMerchants = function (req, res) {
  merchant_profile.findAll().then((user) => {
    if (user) {
      res.status(200).json(user);
    }
    //if productreview not created, send error
    else {
      res.status(400).send("error to select");
    }
  });
};
exports.getUserByWebsite = async function (req, res) {
  var data = await merchant_profile.findOne({
    where: {
      website: req.body.website,
    },
  });
  return data;
};
exports.create = function (req, res) {
  const new_merchant_profile = new merchant_profile(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    merchant_profile.create(
      new_merchant_profile,
      function (err, merchant_profile) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "merchant_profile added successfully!",
          data: merchant_profile,
        });
      }
    );
  }
};
exports.findByWebsite = function (req, res) {
  merchant_profile.findByWebsite(
    req.params.website,
    function (err, merchant_profile) {
      if (err) res.send(err);
      res.json(merchant_profile);
    }
  );
};
exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    merchant_profile.update(
      req.params.id,
      new merchant_profile(req.body),
      function (err, merchant_profile) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "merchant_profile successfully updated",
        });
      }
    );
  }
};
exports.delete = function (req, res) {
  merchant_profile.delete(req.params.id, function (err, merchant_profile) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "merchant_profile successfully deleted",
    });
  });
};

exports.getMerchantByWebsite = function (req, res) {
  merchant_profile
    .findOne({
      where: {
        website: req.params.website,
      },
    })
    .then((merchant) => {
      console.log(merchant);
      if (merchant) {
        res.status(200).json(merchant);
      }
      //if user not created, send error
      else {
        res.status(400).send("no data");
      }
    });
};

const { Op } = require("sequelize");

exports.getMerchantProfileSearch = function (req, res) {
  const searchTerm = req.params.q;

  /*  merchant_profile
    .findAll({
      where: {
        website: {
          [Op.like]: `www.${searchTerm}%`, // Utilise Op.like pour une correspondance partielle
        },
      },
    })
    .then((merchant) => {
      console.log(merchant);
      if (merchant) {
        res.status(200).json(merchant);
      } else {
        res.status(404).json({ error: "Merchant not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });  */

  merchant_profile
    .findAll({
      where: {
        [Op.or]: [
          {
            website: {
              [Op.like]: `www.${searchTerm}%`, // Correspondance partielle pour a
            },
          },
          {
            website: {
              [Op.like]: `${searchTerm}%`, // Correspondance partielle pour b
            },
          },
        ],
      },
    })
    .then((merchant) => {
      console.log(merchant);
      if (merchant) {
        // Vérifiez si au moins un résultat a été trouvé
        res.status(200).json(merchant);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getMerchantByMerchantId = function (req, res) {
  merchant_profile
    .findOne({
      where: {
        id: req.params.merchantId,
      },
    })
    .then((merchant) => {
      console.log(merchant);
      if (merchant) {
        res.status(200).json(merchant);
      }
      //if user not created, send error
      else {
        res.status(400).send("no data");
      }
    });
};

exports.updateMerchantWebsite = function (req, res) {
  merchant_profile
    .findOne({
      where: {
        website: req.params.website,
      },
    })
    .then((merchant) => {
      console.log(merchant);
      if (merchant) {
        merchant_profile
          .update(
            { ReviewsNumber: merchant.ReviewsNumber + 1 },
            {
              where: {
                website: req.params.website,
              },
            }
          )
          .then((profile) => {
            console.log(profile);
            if (profile) {
              res.status(200).json(profile);
            }
            //if user not created, send error
            else {
              res.status(400).send("error updated data");
            }
          });
      }
      //if user not created, send error
      else {
        res.status(400).send("error updated data");
      }
    });
};

exports.updateNbReviewsRMMerchantProfile = function (req, res) {
  merchant_review
    .findAll({
      attributes: [
        [db.sequelize.fn("AVG", db.sequelize.col("rating")), "average_rating"],
      ],
      where: {
        merchant_id: req.body.merchant_id,
      },
    })
    .then((result) => {
      const averageRating = result[0].dataValues.average_rating;
      //res.status(200).json(averageRating);

      /*********************************   ******************* /
       *
       *  Update Nbre reviews + Rate Mean
       *   */
      merchant_profile
        .findOne({
          where: {
            website: req.params.website,
          },
        })
        .then((merchant) => {
          console.log(merchant);
          if (merchant) {
            merchant_profile
              .update(
                {
                  ReviewsNumber: merchant.ReviewsNumber + 1,
                  ReviewMean: averageRating,
                },
                {
                  where: {
                    website: req.params.website,
                  },
                }
              )
              .then((p) => {
                console.log(p);
                if (p) {
                  res.status(200).json(p);
                }
                //if user not created, send error
                else {
                  res.status(400).send("error updated data");
                }
              });
          }
          //if user not created, send error
          else {
            res.status(400).send("error updated data");
          }
        });

      /**  ######################################  */
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("error to select");
    });
};

exports.updateMerchant_profile = function (req, res) {
  merchant_profile
    .findOne({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((merchantprofile) => {
      console.log(merchantprofile);
      if (merchantprofile) {
        merchant_profile
          .update(req.body, {
            where: {
              id: parseInt(req.params.id),
            },
          })
          .then((p) => {
            console.log(p);
            if (p) {
              res.status(200).json(p);
            }
            //if user not created, send error
            else {
              res.status(400).send("error updated data");
            }
          });
      }
      //if user not created, send error
      else {
        res.status(400).send("error updated data");
      }
    });
};
