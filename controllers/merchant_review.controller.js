"use strict";
//const merchant_review = require('../models/merchantReview');
const { sendNotification } = require("../service/sendNotification");
const db = require("../models/index");
const merchant_review = db.merchant_review;
const product_review = db.product_review;
const LastReview = db.LastReview;
const { body, validationResult } = require("express-validator");

exports.findAll = function (req, res) {
  merchant_review.findAll(
    req.query.page,
    req.query.site,
    function (err, merchant_review) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", merchant_review);
      // res.send(merchant_review);

      const filters = req.query;
      const filteredUsers = merchant_review.filter((user) => {
        let isValid = true;
        for (var key in filters) {
          var keys_filr = filters[key].toString().split(",");
          if (key == "rating")
            isValid = isValid && keys_filr.includes(user[key].toString());
        }
        return isValid;
      });
      res.render("pages-review", {
        title: "All reviews",
        merchantReviews: filteredUsers,
        webmerchant: req.query.site,
      });
    }
  );
};

exports.updateMerchantReviewById = function (req, res) {
  //create user
  var data = merchant_review
    .update(req.body, {
      where: {
        id: req.params["id"],
      },
    })
    .then((merchant) => {
      if (merchant) {
        res.status(200).send("merchant have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.getmerchant_reviews = function (req, res) {
  merchant_review
    .findAll({
      include: [
        {
          model: userprofile,
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: merchant_profile,
          attributes: ["id", "name", "logo", "description", "website"],
        },
      ],
      where: {
        merchant_id: req.query.merchant_id,
      },
    })
    .then(async (reviews) => {
      if (reviews) {
        // Map through the reviews and fetch corresponding ReviewResponse
        const reviewsWithResponses = await Promise.all(
          reviews.map(async (review) => {
            const response = await db.sequelize.query(
              `
              SELECT response.*, merchantuser.first_name as fNmerchantUser, merchantuser.last_name as lNmerchantUser
              FROM ReviewResponse AS response
              INNER JOIN merchantuser ON response.merchantUserId = merchantuser.id
              WHERE response.ReviewId = ${review.id}
            `,
              { type: QueryTypes.SELECT }
            );

            return {
              review,
              answers: response,
              review_type: "0",
            };
          })
        );

        res.status(200).json(reviewsWithResponses);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "merchant_reviews Internal server error" });
    });
};

const validateReview = [
  body("rating").isInt().withMessage("rating must be integer"),
  body("user_id").isInt().withMessage("user_id must be integer"),
  body("lang_id").isInt().withMessage("lang_id must be integer"),
  body("merchant_id").isInt().withMessage("User ID must be integer"),
  body("order_id").isString().escape().withMessage("Order ID must be a string"),
  body("title").isString().withMessage("title  be a string"),
  body("job_id").isString().withMessage("job_id must be a string"),
  body("content").isString().withMessage("content must be a string"),
  body("experience_date")
    .isString()
    .withMessage("experience_date must be a string"),
];

// exports.create = function (req, res) {
//   // Vérifier le LastReviewSubmitDate
//   LastReview.findOne({
//     where: {
//       userId: req.body.user_id,
//     },
//     order: [["createdAt", "DESC"]],
//   })
//     .then((lastReview) => {
//       if (lastReview) {
//         const currentTime = new Date();
//         const lastReviewSubmitDate = lastReview.LastReviewSubmitDate;
//         const timeDifference = currentTime - lastReviewSubmitDate;

//         if (timeDifference > 5 * 60 * 1000) {
//           // 5 minutes en millisecondes
//           // Enregistrer le merchant_review
//           merchant_review
//             .create({
//               rating: req.body.rating,
//               title: req.body.title,
//               experience_date: req.body.experienceDate,
//               content: req.body.content,
//               merchant_id: req.body.merchant_id,
//               job_id: req.body.job_id,
//               user_id: req.body.user_id,
//               order_id: req.body.order_id,
//               lang_id: req.body.lang_id,
//             })
//             .then((merchant) => {
//               if (merchant) {
//                 res.status(200).send("Merchant review created successfully");

//                 /****
//                  * Envoyer une notification par e-mail pour la soumission
//                  * */
//                 sendNotification(req.body.user_id);
//               } else {
//                 res.status(400).send("Merchant user not created");
//               }
//             })
//             .catch((error) => {
//               res.status(400).send("Error creating merchant review");
//             });
//         } else {
//           res
//             .status(400)
//             .send("Last review was submitted within the last 5 minutes");
//         }
//       } else {
//         merchant_review
//           .create({
//             rating: req.body.rating,
//             title: req.body.title,
//             experience_date: req.body.experienceDate,
//             content: req.body.content,
//             merchant_id: req.body.merchant_id,
//             job_id: req.body.job_id,
//             user_id: req.body.user_id,
//             order_id: req.body.order_id,
//             lang_id: req.body.lang_id,
//           })
//           .then((merchant) => {
//             //if user created, send success
//             if (merchant) {
//               res.status(200).send("Merchant review created successfully");

//               sendNotification(req.body.user_id);
//             }
//             //if user not created, send error
//             else {
//               res.status(400).send("Merchant user not created");
//             }
//           });
//       }
//     })
//     .catch((error) => {
//       res.status(400).send("Error finding last review");
//     });
// };

const { validationResult } = require("express-validator");

exports.create = [
  // Inclure les middlewares de validation
  ...validateReview,

  // La fonction de gestion de la requête
  async (req, res) => {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Vérifier le LastReviewSubmitDate
      const lastReview = await LastReview.findOne({
        where: {
          userId: req.body.user_id,
        },
        order: [["createdAt", "DESC"]],
      });

      const currentTime = new Date();

      if (lastReview) {
        const lastReviewSubmitDate = lastReview.createdAt;
        const timeDifference = currentTime - new Date(lastReviewSubmitDate);

        if (timeDifference > 5 * 60 * 1000) {
          // 5 minutes en millisecondes
          // Enregistrer le merchant_review
          const merchant = await merchant_review.create({
            rating: req.body.rating,
            title: req.body.title,
            experience_date: req.body.experience_date,
            content: req.body.content,
            merchant_id: req.body.merchant_id,
            job_id: req.body.job_id,
            user_id: req.body.user_id,
            order_id: req.body.order_id,
            lang_id: req.body.lang_id,
          });

          if (merchant) {
            res.status(200).send("Merchant review created successfully");
            // Envoyer une notification par e-mail pour la soumission
            sendNotification(req.body.user_id);
          } else {
            res.status(400).send("Merchant review not created");
          }
        } else {
          res
            .status(400)
            .send("Last review was submitted within the last 5 minutes");
        }
      } else {
        const merchant = await merchant_review.create({
          rating: req.body.rating,
          title: req.body.title,
          experience_date: req.body.experience_date,
          content: req.body.content,
          merchant_id: req.body.merchant_id,
          job_id: req.body.job_id,
          user_id: req.body.user_id,
          order_id: req.body.order_id,
          lang_id: req.body.lang_id,
        });

        if (merchant) {
          res.status(200).send("Merchant review created successfully");
          sendNotification(req.body.user_id);
        } else {
          res.status(400).send("Merchant review not created");
        }
      }
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  },
];

exports.findMerchantReviewById = function (req, res) {
  merchant_review.findOne({ where: { id: req.params.id } }).then((merchant) => {
    //if user created, send success
    if (merchant) {
      res.status(200).json(merchant);
    }
    //if user not created, send error
    else {
      res.status(400).send(" not created");
    }
  });
};

exports.findById = function (req, res) {
  merchant_review.findById(req.params.id, function (err, merchant_review) {
    if (err) res.send(err);
    res.json(merchant_review);
  });
};
exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    merchant_review.update(
      req.params.id,
      new merchant_review(req.body),
      function (err, merchant_review) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "merchant_review successfully updated",
        });
      }
    );
  }
};
exports.delete = function (req, res) {
  merchant_review.delete(req.params.id, function (err, merchant_review) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "merchant_review successfully deleted",
    });
  });
};

exports.updateMerchantReviewByJobId = function (req, res) {
  //create user
  var data = merchant_review
    .update(req.body, {
      where: {
        job_id: req.params["job_id"],
      },
    })
    .then((merchant) => {
      if (merchant) {
        res.status(200).send("merchant have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.findMerchantAndProductReviewsByTransactionId = function (req, res) {
  const transactionId = req.params.transaction_id;

  // Utilisation de Promise.all pour exécuter deux requêtes parallèles
  Promise.all([
    merchant_review.findAll({ where: { job_id: transactionId } }),
    product_review.findAll({ where: { job_id: transactionId } }),
  ])
    .then(([merchantReviews, productReviews]) => {
      // Ajoutez le champ "type" à chaque revue
      const merchantReviewsWithType = merchantReviews.map((merchantReview) => {
        return { ...merchantReview.toJSON(), type: "merchant_review" };
      });

      const productReviewsWithType = productReviews.map((productReview) => {
        return { ...productReview.toJSON(), type: "product_review" };
      });

      // Fusionnez les deux tableaux avec les champs "type" ajoutés
      const result = {
        reviews: [...merchantReviewsWithType, ...productReviewsWithType],
      };

      // Si au moins une critique est trouvée, renvoyez le résultat
      if (result.reviews.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).send("Aucune critique trouvée pour cette transaction.");
      }
    })
    .catch((error) => {
      // Gérez les erreurs potentielles ici
      console.error("Erreur lors de la recherche de critiques : ", error);
      res.status(500).send("Erreur interne du serveur");
    });
};

exports.findMerchantAndProductReviews = function (req, res) {
  // Utilisation de Promise.all pour exécuter deux requêtes parallèles
  Promise.all([merchant_review.findAll(), product_review.findAll()])
    .then(([merchantReviews, productReviews]) => {
      // Ajoutez le champ "type" à chaque revue
      const merchantReviewsWithType = merchantReviews.map((merchantReview) => {
        return { ...merchantReview.toJSON(), type: "merchant_review" };
      });

      const productReviewsWithType = productReviews.map((productReview) => {
        return { ...productReview.toJSON(), type: "product_review" };
      });

      // Fusionnez les deux tableaux avec les champs "type" ajoutés
      const result = {
        reviews: [...merchantReviewsWithType, ...productReviewsWithType],
      };

      // Si au moins une critique est trouvée, renvoyez le résultat
      if (result.reviews.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).send("Aucune critique trouvée pour cette transaction.");
      }
    })
    .catch((error) => {
      // Gérez les erreurs potentielles ici
      console.error("Erreur lors de la recherche de critiques : ", error);
      res.status(500).send("Erreur interne du serveur");
    });
};
