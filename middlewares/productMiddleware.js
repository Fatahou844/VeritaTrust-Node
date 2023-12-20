const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require('../models/index');
const userprofile = db.userprofile;
const express = require('express');

const queries = require("../queries");
const {
  QueryTypes
} = require('sequelize');


const router = express.Router();
const baseUrl = 'http://api.veritatrust.com/api';
const BaseUrlInvitation = 'api.veritatrust.com';

router.get('/search', (req, res) => {
  const query = req.query.q;
  let sql = `(
        SELECT
            products.id,
            products.product_name,
            products.category_name,
            products.aw_image_url,
            "product" as "type",
            products.ReviewsNumber,
            products.ReviewMean,
            products.status
        FROM
            products
        WHERE
            products.product_name LIKE '%${query}%'
    )
    UNION ALL
        (
        SELECT
            merchant_profile.id,
            merchant_profile.website,
            merchant_profile.category_1,
            merchant_profile.logo,
            "merchant" as "type",
            merchant_profile.ReviewsNumber,
            merchant_profile.ReviewMean,
            merchant_profile.status
        FROM
            merchant_profile
        WHERE
            merchant_profile.name LIKE '%${query}%' OR merchant_profile.website LIKE '%${query}%'
    )`;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });

});

router.get('/search-by-category-parent-id/:category_parent_id', (req, res) => {
  const categoriesId = req.params.category_parent_id.split(",");

  let sql = `(
        SELECT
            products.id,
            products.product_name,
            products.category_id,
            products.aw_image_url,
            "product" as "type",
            products.ReviewsNumber,
            products.ReviewMean,
            products.PageViewsNb,
            products.Brand_id
        FROM
            products
        WHERE
            products.category_id IN (${categoriesId.join(', ')})
    
    )`;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });

});


module.exports = router;
