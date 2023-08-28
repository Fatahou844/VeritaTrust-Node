"use strict";
const db = require("../models/index");
const Categories = db.categories;

// Retrieve all Categories from the database and their childs.

function findAllWithChildren(req, res) {
    // recursive query to get all categories and their children
    const sql = `WITH RECURSIVE mainCat AS (
  SELECT
    parent.google_category_id AS id,
    parent.vt_category AS name,
    parent.category_parent_id AS parent_category_id,
    parent.vt_category AS direct_parent_name,
    parent.vt_category AS route,
    0 AS level
  FROM
    vt_categories AS parent
  WHERE
    parent.category_parent_id IS NULL
  GROUP BY
    parent.vt_category
  
  UNION ALL
  
  SELECT
    children.google_category_id AS id,
    children.category_name AS name,
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
  mainCat;`
  
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


module.exports = {
    findAllWithChildren,
    getcategorybyId
}