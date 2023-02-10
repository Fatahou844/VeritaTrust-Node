'use strict';
//const products = require('../models/merchantReview');
const db = require('../models/index')
const products = db.products;
const { Op } = require("sequelize");
exports.findAll = function(req, res) {
    products.findAll(req.query.page ,req.query.site, function(err, products) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', products);
     // res.send(products);
     
     const filters = req.query;
     const filteredUsers = products.filter(user => {
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
    const new_products = new products(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        products.create(new_products, function(err, products) {
          if (err)
          res.send(err);
          res.json({error:false,message:"products added successfully!",data:products});
        });
    }
};


exports.create2 = function(req, res) {

  //create merchantreview
  products.create({
    product_id: req.body.id,
    product_name: req.body.product_name,
    rating: req.body.rating,
    title: req.body.title,
    experience_date: req.body.experienceDate,
    content: req.body.content,
    merchant_id: "4f6750685-6ee7-49dd-b9e8-1f204b13db6a"
   
}).then((merchant) => {
    //if user created, send success
    if (merchant) {
        res.status(200).send('User created successfully');
    }
    //if user not created, send error
    else {
        res.status(400).send('User not created');
    }

  })

};

exports.getProductReview = function(req, res) {

  products.findAll().then((productreview)=>{

    if (productreview) {
      res.status(200).json(productreview);
      
    }
    //if productreview not created, send error
    else {
        res.status(400).send('error to select');
    }

  })


};

*/

exports.getProducts = function(req, res) {

    products.findAll().then((product)=>{
  
      if (product) {
        res.status(200).json(product);
        
      }
      //if productreview not created, send error
      else {
          res.status(400).send('error to select');
      }
  
    })
  
  
  };

  exports.getProductByProduct_name = function(req, res) {

    products.findOne({
        where: {
          product_name: req.params["product_name"]
        }
      }).then((product)=>{
  
      if (product) {
        res.status(200).json(product);
        
      }
      //if productreview not created, send error
      else {
          res.status(400).send('error to select');
      }
  
    })
  
  
  };

  exports.getProductByContainedWith = function(req, res) {

    products.findAll({
       
        where: {
          product_name: {
            [Op.like]: `%${req.query.q}%`
          }
        }
      }).then(productResult => {
        if (productResult) {
            res.status(200).json(productResult);
        } else {
            res.status(400).send('error to select');
        }
      });
  
  
  };


exports.findById = function(req, res) {
    products.findById(req.params.id, function(err, products) {
      if (err)
      res.send(err);
      res.json(products);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        products.update(req.params.id, new products(req.body), function(err, products) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'products successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    products.delete( req.params.id, function(err, products) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'products successfully deleted' });
    });
};