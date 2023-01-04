'use strict';
var dbConn = require('../db.config');

//product_review object create
var product_review = function(product_review){
  this.rating          = product_review.rating;
  this.title           = product_review.title;
  this.experience_date = product_review.experience_date;
  this.order_id        = product_review.order_id;
  this.product_id      = product_review.product_id;
  this.product_name    = product_review.product_name;
  this.created_at     = new Date();
  this.updated_at     = new Date();
  this.status         = product_review.status;
  this.job_id        = product_review.job_id;
  this.user_id        = product_review.user_id;
  this.merchant_id        = product_review.merchant_id
  this.content        = product_review.content;
  this.image          = product_review.image;
  this.images_urls            = product_review.images_urls;
  
};

product_review.create = function (newproduct_review, result) {
    dbConn.query("INSERT INTO product_review set ?", newproduct_review, function (err, res) {
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

product_review.findById = function (id, result) {
    dbConn.query("Select * from product_review where id = ? ", id, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};

product_review.findAll = function (result) {
    dbConn.query("Select * from product_review", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('product_review : ', res);
      result(null, res);
    }
    });
};

product_review.update = function(id, product_review, result){
    dbConn.query("UPDATE product_review SET title=? WHERE id = ?", [product_review.title, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
    dbConn.query("UPDATE product_review SET content=? WHERE id = ?", [product_review.content, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
};

product_review.delete = function(id, result){
    dbConn.query("DELETE FROM product_review WHERE id = ?", [id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          result(null, res);
        }
    });
};
module.exports= product_review;