'use strict';
const merchant_review = require('../models/merchant_review.model');
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

exports.create = function(req, res) {
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