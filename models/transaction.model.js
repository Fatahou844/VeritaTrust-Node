'use strict';
var dbConn = require('../db.config');

//transaction object create
var transaction = function(transaction){
  this.id          = transaction.id;
  this.user_id           = transaction.user_id;
  this.merchant_id = transaction.merchant_id;
  this.order_id        = transaction.order_id;
  this.hash_transaction        = transaction.hash_transaction;
};

transaction.create = function (newtransaction, result) {
    dbConn.query("INSERT INTO transaction set ?", newtransaction, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      console.log(res.insertId);
      result(null, res.insertId);
    }
    });
};

transaction.findById = function (id, result) {
    dbConn.query("Select * from transaction where id = ? ", id, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};


transaction.findAll = function (result) {
    dbConn.query("Select * from transaction", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('transaction : ', res);
      result(null, res);
    }
    });
};

transaction.delete = function(id, result){
    dbConn.query("DELETE FROM transaction WHERE id = ?", [id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          result(null, res);
        }
    });
};
module.exports= transaction;