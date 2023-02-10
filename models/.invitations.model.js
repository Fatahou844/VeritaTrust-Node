'use strict';
var dbConn = require('../db.config');

//invitations object create
var invitations = function(invitations){
  this.Reference_number    = invitations.Reference_number;
  this.customer_firstname           = invitations.customer_firstname;
  this.customer_lastname           = invitations.customer_lastname;
  this.Delivery_status          = invitations.Delivery_status;
  this.Created_at           = new Date();
  this.Sent_at             = new Date();
  this.Recipient           = invitations.Recipient;
  this.profile_id           = invitations.profile_id;
  this.invitation_url           = invitations.invitation_url;
  this.domaine_name           = invitations.domaine_name;
  this.message_id           = invitations.message_id;
  this.has_sent           = invitations.has_sent;
  
};

invitations.create = function (newinvitations, result) {
    dbConn.query("INSERT INTO invitations set ?", newinvitations, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      console.log(res.insertReference_number);
      result(null, res.insertReference_number);
    }
    });
};

invitations.findByReference_number = function (Reference_number, result) {
    dbConn.query("Select * from invitations where Reference_number = ? ", Reference_number, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
      result(null, res);
    }
    });
};


invitations.findAll = function (result) {
    dbConn.query("Select * from invitations", function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('invitations : ', res);
      result(null, res);
    }
    });
};


invitations.delete = function(Reference_number, result){
    dbConn.query("DELETE FROM invitations WHERE Reference_number = ?", [Reference_number], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }
        else{
          result(null, res);
        }
    });
};
module.exports= invitations;