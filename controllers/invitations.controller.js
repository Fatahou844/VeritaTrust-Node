'use strict';
const invitations = require('../models/invitations.model');
exports.findAll = function(req, res) {
    invitations.findAll(function(err, invitations) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', invitations);
      res.send(invitations);
    });
};

exports.create = function(req, res) {
    const new_invitations = new invitations(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        invitations.create(new_invitations, function(err, invitations) {
          if (err)
          res.send(err);
          res.json({error:false,message:"invitations added successfully!",data:invitations});
        });
    }
};

exports.findByReference_number = function(req, res) {
    invitations.findByReference_number(req.params.Reference_number, function(err, invitations) {
      if (err)
      res.send(err);
      res.json(invitations);
    });
};



exports.delete = function(req, res) {
    invitations.delete( req.params.Reference_number, function(err, invitations) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'invitations successfully deleted' });
    });
};