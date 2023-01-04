'use strict';
const product_review = require('../models/product_review.model');
exports.findAll = function(req, res) {
    product_review.findAll(function(err, product_review) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', product_review);
      res.send(product_review);
    });
};

exports.create = function(req, res) {
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

exports.findById = function(req, res) {
    product_review.findById(req.params.id, function(err, product_review) {
      if (err)
      res.send(err);
      res.json(product_review);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        product_review.update(req.params.id, new product_review(req.body), function(err, product_review) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'product_review successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    product_review.delete( req.params.id, function(err, product_review) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'product_review successfully deleted' });
    });
};