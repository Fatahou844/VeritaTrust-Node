'use strict';
var dbConn = require('../db.config');
//const {coreAddress, delegateKey, hcaptchaToken } = require('./../api.config');

//merchant_profile object create
var merchant_profile = function(merchant_profile){
  this.name          = merchant_profile.name;
  this.description           = merchant_profile.description;
  this.logo = merchant_profile.logo;
  this.corporate_name        = merchant_profile.corporate_name;
  this.phone        = merchant_profile.phone;
  this.website        = merchant_profile.website;
  this.email        = merchant_profile.email;
  this.merchant_user_id = merchant_profile.merchant_user_id;
  this.country_id        = merchant_profile.country_id;
  this.city        = merchant_profile.city;
  this.zip_code        = merchant_profile.zip_code;
  this.created_at     = new Date();
  this.updated_at     = new Date();
  this.category_1        = merchant_profile.category_1;
  this.category_2        = merchant_profile.category_2;
  this.category_3        = merchant_profile.category_3;
  this.last_session        = merchant_profile.last_session;
  
  
};

merchant_profile.create = function (newmerchant_profile, result) {
    dbConn.query("INSERT INTO merchant_profile set ?", newmerchant_profile, function (err, res) {
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

merchant_profile.findByWebsite = function (website, result) {
    dbConn.query("Select * from merchant_profile where website = ? ", website, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};

merchant_profile.findAll = function (result) {
    dbConn.query("Select * from merchant_profile", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('merchant_profile : ', res);
      result(null, res);
    }
    });
};

merchant_profile.update = function(id, merchant_profile, result){
    dbConn.query("UPDATE merchant_profile SET corporate_name=? WHERE id = ?", [merchant_profile.corporate_name, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
    dbConn.query("UPDATE merchant_profile SET website=? WHERE id = ?", [merchant_profile.website, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
};

merchant_profile.delete = function(id, result){
    dbConn.query("DELETE FROM merchant_profile WHERE id = ?", [id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          result(null, res);
        }
    });
};
module.exports= merchant_profile;