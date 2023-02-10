'use strict';
//const merchant_review = require('../models/merchantReview');
const db = require('../models/index')
const merchant_review = db.merchant_review;
exports.findAll = function(req, res) {
    merchant_review.findAll(req.query.page ,req.query.site, function(err, merchant_review) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', merchant_review);
     // res.send(merchant_review);
     
     const filters = req.query;
     const filteredUsers = merchant_review.filter(user => {
        let isValid = true;
        for (var key in filters) {
          
          var keys_filr = filters[key].toString().split(',');
          if(key == 'rating')
                isValid = isValid && (keys_filr.includes(user[key].toString()));
                
        }
        return isValid;
      });
     
     res.render('pages-review',  { title: 'All reviews', merchantReviews: filteredUsers, webmerchant: req.query.site});
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

exports.create = function(req, res) {

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

}).then((merchant) => {
    //if user created, send success
    if (merchant) {
        res.status(200).send('Merchant review created successfully');
    }
    //if user not created, send error
    else {
        res.status(400).send('Merchant user not created');
    }

  })

};

exports.findById = function(req, res) {
    merchant_review.findById(req.params.id, function(err, merchant_review) {
      if (err)
      res.send(err);
      res.json(merchant_review);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        merchant_review.update(req.params.id, new merchant_review(req.body), function(err, merchant_review) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'merchant_review successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    merchant_review.delete( req.params.id, function(err, merchant_review) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'merchant_review successfully deleted' });
    });
};