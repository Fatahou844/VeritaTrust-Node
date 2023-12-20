'use strict';
//const merchant_review = require('../models/merchantReview');
const {sendNotification} = require('../service/sendNotification')
const db = require('../models/index');
const merchant_review = db.merchant_review;
const product_review = db.product_review;
const LastReview = db.LastReview;

exports.findAll = function (req, res) {
  merchant_review.findAll(req.query.page, req.query.site, function (err, merchant_review) {
    console.log('controller');
    if (err) res.send(err);
    console.log('res', merchant_review);
    // res.send(merchant_review);

    const filters = req.query;
    const filteredUsers = merchant_review.filter(user => {
      let isValid = true;
      for (var key in filters) {
        var keys_filr = filters[key].toString().split(',');
        if (key == 'rating') isValid = isValid && keys_filr.includes(user[key].toString());
      }
      return isValid;
    });
    res.render('pages-review', {
      title: 'All reviews',
      merchantReviews: filteredUsers,
      webmerchant: req.query.site
    });
  });
};

/*exports.create = function(req, res) {
    const new_merchant_review = new merchant_review(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        merchant_review.create(new_merchant_review, function(err, merchant_review) {
          if (err)
          res.send(err);
          res.json({error:false,message:"merchant_review added successfully!",data:merchant_review});
        });
    }
};
*/

/*

exports.create = function (req, res) {
  //create merchantreview
  merchant_review.create({
    rating: req.body.rating,
    title: req.body.title,
    experience_date: req.body.experienceDate,
    content: req.body.content,
    merchant_id: req.body.merchant_id,
    job_id: req.body.job_id,
    user_id: req.body.user_id,
    order_id: req.body.order_id
  }).then(merchant => {
    //if user created, send success
    if (merchant) {
      res.status(200).send('Merchant review created successfully');
      
     
       sendNotification(req.body.user_id)
       
    }
    //if user not created, send error
    else {
      res.status(400).send('Merchant user not created');
    }
  });
};  */

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

exports.create = function (req, res) {
  // Vérifier le LastReviewSubmitDate
  LastReview.findOne({
    where: {
      userId: req.body.user_id
    },
    order: [['createdAt', 'DESC']]
  }).then(lastReview => {
    if (lastReview) {
      const currentTime = new Date();
      const lastReviewSubmitDate = lastReview.LastReviewSubmitDate;
      const timeDifference = currentTime - lastReviewSubmitDate;

      if (timeDifference > 5 * 60 * 1000) { // 5 minutes en millisecondes
        // Enregistrer le merchant_review
        merchant_review.create({
          rating: req.body.rating,
          title: req.body.title,
          experience_date: req.body.experienceDate,
          content: req.body.content,
          merchant_id: req.body.merchant_id,
          job_id: req.body.job_id,
          user_id: req.body.user_id,
          order_id: req.body.order_id,
          lang_id: req.body.lang_id,

        }).then(merchant => {
          if (merchant) {
            res.status(200).send('Merchant review created successfully');
            
            /****
             * Envoyer une notification par e-mail pour la soumission
             * */
            sendNotification(req.body.user_id);
          } else {
            res.status(400).send('Merchant user not created');
          }
        }).catch(error => {
          res.status(400).send('Error creating merchant review');
        });
      } else {
        res.status(400).send('Last review was submitted within the last 5 minutes');
      }
    } else {
      merchant_review.create({
        rating: req.body.rating,
        title: req.body.title,
        experience_date: req.body.experienceDate,
        content: req.body.content,
        merchant_id: req.body.merchant_id,
        job_id: req.body.job_id,
        user_id: req.body.user_id,
        order_id: req.body.order_id,
        lang_id: req.body.lang_id,

      }).then(merchant => {
        //if user created, send success
        if (merchant) {
          res.status(200).send('Merchant review created successfully');
          
         
           sendNotification(req.body.user_id)
           
        }
        //if user not created, send error
        else {
          res.status(400).send('Merchant user not created');
        }
      });
    }
  }).catch(error => {
    res.status(400).send('Error finding last review');
  });
};


exports.findMerchantReviewById = function (req, res) {
    
        merchant_review.findOne({ where: { id: req.params.id } }).then(merchant => {
        //if user created, send success
        if (merchant) {
          res.status(200).json(merchant);
         
        }
        //if user not created, send error
        else {
          res.status(400).send(' not created');
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
      message: 'Please provide all required field'
    });
  } else {
    merchant_review.update(req.params.id, new merchant_review(req.body), function (err, merchant_review) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: 'merchant_review successfully updated'
      });
    });
  }
};
exports.delete = function (req, res) {
  merchant_review.delete(req.params.id, function (err, merchant_review) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: 'merchant_review successfully deleted'
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


