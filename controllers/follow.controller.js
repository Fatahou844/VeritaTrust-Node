'use strict';

const {
  response
} = require('express');
const Op = require("sequelize").Op;
const db = require('../models/index');
const follow = db.follow;

/*
exports.createfollow = function (req, res) {
  //create foll
  follow.create(req.body).then(foll => {
    //if foll created, send success
    if (foll) {
      res.status(200).send('foll created successfully');
    }
    //if foll not created, send error
    else {
      res.status(400).send('foll not created');
    }
  });
};  */

exports.createfollow = function(req, res) {
  const { follower_userId, following_userId } = req.body;
  follow.upsert({
    follower_userId: follower_userId,
    following_userId: following_userId,
    status: "1" // définissez le statut sur 1 pour indiquer que la relation est active
  })
  .then(result => {
    if (result) {
      res.status(200).send('Relation suivie avec succès');
    } else {
      res.status(400).send('Erreur lors de la création de la relation');
    }
  })
  .catch(error => {
    res.status(500).send(error.message);
  });
};



exports.deleteFollow = function (req, res) {
  //update foll
  var data = follow.update(req.body, {
      where: {
            [Op.and]: [
              {
                  follower_userId : req.body.follower_userId },
              {   following_userId : req.body.following_userId },
            ],
          },
  }).then(foll => {
    if (foll) {
      res.status(200).send('follow have been deleted successfully');
    } else {
      res.status(400).send('error updated');
    }
  });
};

exports.getfollowbyuser =  function (req, res) {
  //update foll
  var data = follow.findAll( {
    where: {
      foll_id: req.params.id
    }
  }).then(foll => {
    if (foll) {
      res.status(200).json(foll);
    } else {
      res.status(400).send('error updated');
    }
  });
};


exports.getfollowers =  function (req, res) {
  //update foll
  var data = follow.findAll( {
    where: {
      following_userId: req.params.id,
      status : "1"
    }
  }).then(foll => {
    if (foll) {
      res.status(200).json(foll);
    } else {
      res.status(400).send('error');
    }
  });
};


exports.getfollowings =  function (req, res) {
  //update foll
  var data = follow.findAll( {
    where: {
      follower_userId : req.params.id,
      status : "1"
    }
  }).then(foll => {
    if (foll) {
      res.status(200).json(foll);
    } else {
      res.status(400).send('error');
    }
  });
};

exports.verifyUserIsFollowed =  function (req, res) {
  //update foll
  var data = follow.findOne( {
   
     where: {
            [Op.and]: [
              { following_userId : req.params.id },
              {follower_userId : req.query["followingId"] },
            ],
          },
          
  }).then(foll => {
    if (foll) {
      res.status(200).json(foll);
    } else {
      res.status(400).send('error');
    }
  });
};




