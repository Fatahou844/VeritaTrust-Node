'use strict';
//const organic_merchant_review = require('../models/merchantReview');
const db = require('../models/index')
const organic_merchant_review = db.organic_merchant_review;
exports.findAll = function(req, res) {
    organic_merchant_review.findAll(req.query.page ,req.query.site, function(err, organic_merchant_review) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', organic_merchant_review);
     // res.send(organic_merchant_review);
     
     const filters = req.query;
     const filteredUsers = organic_merchant_review.filter(user => {
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
    const new_organic_merchant_review = new organic_merchant_review(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        organic_merchant_review.create(new_organic_merchant_review, function(err, organic_merchant_review) {
          if (err)
          res.send(err);
          res.json({error:false,message:"organic_merchant_review added successfully!",data:organic_merchant_review});
        });
    }
};
*/

exports.create_org = function(req, res) {

  //create merchantreview
  organic_merchant_review.create({
    rating: req.body.rating,
    title: req.body.title,
    experience_date: req.body.experienceDate,
    content: req.body.content,
    merchant_id: "4f6750685-6ee7-49dd-b9e8-1f204b13db6a"
   
}).then((merchant) => {
    //if user created, send success
    if (merchant) {
        res.status(200).send('organic merchant review created successfully');
    }
    //if user not created, send error
    else {
        res.status(400).send(' not created');
    }

  })

};

exports.findById = function(req, res) {
    organic_merchant_review.findById(req.params.id, function(err, organic_merchant_review) {
      if (err)
      res.send(err);
      res.json(organic_merchant_review);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        organic_merchant_review.update(req.params.id, new organic_merchant_review(req.body), function(err, organic_merchant_review) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'organic_merchant_review successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    organic_merchant_review.delete( req.params.id, function(err, organic_merchant_review) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'organic_merchant_review successfully deleted' });
    });
};