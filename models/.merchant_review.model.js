'use strict';
var dbConn = require('../db.config');

//merchant_review object create
var merchant_review = function(merchant_review){
  this.rating          = merchant_review.rating;
  this.title           = merchant_review.title;
  this.experience_date = merchant_review.experience_date;
  this.order_id        = merchant_review.order_id;
  this.created_at     = new Date();
  this.updated_at     = new Date();
  this.status         = merchant_review.status;
  this.job_id        = merchant_review.job_id;
  this.user_id        = merchant_review.user_id;
  this.merchant_id        = merchant_review.merchant_id
  this.content        = merchant_review.content;
  
};

merchant_review.create = function (newmerchant_review, result) {
    dbConn.query("INSERT INTO merchant_review set ?", newmerchant_review, function (err, res) {
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

merchant_review.findById = function (id, result) {
    dbConn.query("Select * from merchant_review where id = ? ", id, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};

merchant_review.findAll = function (page,website,result) {
  
            dbConn.query("Select * from merchant_profile where website = ?", website, function (err, res) {
                if(err) {
                  console.log("error: ", err);
                  result(null, err);
                }
                else{

                        res.forEach(element => {
                            if(page > 0)
                            {
                              dbConn.query(`SELECT merchant_review.id, merchant_review.rating, merchant_review.title, merchant_review.content,
                              product_review.title as titreprodreview, product_review.content as contentpr,  product_review.rating as ratingp ,product_review.product_id as product_id,
                              CAST(merchant_review.experience_date AS DATE) as experienceDate ,user_profile.first_name, user_profile.last_name, (SELECT COUNT(*) FROM merchant_review WHERE merchant_review.user_id = user_profile.id) as Nbre, 
                              (SELECT FORMAT(SUM(merchant_review.rating) / COUNT(*), 1) FROM merchant_review WHERE merchant_review.merchant_id = '4f6750685-6ee7-49dd-b9e8-1f204b13db6a') as RatingMoy,
                              (SELECT transaction.hash_transaction FROM transaction WHERE transaction.id = merchant_review.job_id) as hash_transaction
                              FROM merchant_review INNER JOIN user_profile ON merchant_review.user_id = user_profile.id
                              INNER JOIN product_review ON merchant_review.order_id = product_review.order_id 
                              WHERE merchant_review.merchant_id = ? AND product_review.status = 'published' GROUP BY merchant_review.job_id
                              ORDER BY merchant_review.created_at DESC LIMIT 20 OFFSET ${page*20}`,'4f6750685-6ee7-49dd-b9e8-1f204b13db6a', function (error, resp) {
                                if(error) {
                                  console.log("error: ", error);
                                  result(null, error);
                                }
                                else{
                                  console.log('merchant_review : ', resp);
                                  result(null, resp);
                                }
                            });
                        
                           }
                           else
                           {
                              dbConn.query(`SELECT merchant_review.id, merchant_review.rating, merchant_review.title, merchant_review.content,
                              product_review.title as titreprodreview, product_review.content as contentpr,  product_review.rating as ratingp ,product_review.product_id as product_id,
                              CAST(merchant_review.experience_date AS DATE) as experienceDate ,user_profile.first_name, user_profile.last_name, (SELECT COUNT(*) FROM merchant_review WHERE merchant_review.user_id = user_profile.id) as Nbre, 
                              (SELECT FORMAT(SUM(merchant_review.rating) / COUNT(*), 1) FROM merchant_review WHERE merchant_review.merchant_id = '4f6750685-6ee7-49dd-b9e8-1f204b13db6a') as RatingMoy,
                              (SELECT transaction.hash_transaction FROM transaction WHERE transaction.id = merchant_review.job_id) as hash_transaction
                              FROM merchant_review INNER JOIN user_profile ON merchant_review.user_id = user_profile.id
                              INNER JOIN product_review ON merchant_review.order_id = product_review.order_id 
                              WHERE merchant_review.merchant_id = ? AND product_review.status='published'  GROUP BY merchant_review.id
                              ORDER BY merchant_review.created_at DESC LIMIT 20 OFFSET ${0*20}`,'4f6750685-6ee7-49dd-b9e8-1f204b13db6a', function (error, resp) {
                                if(error) {
                                  console.log("error: ", error);
                                  result(null, error);
                                }
                                else{
                                  console.log('merchant_review : ', resp);
                                  result(null, resp);
                                }
                            });
                           }
                
                    });
                }
            });
   

};

merchant_review.update = function(id, merchant_review, result){
    dbConn.query("UPDATE merchant_review SET title=? WHERE id = ?", [merchant_review.title, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
    dbConn.query("UPDATE merchant_review SET content=? WHERE id = ?", [merchant_review.content, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
};

merchant_review.delete = function(id, result){
    dbConn.query("DELETE FROM merchant_review WHERE id = ?", [id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          result(null, res);
        }
    });
};
module.exports= merchant_review;