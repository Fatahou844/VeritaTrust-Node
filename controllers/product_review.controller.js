"use strict";

const db = require("../models/index");
const formidable = require("formidable");
const { sendNotification } = require("../service/sendNotification");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "drbhco8al",
  api_key: "774368471346458",
  api_secret: "c4AFA79NTUbJjDq8yWMpC8mjGGs",
});
const product_review = db.product_review;
const LastReview = db.LastReview;
const { body, validationResult } = require("express-validator");

const uploadImage = (path) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });
  });
};

const userprofile = db.userprofile;
const merchant_profile = db.merchant_profile;
const products = db.products;

exports.getproduct_reviews = function (req, res) {
  product_review
    .findAll({
      include: [
        {
          model: userprofile, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "first_name", "last_name"], // Sélectionnez les attributs que vous souhaitez inclure
        },
        {
          model: merchant_profile, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "name", "logo", "description", "website"], // Sélectionnez les attributs que vous souhaitez inclure
        },
        {
          model: products, // Remplacez Vehicule par le nom de votre modèle de véhicule
          attributes: ["id", "product_name"], // Sélectionnez les attributs que vous souhaitez inclure
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
              review_type: "1",
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
      res.status(500).json({ error: "product_reviews Internal server error" });
    });
};

exports.findAll = function (req, res) {
  product_review.findAll(
    req.query.page,
    req.query.site,
    function (err, product_review) {
      console.log("controller");
      if (err) res.send(err);
      console.log("res", product_review);
      // res.send(product_review);

      const filters = req.query;
      const filteredUsers = product_review.filter((user) => {
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
        productReviews: filteredUsers,
        webproduct: req.query.site,
      });
    }
  );
};

/* exports.create2 = function (req, res) {
  const form = new formidable.IncomingForm();
  // Parse `req` and upload all associated files
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(400).json("server error for data incomming [product review]");
    }
    console.log(fields["content"]);
    var image = "";
    var proofOfPurchase = "";
    if (files && Object.keys(files).length > 0) {
      for (var key in files) {
        image = image + "," + files[key]["filepath"];
      }
      image = image.substring(1); // Suppression du premier virgule

      uploadImage(image).then(url => {
        console.log(`Image uploaded to: ${url}`);
        // Vérifier le LastReviewSubmitDate
        LastReview.findOne({
          where: {
            userId: fields["user_id"]
          },
          order: [['createdAt', 'DESC']]
        }).then(lastReview => {
          if (lastReview) {
            const currentTime = new Date();
            const lastReviewSubmitDate = lastReview.LastReviewSubmitDate;
            const timeDifference = currentTime - lastReviewSubmitDate;

            if (timeDifference > 5 * 60 * 1000) { // 5 minutes en millisecondes
              // Créer le product_review
              createProductReview(res, fields, url, proofOfPurchase);
            } else {
              res.status(400).send('Last review was submitted within the last 5 minutes');
            }
          } else {
            // Créer le product_review
            createProductReview(res, fields, url, proofOfPurchase);
          }
        }).catch(error => {
          res.status(400).send('Error finding last review');
        });
      }).catch(error => {
        console.error(error);
      });
    } else {
      image = null;
      // Vérifier le LastReviewSubmitDate
      proofOfPurchase = null;
      LastReview.findOne({
        where: {
          userId: fields["user_id"]
        },
        order: [['createdAt', 'DESC']]
      }).then(lastReview => {
        if (lastReview) {
          const currentTime = new Date();
          const lastReviewSubmitDate = lastReview.LastReviewSubmitDate;
          const timeDifference = currentTime - lastReviewSubmitDate;

          if (timeDifference > 5 * 60 * 1000) { // 5 minutes en millisecondes
            // Créer le product_review
            createProductReview(res, fields, image, proofOfPurchase);
          } else {
            res.status(400).send('Last review was submitted within the last 5 minutes');
          }
        } else {
          // Créer le product_review
          createProductReview(res, fields, image, proofOfPurchase);
        }
      }).catch(error => {
        res.status(400).send('Error finding last review');
      });
    }
  });
}; */

exports.create2 = function (req, res) {
  const form = new formidable.IncomingForm();
  const uploadedUrls = []; // Créez une liste pour stocker les URLs des images téléchargées

  form.parse(req, function (err, fields, files) {
    if (err) {
      return res
        .status(400)
        .json("server error for data incoming [product review]");
    }

    if (files && Object.keys(files).length > 0) {
      const fileKeys = Object.keys(files);

      // Utilisez une fonction récursive pour télécharger chaque fichier
      function uploadFile(index) {
        if (index < fileKeys.length) {
          const key = fileKeys[index];
          const filepath = files[key].filepath;

          uploadImage(filepath)
            .then((url) => {
              console.log(`Image uploaded to: ${url}`);
              uploadedUrls.push(url); // Ajoutez l'URL à la liste

              // Continuez à télécharger les fichiers restants
              uploadFile(index + 1);
            })
            .catch((error) => {
              console.error(error);
              res.status(400).send("Error uploading image");
            });
        } else {
          // Tous les fichiers ont été téléchargés, continuez avec la logique de création de produit
          createProductReviewWithLastReviewCheck(
            res,
            fields,
            uploadedUrls.join(",")
          );
        }
      }

      // Commencez le téléchargement des fichiers en appelant la fonction récursive
      uploadFile(0);
    } else {
      // Aucun fichier n'a été téléchargé, continuez avec la logique de création de produit
      createProductReviewWithLastReviewCheck(res, fields, null);
    }
  });
};

function createProductReviewWithLastReviewCheck(res, fields, uploadedUrls) {
  // Vérifier le LastReviewSubmitDate
  LastReview.findOne({
    where: {
      userId: fields["user_id"],
    },
    order: [["createdAt", "DESC"]],
  })
    .then((lastReview) => {
      if (lastReview) {
        const currentTime = new Date();
        const lastReviewSubmitDate = lastReview.LastReviewSubmitDate;
        const timeDifference = currentTime - lastReviewSubmitDate;

        if (timeDifference > 5 * 60 * 1000) {
          // 5 minutes en millisecondes
          // Créer le product_review
          createProductReview(res, fields, uploadedUrls);
        } else {
          res
            .status(400)
            .send("Last review was submitted within the last 5 minutes");
        }
      } else {
        // Créer le product_review
        createProductReview(res, fields, uploadedUrls);
      }
    })
    .catch((error) => {
      res.status(400).send("Error finding last review");
    });
}

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

function createProductReview(res, fields, image, proofOfPurchase) {
  // Créer le product_review
  product_review
    .create({
      product_id: fields["product_id"],
      product_name: fields["product_name"],
      rating: fields["rating"],
      title: fields["title"],
      experience_date: fields["experienceDate"],
      content: fields["content"],
      merchant_id: fields["merchant_id"],
      user_id: fields["user_id"],
      job_id: fields["job_id"],
      order_id: fields["order_id"],
      image_video: image,
      lang_id: fields["lang_id"],
    })
    .then((product) => {
      //if user created, send success
      if (product) {
        res.status(200).send("organic product review created successfully");
        sendNotification(fields["user_id"]);
      }
      //if user not created, send error
      else {
        res.status(400).send(" not created");
      }
    });
}

exports.findProductReviewById = function (req, res) {
  product_review.findOne({ where: { id: req.params.id } }).then((product) => {
    //if user created, send success
    if (product) {
      res.status(200).json(product);
    }
    //if user not created, send error
    else {
      res.status(400).send(" not created");
    }
  });
};
exports.findById = function (req, res) {
  product_review.findById(req.params.id, function (err, product_review) {
    if (err) res.send(err);
    res.json(product_review);
  });
};
exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    product_review.update(
      req.params.id,
      new product_review(req.body),
      function (err, product_review) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "product_review successfully updated",
        });
      }
    );
  }
};
exports.delete = function (req, res) {
  product_review.delete(req.params.id, function (err, product_review) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "product_review successfully deleted",
    });
  });
};

exports.updateProductReviewById = function (req, res) {
  //create user
  var data = product_review
    .update(req.body, {
      where: {
        id: req.params["id"],
      },
    })
    .then((review) => {
      if (review) {
        res.status(200).send("merchant have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.updateProductReviewByProductId = function (req, res) {
  //create user
  var data = product_review
    .update(req.body, {
      where: {
        product_id: req.params["product_id"],
      },
    })
    .then((review) => {
      if (review) {
        res
          .status(200)
          .send("product product_id have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.updateProductReviewByJob_id = function (req, res) {
  //create user
  var data = product_review
    .update(req.body, {
      where: {
        job_id: req.params["job_id"],
      },
    })
    .then((review) => {
      if (review) {
        res.status(200).send("merchant have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};
