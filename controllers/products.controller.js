'use strict';

//const products = require('../models/merchantReview');
const db = require('../models/index');

const products = db.products;
const product_review = db.product_review;
const {
  Op, Sequelize
} = require("sequelize");
exports.findAll = function (req, res) {
  products.findAll(req.query.page, req.query.site, function (err, products) {
    console.log('controller');
    if (err) res.send(err);
    console.log('res', products);
    // res.send(products);

    const filters = req.query;
    const filteredUsers = products.filter(user => {
      let isValid = true;
      for (var key in filters) {
        var keys_filr = filters[key].toString().split(',');
        if (key == 'rating') isValid = isValid && keys_filr.includes(user[key].toString());
      }
      return isValid;
    });
    res.render('pages-review', {
      title: 'All reviews',
      merchantReviews: filteredUsers,
      webmerchant: req.query.site
    });
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

exports.getProducts = function (req, res) {
  products.findAll().then(product => {
    if (product) {
      res.status(200).json(product);
    }
    //if productreview not created, send error
    else {
      res.status(400).json(-1);
    }
  });
};
exports.getProductByProduct_name = function (req, res) {
  products.findOne({
    where: {
      product_name: req.params["product_name"]
    }
  }).then(product => {
    if (product) {
      res.status(200).json(product);
    }
    //if productreview not created, send error
    else {
      res.status(400).send('error to select');
    }
  });
};

exports.getProductByID2 = function (req, res) {
  products.findOne({
    where: {
      id: req.params["id"]
    }
  }).then(product => {
    if (product) {
      res.status(200).json(product);
    }
    //if productreview not created, send error
    else {
      res.status(400).send('-1');
    }
  });
};

exports.deleteProductByID = function (req, res) {
  products.destroy({
    where: {
      id: req.params["id"]
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted === 1) {
      res.status(200).send("Product deleted successfully");
    } else {
      res.status(404).send("Product not found");
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send("Internal server error");
  });
};


exports.getProductById = function (req, res) {
  products.findOne({
    where: {
      id: parseInt(req.params["product_name"][0])
    }
  }).then(product => {
    if (product) {
      res.status(200).json(product);
    }
    //if productreview not created, send error
    else {
      res.status(400).send('error to select');
    }
  });
};

exports.createNewProduct = async function (req, res) {
  try {
    const newProduct = await products.create(req.body);
    res.status(201).json(newProduct); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la création du produit');
  }
};
exports.getProductByContainedWith = function (req, res) {
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
      res.status(400).json(-1);
    }
  });
};
exports.findById = function (req, res) {
  products.findById(req.params.id, function (err, products) {
    if (err) res.send(err);
    res.json(products);
  });
};

exports.updateProduct = function (req, res) {

  products
    .findOne({
      where: {
        id: parseInt(req.params.product_name.split("-")[0]),
      },
    })
    .then((product) => {
      console.log(product);
      if (product) {
        products
          .update(
            { ReviewsNumber: product.ReviewsNumber + 1 },
            {
              where: {
                id: parseInt(req.params.product_name.split("-")[0]),
              },
            }
          )
          .then((p) => {
            console.log(p);
            if (p) {
              res.status(200).json(p);
            }
            //if user not created, send error
            else {
              res.status(400).send("error updated data");
            }
          });
      }
      //if user not created, send error
      else {
        res.status(400).send("error updated data");
      }
    });
         
};

exports.getRateMeanProductReview = function (req, res) {
  product_review.findAll({
    attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'average_rating']],
    where: {
        product_id: parseInt(req.params.product_name.split("-")[0])
    }
        })
        .then(result => {
            const averageRating = result[0].dataValues.average_rating;
            res.status(200).json(averageRating);
        })
        .catch(error => {
            console.error(error);
            res.status(400).send('error to select');
        });
    
};

exports.updateNbReviewsRMProduct = function (req, res) {
  product_review.findAll({
    attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'average_rating']],
    where: {
        product_id: parseInt(req.params.product_name.split("-")[0])
    }
        })
        .then(result => {
            const averageRating = result[0].dataValues.average_rating;
            //res.status(200).json(averageRating);
            
            /*********************************   ******************* /
             *
             *  Update Nbre reviews + Rate Mean
             *   */
               products
                    .findOne({
                      where: {
                        id: parseInt(req.params.product_name.split("-")[0]),
                      },
                    })
                    .then((product) => {
                      console.log(product);
                      if (product) {
                        products
                          .update(
                            { 
                              ReviewsNumber: product.ReviewsNumber + 1,
                              ReviewMean: averageRating
                            },
                            {
                              where: {
                                id: parseInt(req.params.product_name.split("-")[0]),
                              },
                            }
                          )
                          .then((p) => {
                            console.log(p);
                            if (p) {
                              res.status(200).json(p);
                            }
                            //if user not created, send error
                            else {
                              res.status(400).send("error updated data");
                            }
                          });
                      }
                      //if user not created, send error
                      else {
                        res.status(400).send("error updated data");
                      }
                    });
             
             /**  ######################################  */
        })
        .catch(error => {
            console.error(error);
            res.status(400).send('error to select');
        });
    
};

exports.updateProduct2 = function (req, res) {
  products
    .findOne({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((product) => {
      console.log(product);
      if (product) {
        products
          .update(req.body, {
            where: {
              id: parseInt(req.params.id),
            },
          })
          .then((p) => {
            console.log(p);
            if (p) {
              res.status(200).json(p);
            }
            //if user not created, send error
            else {
              res.status(400).send("error updated data");
            }
          });
      }
      //if user not created, send error
      else {
        res.status(400).send("error updated data");
      }
    });
};
