'use strict';
var dbConn = require('../db.config');

//user_profile object create
var user_profile = function(user_profile){
  this.id                   = user_profile.id;
  this.first_name          = user_profile.first_name;
  this.last_name           = user_profile.last_name;
  this.email =              user_profile.email;
  this.nickname        = user_profile.nickname;
  this.dateNaissance = user_profile.dateNaissance;
  this.localAdress        = user_profile.localAdress;
  this.phoneNumber        = user_profile.phoneNumber;
  this.wallet_id      = user_profile.wallet_id;
  this.created_at     = new Date();
  this.updated_at     = new Date();
  this.location         = user_profile.location;
  this.total_reward    = user_profile.total_reward;
  this.level_account   = user_profile.level_account;
};

user_profile.create = function (newuser_profile, result) {
    dbConn.query("INSERT INTO user_profile set ?", newuser_profile, function (err, res) {
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

user_profile.findById = function (id, result) {
    dbConn.query("Select * from user_profile where id = ? ", id, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};

user_profile.findByEmail = function (email, result) {
    dbConn.query("Select * from user_profile where email = ? ", email, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};

user_profile.findByWallet_id = function (wallet_id, result) {
    dbConn.query("Select * from user_profile where wallet_id = ? ", wallet_id, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};



user_profile.findAll = function (result) {
    dbConn.query("Select * from user_profile", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('user_profile : ', res);
      result(null, res);
    }
    });
};

user_profile.update = function(id, user_profile, result){
    dbConn.query("UPDATE user_profile SET first_name=? WHERE id = ?", [user_profile.first_name, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
    dbConn.query("UPDATE user_profile SET last_name=? WHERE id = ?", [user_profile.last_name, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
        dbConn.query("UPDATE user_profile SET email=? WHERE id = ?", [user_profile.email, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
        dbConn.query("UPDATE user_profile SET nickname=? WHERE id = ?", [user_profile.nickname, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
          dbConn.query("UPDATE user_profile SET wallet_id=? WHERE id = ?", [user_profile.wallet_id, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
          dbConn.query("UPDATE user_profile SET location=? WHERE id = ?", [user_profile.location, id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
    
};

user_profile.delete = function(id, result){
    dbConn.query("DELETE FROM user_profile WHERE id = ?", [id], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          result(null, res);
        }
    });
};
module.exports= user_profile;