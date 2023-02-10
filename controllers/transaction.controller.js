'use strict';
const { response } = require('express');
const { requestToBodyStream } = require('next/dist/server/body-streams');
//const userprofile = require('../models/merchantReview');
const db = require('../models/index')
const transaction = db.transaction;
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

exports.createTransaction = async function(req, res) {

  //create user
  var data = transaction.create({
    user_id:  req.body.user_id,
    merchant_id: req.body.merchant_id,
    order_id: req.body.order_id
   
});
  return data;

};