'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");

const brand = db.Brand;

exports.getBrandSearch = function (req, res) {
  const searchTerm = req.params.q;
    const categoriesId = req.params.Category_id.split(",");


 brand.findAll({
  where: {
    Brand_name: {
      [Op.like]: `%${searchTerm}%`,
    },
    Category_id: {
      [Op.in]: categoriesId,
    }
  },
})
.then((brand) => {
  console.log(brand);
  if (brand) {
    res.status(200).json(brand);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "Brands Internal server error" });
});

    
  
};  

exports.getBrands = function (req, res) {


 brand.findAll()
.then((brand) => {
  console.log(brand);
  if (brand) {
    res.status(200).json(brand);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "Brands Internal server error" });
});

    
  
};  


exports.createBrand = function (req, res) {

    brand.create({
      Brand_name: req.body.Brand_name,
      Category_id: req.body.Category_id
    })
    .then((brand) => {
      console.log(brand);
      if (brand) {
        res.status(200).json(brand);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Brands Internal server error" });
    });

};  

exports.getBrandById = function (req, res) {
  const Brand_id = req.params.id;

  brand
    .findOne({
      where: {
        id: Brand_id,
      },
    })
    .then((brand) => {
      console.log(brand);
      if (brand) {
        res.status(200).json(brand);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Brands Internal server error" });
    });
};

exports.updateBrand = function (req, res) {
  brand
    .findOne({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((product) => {
      console.log(product);
      if (product) {
        brand
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

