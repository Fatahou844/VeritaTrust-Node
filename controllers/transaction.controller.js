'use strict';
const transaction = require('../models/transaction.model');
exports.findAll = function(req, res) {
    transaction.findAll(function(err, transaction) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', transaction);
      res.send(transaction);
    });
};

exports.create = function(req, res) {
    const new_transaction = new transaction(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        transaction.create(new_transaction, function(err, transaction) {
          if (err)
          res.send(err);
          res.json({error:false,message:"transaction added successfully!",data:transaction});
        });
    }
};

exports.findById = function(req, res) {
    transaction.findById(req.params.id, function(err, transaction) {
      if (err)
      res.send(err);
      res.json(transaction);
    });
};

exports.delete = function(req, res) {
    transaction.delete( req.params.id, function(err, transaction) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'transaction successfully deleted' });
    });
};