'use strict';
const { response } = require('express');
const { requestToBodyStream } = require('next/dist/server/body-streams');
//const userprofile = require('../models/merchantReview');
const db = require('../models/index')
const userprofile = db.userprofile;
exports.findAll = function(req, res) {
    userprofile.findAll(req.query.page ,req.query.site, function(err, userprofile) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', userprofile);
     // res.send(userprofile);
     
     const filters = req.query;
     const filteredUsers = userprofile.filter(user => {
        let isValid = true;
        for (var key in filters) {
          
          var keys_filr = filters[key].toString().split(',');
          if(key == 'rating')
                isValid = isValid && (keys_filr.includes(user[key].toString()));
                
        }
        return isValid;
      });
     
     res.render('pages-review',  { title: 'All reviews', merchantReviews: filteredUsers, webmerchant: req.query.site});
    });
};

/*exports.create = function(req, res) {
    const new_userprofile = new userprofile(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        userprofile.create(new_userprofile, function(err, userprofile) {
          if (err)
          res.send(err);
          res.json({error:false,message:"userprofile added successfully!",data:userprofile});
        });
    }
};
*/

exports.createuser =  function(req, res) {

  //create user
  userprofile.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: "password"

}).then((user) => {
    //if user created, send success
    if (user) {
        res.status(200).send('User created successfully');
    }
    //if user not created, send error
    else {
        res.status(400).send('User not created');
    }

  })

};

exports.getUsers = function(req, res) {

  userprofile.findAll().then((user)=>{

    if (user) {
      res.status(200).json(user);
      
    }
    //if productreview not created, send error
    else {
        res.status(400).send('error to select');
    }

  })


};

exports.finduserOrCreate = function(req, res) {

  userprofile.findOrCreate({
    where : {email: req.body.email},
    defaults: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: "password"
    }
  }).then((user)=>{

    if (user) {
      res.status(200).json(user);
      
    }
    //if productreview not created, send error
    else {
        res.status(400).send('error to select');
    }

  })


};



exports.getUserByEmail = async function(req, res) {

    var data = await userprofile.findOne({
         where: { email:"fatahouahamadi88@gmail.com" } 
    });

    return data;
    
  

};

exports.getUserByUsername = async function(req, res) {

  var data = userprofile.findOne({
    where : {email: req.query.username}
  })
if(data)
  {
    console.log(data);
    res.status(200).json(data);
    
  }
  //if productreview not created, send error
  else {
      res.status(400).send('error to select');
  }


};






exports.findById = function(req, res) {
    userprofile.findById(req.params.id, function(err, userprofile) {
      if (err)
      res.send(err);
      res.json(userprofile);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        userprofile.update(req.params.id, new userprofile(req.body), function(err, userprofile) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'userprofile successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    userprofile.delete( req.params.id, function(err, userprofile) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'userprofile successfully deleted' });
    });
};