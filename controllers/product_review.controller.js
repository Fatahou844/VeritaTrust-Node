'use strict';

const db = require('../models/index');
const formidable = require('formidable');
const {sendNotification} = require('../service/sendNotification');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dnbpmsofq',
  api_key: '369583817998179',
  api_secret: 'yNX8NjrsLYJ7u96J9MW6XBAUIJg'
});
const product_review = db.product_review;
const LastReview = db.LastReview;

const uploadImage = path => {
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
exports.findAll = function (req, res) {
  product_review.findAll(req.query.page, req.query.site, function (err, product_review) {
    console.log('controller');
    if (err) res.send(err);
    console.log('res', product_review);
    // res.send(product_review);

    const filters = req.query;
    const filteredUsers = product_review.filter(user => {
      let isValid = true;
      for (var key in filters) {
        var keys_filr = filters[key].toString().split(',');
        if (key == 'rating') isValid = isValid && keys_filr.includes(user[key].toString());
      }
      return isValid;
    });
    res.render('pages-review', {
      title: 'All reviews',
      productReviews: filteredUsers,
      webproduct: req.query.site
    });
  });
};

/*exports.create = function(req, res) {
    const new_product_review = new product_review(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        product_review.create(new_product_review, function(err, product_review) {
          if (err)
          res.send(err);
          res.json({error:false,message:"product_review added successfully!",data:product_review});
        });
    }
};
*/

/*

exports.create2 = function (req, res) {
      const form = new formidable.IncomingForm();
  // Parse `req` and upload all associated files
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(400).json("server error for data incomming [product review]");
    }
    console.log(fields["content"]);
    var image = "";
    if (files && Object.keys(files).length > 0) {
      for (var key in files) {
        image = image + "," + files[key]["filepath"];
      }
      image = image.substring(1); // Suppression du premier virgule

      uploadImage(image).then(url => {
        console.log(`Image uploaded to: ${url}`);
        //create productreview
        product_review.create({
          product_id: fields["product_id"],
          product_name: fields["product_name"],
          rating: fields["rating"],
          title: fields["title"],
          experience_date: fields["experienceDate"],
          content: fields["content"],
          merchant_id: "4f6750685-6ee7-49dd-b9e8-1f204b13db6a",
          user_id: fields["user_id"],
          job_id: fields["job_id"],
          order_id: fields["order_id"],
          image_video: url
        }).then(product => {
          //if user created, send success
          if (product) {
            res.status(200).send('organic product review created successfully');
            
               sendNotification(fields["user_id"]);
          }
          //if user not created, send error
          else {
            res.status(400).send(' not created');
          }
        });
      }).catch(error => {
        console.error(error);
      });
    } else {
      image = null;
      //create productreview
     product_review.create({
        product_id: fields["product_id"],
          product_name: fields["product_name"],
          rating: fields["rating"],
          title: fields["title"],
          experience_date: fields["experienceDate"],
          content: fields["content"],
          merchant_id: "4f6750685-6ee7-49dd-b9e8-1f204b13db6a",
          user_id: fields["user_id"],
          job_id: fields["job_id"],
          order_id: fields["order_id"],
          image_video: image
      }).then(product => {
        //if user created, send success
        if (product) {
          res.status(200).send('organic product review created successfully');
               sendNotification(fields["user_id"]);
        }
        //if user not created, send error
        else {
          res.status(400).send(' not created');
        }
      });
    }
  });
};

*/

exports.create2 = function (req, res) {
  const form = new formidable.IncomingForm();
  // Parse `req` and upload all associated files
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.status(400).json("server error for data incomming [product review]");
    }
    console.log(fields["content"]);
    var image = "";
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
              createProductReview(res, fields, url);
            } else {
              res.status(400).send('Last review was submitted within the last 5 minutes');
            }
          } else {
            // Créer le product_review
            createProductReview(res, fields, url);
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
            createProductReview(res, fields, image);
          } else {
            res.status(400).send('Last review was submitted within the last 5 minutes');
          }
        } else {
          // Créer le product_review
          createProductReview(res, fields, image);
        }
      }).catch(error => {
        res.status(400).send('Error finding last review');
      });
    }
  });
};

function createProductReview(res, fields, image) {
  // Créer le product_review
  product_review.create({
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
    image_video: image
  }).then(product => {
    //if user created, send success
    if (product) {
      res.status(200).send('organic product review created successfully');
      sendNotification(fields["user_id"]);
    }
    //if user not created, send error
    else {
      res.status(400).send(' not created');
    }
  });
}



exports.findProductReviewById = function (req, res) {
    
        product_review.findOne({ where: { id: req.params.id } }).then(product => {
        //if user created, send success
        if (product) {
          res.status(200).json(product);
         
        }
        //if user not created, send error
        else {
          res.status(400).send(' not created');
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
      message: 'Please provide all required field'
    });
  } else {
    product_review.update(req.params.id, new product_review(req.body), function (err, product_review) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: 'product_review successfully updated'
      });
    });
  }
};
exports.delete = function (req, res) {
  product_review.delete(req.params.id, function (err, product_review) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: 'product_review successfully deleted'
    });
  });
};