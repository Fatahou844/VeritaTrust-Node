"use strict";
const db = require("../models/index");
const Categories = db.categories;
const {
  QueryTypes
} = require('sequelize');

// Retrieve all Categories from the database and their childs.

function findAllWithChildren(req, res) {

  
    const categoriesId = req.params.category_id.split(",");

  
  const sql =  `WITH RECURSIVE mainCat AS (
  SELECT
    parent.google_category_id AS id,
    parent.vt_category AS name,
    parent.category_name AS categoryName,
    parent.category_name AS category_name_en,
    parent.category_name_fr AS category_name_fr,
    parent.category_name_it AS category_name_it,
    parent.category_parent_id AS parent_category_id,
    parent.vt_category AS direct_parent_name,
    parent.vt_category AS route,
    0 AS level
  FROM
    vt_categories AS parent
  WHERE
    parent.category_parent_id IN (${categoriesId.join(', ')})
  
    
  
  UNION ALL
  
  SELECT
    children.google_category_id AS id,
    children.category_name AS name,
    NULL,
    children.category_name AS category_name_en,
    children.category_name_fr AS category_name_fr,
    children.category_name_it AS category_name_it,
    children.category_parent_id AS parent_category_id,
    mainCat.name AS direct_parent_name,
    CONCAT(mainCat.route, '-', children.category_name),
    mainCat.level + 1 AS level
  FROM
    mainCat
  INNER JOIN
    vt_categories AS children
  ON
    mainCat.id = children.category_parent_id
)

SELECT
  *
FROM
  mainCat
ORDER BY
  route; `
  
    db.sequelize.query(
        sql,
        {
            type: db.sequelize.QueryTypes.SELECT,
            model: Categories,
            mapToModel: true
        }
    ).then((categories) => {
        res.send(categories);
    })
}


function  getcategorybyId  (req, res) {
  //update foll
  var data = Categories.findOne( {
    where: {
      google_category_id : req.params.categorieId
    }
  }).then(category => {
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(400).send('category not found error');
    }
  });
}

function  getTopcategories  (req, res) {  
    
  const sql =  `SELECT vt_categories.google_category_id, vt_categories.category_name, vt_categories.category_name_fr, vt_categories.category_name_it, COUNT(*) AS total_reviews
            FROM vt_categories
            LEFT JOIN products ON vt_categories.google_category_id = products.category_id
            LEFT JOIN merchant_profile ON vt_categories.google_category_id = merchant_profile.category_1 
            LEFT JOIN product_review ON products.id = product_review.product_id
            LEFT JOIN merchant_review ON merchant_profile.id = merchant_review.merchant_id
            GROUP BY vt_categories.google_category_id
            ORDER BY total_reviews DESC
            LIMIT 10;`
              
     db.sequelize.query(sql, {
        type: QueryTypes.SELECT
      }).then(results => {
        console.log(results);
        res.json(results);
      });
}

function  getAdmincategorybyId  (req, res) {  
    
  const sql =  `WITH RECURSIVE CategoryHierarchy AS (
    SELECT
  
        google_category_id,
        vt_category,
        category_name,
        category_name_fr,
        category_name_it,
        category_parent_id,
        CAST(google_category_id AS CHAR(50)) AS category_id_path,
        CAST(category_name AS CHAR(255)) AS category_pathname,
        CAST(category_name_fr AS CHAR(255)) AS category_pathname_fr,
        CAST(category_name_it AS CHAR(255)) AS category_pathname_it


    FROM vt_categories
    WHERE google_category_id = ${req.params.categorieId}  

    UNION ALL

    SELECT
     
        c.google_category_id,
        c.vt_category,
        c.category_name,
        c.category_name_fr,
        c.category_name_it,
        c.category_parent_id,
        CONCAT(ch.category_id_path, ' > ', c.google_category_id), 
        CONCAT(ch.category_pathname, ' > ', c.category_name),
        CONCAT(ch.category_pathname_fr, ' > ', c.category_name_fr),
        CONCAT(ch.category_pathname_it, ' > ', c.category_name_it)
    FROM vt_categories c
    JOIN CategoryHierarchy ch ON c.google_category_id = ch.category_parent_id 
)
SELECT
    google_category_id,
    vt_category,
    category_name,
    category_name_fr,
    category_name_it,
    category_parent_id,
    category_id_path AS concatenated_id_path,
    category_pathname AS concatenated_pathname,
    category_pathname_fr AS concatenated_pathname_fr,
    category_pathname_it AS concatenated_pathname_it
FROM CategoryHierarchy

WHERE category_parent_id = 0
ORDER BY category_id_path;`
  
     db.sequelize.query(sql, {
        type: QueryTypes.SELECT
      }).then(results => {
        console.log(results);
        res.json(results);
      });
}




module.exports = {
    findAllWithChildren,
    getcategorybyId,
    getAdmincategorybyId,
    getTopcategories
}