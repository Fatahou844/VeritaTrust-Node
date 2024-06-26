const LocalStrategy = require("passport-local").Strategy;
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require('../models/index');
const userprofile = db.userprofile;
const express = require('express');
const passport = require('passport');
const bcrypt = require("bcrypt");
const { sendConfirmation } = require("../service/sendConfirmation");
const { newUserConfirmation } = require("../service/newUserConfirmation");
const { resetPasswordNotif } = require("../service/resetPasswordNotif");
const { passwordNotifUpdate } = require("../service/passwordNotifUpdate");
const {
  createmerchantprofile,
  getMerchants,
  getUserByWebsite
} = require('../controllers/merchant_profile.controller');
const CryptoJS = require('crypto-js');
const queries = require("../queries");
const {
  QueryTypes
} = require('sequelize');


const router = express.Router();


router.get('/search-by-categoryname/:category_name', (req, res) => {
  const query = req.params.category_name;
  
  const fullSQL = queries.getProductsMerchantprofileByCategorie(query);

  db.sequelize.query(fullSQL, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });
});

router.get('/lastreview-caroussel', (req, res) => {
 
  
  const fullSQL = queries.getLastReviewCaroussel();

  db.sequelize.query(fullSQL, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  }); 
  
});

router.get('/search-by-category/:categoryid', (req, res) => {
  const categoryId = req.params.categoryid;

  // Requête pour obtenir le nom de la catégorie en utilisant l'ID
  const getCategoryNameQuery = `
    SELECT * FROM vt_categories WHERE google_category_id = ${categoryId};
  `;

  db.sequelize.query(getCategoryNameQuery, {
    type: QueryTypes.SELECT
  }).then(categoryResult => {
    if (categoryResult.length === 0) {
      // La catégorie n'existe pas, renvoyer une réponse appropriée
      res.status(404).json({ error: 'Category not found' });
    } else {
      let categoryName = categoryResult[0].category_name;
      
      if(categoryResult[0].category_parent_id)
          categoryName = categoryResult[0].category_name;
      else 
         categoryName = categoryResult[0].vt_category;

      const fullSQL = queries.getProductsMerchantprofileByCategorie(categoryName);

      db.sequelize.query(fullSQL, {
        type: QueryTypes.SELECT
      }).then(results => {
        console.log(results);
        res.json(results);
      });
    }
  }).catch(error => {
    // Gérer les erreurs de requête
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  });
});

router.get('/search-categories-item/:category_parent_id', (req, res) => {
  const item = req.query.q;
  const categoriesId = req.params.category_parent_id.split(",");
    
  // Requête pour obtenir le nom de la catégorie en utilisant l'ID
  const lang = req.query.lang || 'en';
  
  let columnToSearch = 'category_name'; // Colonne par défaut

  // Déterminez quelle colonne utiliser en fonction de la langue
  if (lang === 'fr') {
    columnToSearch = 'category_name_fr';
  } else if (lang === 'it') {
    columnToSearch = 'category_name_it';
  }
  
  const fullSQL = `WITH RECURSIVE CategoryHierarchy AS (
  SELECT
    google_category_id,
    vt_category,
    category_name,
    category_name_fr,
    category_name_it,
    category_parent_id
  FROM
    vt_categories
  WHERE
    google_category_id IN (${categoriesId.join(', ')})
  UNION ALL
  SELECT
    c.google_category_id,
    c.vt_category,
    c.category_name,
    c.category_name_fr,
    c.category_name_it,
    c.category_parent_id
  FROM
    vt_categories AS c
  JOIN
    CategoryHierarchy AS ch ON c.category_parent_id = ch.google_category_id
)
SELECT
  google_category_id,
  vt_category,
  category_name,
  category_name_fr,
  category_name_it,
  category_parent_id
FROM
  CategoryHierarchy
WHERE
  ${columnToSearch} LIKE '%${item}%';
  `;
  
   db.sequelize.query(fullSQL, {
        type: QueryTypes.SELECT
      }).then(results => {
        console.log(results);
        res.json(results);
      });
});

router.get('/search-categories-items/:category_parent_id', (req, res) => {
  const item = req.query.q;
  const categoriesId = req.params.category_parent_id.split(",");
    
  // Requête pour obtenir le nom de la catégorie en utilisant l'ID
 

  const fullSQL = `WITH RECURSIVE CategoryHierarchy AS (
  SELECT
    google_category_id,
    vt_category,
    category_name,
    category_name_fr,
    category_name_it,
    category_parent_id
  FROM
    vt_categories
  WHERE
    google_category_id IN (${categoriesId.join(', ')})
  UNION ALL
  SELECT
    c.google_category_id,
    c.vt_category,
    c.category_name,
    c.category_name_fr,
    c.category_name_it,
    c.category_parent_id
  FROM
    vt_categories AS c
  JOIN
    CategoryHierarchy AS ch ON c.category_parent_id = ch.google_category_id
)
SELECT
  google_category_id,
  vt_category,
  category_name,
  category_name_fr,
  category_name_it,
  category_parent_id
FROM
  CategoryHierarchy;
  `;
  
   db.sequelize.query(fullSQL, {
        type: QueryTypes.SELECT
      }).then(results => {
        console.log(results);
        
        
        res.json(results);
      });
});



router.get('/productsearch', (req, res) => {
  const query = req.query.q;
  let sql = `
        SELECT
            products.id,
            products.product_name,
            products.aw_image_url,
            products.category_name,
            products.category_id,
            products.Brand_id,
            products.ReviewsNumber,
            products.ReviewMean
        FROM
            products
        WHERE
            products.id =  ${query}
    `;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });

});

router.get('/measmerchant', (req, res) => {
  const query = req.query.merchant_id;
  let sql = `SELECT
    m.id AS merchantId,
    m.website AS merchantName,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'reviewType', 'merchant_review',
            'reviewId', mr.id,
            'reviewText', mr.content,
            'reviewTitle', mr.title,
            'reviewRating', mr.rating,
            'source', mr.source,
            'order_id', mr.order_id,
            'isAnswered', mr.isAnswered,
            'addShowCase', mr.addShowCase,
            'favorite', mr.favorite,
            'createdAt', mr.createdAt,
            'user', JSON_OBJECT(
                'userId', mu.id,
                'userName', mu.nickname
            ),
            'merchant', JSON_OBJECT(
                'merchantId', m.id,
                'merchantName', m.website
            ),
            'responses', (
                SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'responseId', rr.id,
                            'responseText', rr.content,
                            'responseType', rr.ReviewType,
                            'createdAt', rr.createdAt
                        )
                    )
                FROM
                    ReviewResponse rr
                WHERE
                    rr.ReviewId = mr.id AND rr.ReviewType = 'merchant_review'
            )
        )
    ) AS merchantReviews,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'reviewType', 'product_review',
            'reviewId', pr.id,
            'reviewText', pr.content,
            'reviewTitle', pr.title,
            'reviewRating', pr.rating,
             'source', pr.source,
            'order_id', pr.order_id,
            'isAnswered', pr.isAnswered,
            'addShowCase', pr.addShowCase,
            'favorite', pr.favorite,
            'createdAt', pr.createdAt,
            'user', JSON_OBJECT(
                'userId', pu.id,
                'userName', pu.nickname
            ),
            'merchant', JSON_OBJECT(
                'merchantId', m.id,
                'merchantName', m.website
            ),
            'responses', (
                SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'responseId', rr.id,
                            'responseText', rr.content,
                            'responseType', rr.ReviewType,
                            'createdAt', rr.createdAt
                        )
                    )
                FROM
                    ReviewResponse rr
                WHERE
                    rr.ReviewId = pr.id AND rr.ReviewType = 'product_review'
            )
        )
    ) AS productReviews
FROM
    merchant_profile m
LEFT JOIN
    merchant_review mr ON m.id = mr.merchant_id
LEFT JOIN
    userprofile mu ON mr.user_id = mu.id
LEFT JOIN
    product_review pr ON m.id = pr.merchant_id AND mr.user_id = pr.user_id
LEFT JOIN
    userprofile pu ON pr.user_id = pu.id
WHERE
    m.id = ${query}`;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
      // Parcourir chaque élément du tableau
        for (let i = 0; i < results.length; i++) {
          // Convertir les chaînes JSON en objets JSON
          results[i].merchantReviews = JSON.parse(results[i].merchantReviews);
          results[i].productReviews = JSON.parse(results[i].productReviews);
        
          // Créer un nouvel objet avec les valeurs correctes
          results[i] = {
            merchantId: results[i].merchantId,
            merchantName: results[i].merchantName,
            reviews: {
              merchantReviews: results[i].merchantReviews,
              productReviews: results[i].productReviews
            }
          };
        }
    res.json(results);
  });

});


router.get('/users/resultsfiltered', (req, res) => {
  const query = req.query.q;
  let sql = `
        SELECT
            userprofile.id,
            userprofile.first_name,
            userprofile.last_name
          
        FROM
            userprofile
        WHERE
            userprofile.nickname LIKE '${query}%'
    `;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });

});

router.get('/organic-merchant-review/:website', function (req, res) {
  
  let sql = "";

  let params = [];
  if (req.query.stars) {
    sql = `SELECT merchant_review.id, merchant_review.rating, merchant_review.lang_id, merchant_review.title, merchant_review.content, merchant_review.order_id,   merchant_review.job_id, merchant_review.isAnswered, merchant_review.merchant_id, merchant_review.createdAt, CAST(merchant_review.experience_date AS DATE) as experienceDate, userprofile.id as userid, 
        userprofile.first_name, userprofile.last_name, userprofile.level_account, userprofile.profile_url ,(SELECT COUNT(*) FROM merchant_review WHERE merchant_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(merchant_review.rating) / COUNT(*), 1)  FROM merchant_review ) as RM FROM merchant_review INNER JOIN userprofile ON merchant_review.user_id = userprofile.id

        WHERE merchant_review.merchant_id = (SELECT u.id FROM merchant_profile as u WHERE u.website = '${req.params["website"]}') AND merchant_review.status = 'published'`;
    var a = req.query.stars.split(",");
    sql += " AND ( rating = " + a[0].toString();
    for (var item = 1; item < a.length; item++) {
      sql += " OR rating = " + a[item].toString();
    }

    sql += " ) ORDER BY merchant_review.createdAt DESC";
    params.push(a);
    console.log(a);
  } else {
    sql = queries.getMerchantReviewsByWebsite(req.params.website);

    console.log("params");
  }

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });


});

router.get('/merchant-review/:id', (req, res) => {
  var reviewsData = [];
  let sql = "";
  let params = [];
  if (req.query.stars) {
    sql = `SELECT
        merchant_review.id,
        merchant_review.rating,
        merchant_review.title,
        merchant_review.content,
        product_review.title AS titreprodreview,
        product_review.image_video AS image_video,
        product_review.content AS contentpr,
        product_review.rating AS ratingp,
        product_review.product_id AS product_id,
        CAST(
            merchant_review.experience_date AS DATE
        ) AS experienceDate,
        CAST(
            merchant_review.createdAt AS DATE
        ) AS createdAt,
        userprofile.first_name,
        userprofile.last_name,
        (
        SELECT
            COUNT(*)
        FROM
            merchant_review
        WHERE
            merchant_review.user_id = userprofile.id
    ) AS Nbre,
    (
        SELECT
            FORMAT(
                SUM(merchant_review.rating) / COUNT(*),
                1
            )
        FROM
            merchant_review
        WHERE
            merchant_review.merchant_id = '${req.params['id']}'
    ) AS RatingMoy,
    (
        SELECT transaction.hash_transaction
    FROM transaction
    WHERE transaction.transaction_id = merchant_review.job_id
    ) AS hash_transaction
    FROM
        merchant_review
    INNER JOIN userprofile ON merchant_review.user_id = userprofile.id
    INNER JOIN product_review ON merchant_review.order_id = product_review.order_id
    WHERE
        merchant_review.merchant_id = '${req.params['id']}' AND product_review.status = 'published'
    `;
    var a = req.query.stars.split(",");
    sql += ' AND ( merchant_review.rating = ' + a[0].toString();
    for (var item = 1; item < a.length; item++) {
      sql += ' OR merchant_review.rating = ' + a[item].toString();
    }
    sql += ' ) GROUP BY merchant_review.id ORDER BY  merchant_review.createdAt DESC  LIMIT 20 OFFSET 0';
    params.push(a);
    console.log(a);
  } else {
    sql = `SELECT
        merchant_review.id,
        merchant_review.rating,
        merchant_review.title,
        merchant_review.content,
        product_review.title AS titreprodreview,
        product_review.image_video AS image_video,
        product_review.content AS contentpr,
        product_review.rating AS ratingp,
        product_review.product_id AS product_id,
        CAST(
            merchant_review.experience_date AS DATE
        ) AS experienceDate,
        CAST(
            merchant_review.createdAt AS DATE
        ) AS createdAt,
        userprofile.first_name,
        userprofile.last_name,
        (
        SELECT
            COUNT(*)
        FROM
            merchant_review
        WHERE
            merchant_review.user_id = userprofile.id
    ) AS Nbre,
    (
        SELECT
            FORMAT(
                SUM(merchant_review.rating) / COUNT(*),
                1
            )
        FROM
            merchant_review
        WHERE
            merchant_review.merchant_id = '${req.params['id']}'
    ) AS RatingMoy,
    (
        SELECT transaction.hash_transaction
    FROM transaction
    WHERE transaction.transaction_id = merchant_review.job_id
    ) AS hash_transaction
    FROM
        merchant_review
    INNER JOIN userprofile ON merchant_review.user_id = userprofile.id
    INNER JOIN product_review ON merchant_review.order_id = product_review.order_id
    WHERE
        merchant_review.merchant_id = '${req.params['id']}' AND product_review.status = 'published'
    GROUP BY
        merchant_review.id
    ORDER BY
        merchant_review.createdAt
    DESC
    LIMIT 20 OFFSET 0`;
    console.log("params");
  }
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });

});
router.get('/data/merchantreview/merchantreview/:id', (req, res) => {

  let sql = "";

  sql = queries.getMerchantReviewsById(req.params["id"]);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/data/findproductreview/:orderid', (req, res) => {

  let sql = "";

  sql = queries.getProductReviewByOrderId(req.params["orderid"]);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/data/productreview/productreview/:id', (req, res) => {

  let sql = "";

  sql = queries.getProductReviewById(req.params["id"]);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/suggestusers/:userid', (req, res) => {

  let sql = "";

  sql = queries.getTopSuggestionsUsersToFollow(req.params["userid"]);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/data/follow/followings/search/:userid', (req, res) => {

  let sql = "";

  sql = queries.getFollowingsFilteredByName(req.params["userid"], req.query.q);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/data/follow/followers/search/:userid', (req, res) => {

  let sql = "";

  sql = queries.getFollowersFilteredByName(req.params["userid"], req.query.q);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/suggestusersfollowers/:userid', (req, res) => {

  let sql = "";

  sql = queries.getSuggestionsUsersToFollow(req.params["userid"]);

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/organic-product-review/:product_id', (req, res) => {

  let sql = "";

  let params = [];
  if (req.query.stars) {
    sql = `SELECT product_review.id, product_review.image_video, product_review.lang_id ,product_review.product_name, (select products.aw_image_url from products where products.id = '${req.params["product_id"]}') as product_image ,product_review.rating, product_review.title, product_review.content, product_review.order_id, product_review.product_id, product_review.job_id, product_review.createdAt, CAST(product_review.experience_date AS DATE) as experienceDate , userprofile.id as userid, userprofile.first_name, userprofile.last_name, userprofile.level_account, userprofile.profile_url ,(SELECT COUNT(*) FROM product_review WHERE product_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(product_review.rating) / COUNT(*), 1)  FROM product_review WHERE product_review.product_id = '${req.params["product_id"]}') as RM FROM product_review INNER JOIN userprofile ON product_review.user_id = userprofile.id WHERE product_review.product_id = '${req.params["product_id"]}' AND product_review.status = 'published'`;

    var a = req.query.stars.split(",");
    sql += " AND ( rating = " + a[0].toString();
    for (var item = 1; item < a.length; item++) {
      sql += " OR rating = " + a[item].toString();
    }

    sql += " ) ORDER BY product_review.createdAt DESC";
    params.push(a);
    console.log(a);
  } else {
    sql = queries.getProductReviewsByProduct_Id(req.params["product_id"]);
    console.log("params");
  }

  db.sequelize.query(sql, { type: QueryTypes.SELECT }).then((results) => {
    console.log(results);
    res.json(results);
  });
  
});

router.get('/lreview-dashboard/:id', function(req, res) {

    var reviewsData = [];
    const id = req.params["id"];

    mysqlquery(id, function(err, data) {

        console.log(data);
                            
        res.json(data);
   
    })  

  //  res.json(reviewsData);

});

function mysqlquery(id, callback)
{
    
     var sqli = ` SELECT
     *
 FROM
     (
         (
         SELECT
             product_review.id,
             product_review.rating,
             product_review.title,
             product_review.status AS statu,
             product_review.createdAt AS Created,
             product_review.product_name,
             product_review.image_video,
             product_review.content,
             product_review.job_id,

             "product_review" as review_type,
             "1" as review_reward,
             
             1 * (SELECT count(*) FROM product_review WHERE product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) + 1 * (SELECT count(*) FROM merchant_review WHERE merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}'))  as total,
             
             1 * (SELECT count(*) FROM product_review WHERE product_review.status = 'pending' AND product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) +  1 * (SELECT count(*) FROM merchant_review WHERE merchant_review.status = 'pending' AND merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}'))as total_pending,
         
             1 * (SELECT count(*) FROM product_review WHERE product_review.status = 'published' AND product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) +  1 * (SELECT count(*) FROM merchant_review WHERE merchant_review.status = 'published' AND merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) as total_published,
             CAST(
                 product_review.experience_date AS DATE
             ) AS experienceDate,
             (
                 SELECT transaction.hash_transaction
             FROM transaction
         WHERE transaction.transaction_id = product_review.job_id LIMIT 1 
             ) AS hash_transaction,
             (
             SELECT
                 SUM(reward.reward_value)
             FROM
                 reward
             WHERE
                 reward.User_id =(
                 SELECT
                     u.id
                 FROM
                     userprofile AS u
                 WHERE
                     u.id = '${id}'
             )
         ) AS total_reward, 
         
          (
             SELECT userprofile.first_name
         FROM userprofile
     WHERE userprofile.id = '${id}'
         ) AS first_name,
             
                     (
             SELECT userprofile.last_name
         FROM userprofile
     WHERE userprofile.id = '${id}'
         ) AS last_name,
             
                     (
             SELECT userprofile.level_account
         FROM userprofile
     WHERE userprofile.id = '${id}'
         ) AS level_account
     FROM
         product_review
     INNER JOIN userprofile ON product_review.user_id = userprofile.id
 
     WHERE
         userprofile.id =(
         SELECT
             u.id
         FROM
             userprofile AS u
         WHERE
             u.id = '${id}'
     ) 
 GROUP BY
     product_review.id
     )
 UNION ALL
     (
     SELECT
         merchant_review.id,
         merchant_review.rating,
         merchant_review.title,
         merchant_review.status AS statu,
         merchant_review.createdAt AS Created,

         merchant_review.merchant_id AS product_name,
         '' AS image,
         merchant_review.content,
         merchant_review.job_id,
         "merchant_review" as review_type,
         "1" as review_reward,
         
           1 * (SELECT count(*) FROM product_review WHERE product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) + 1 * (SELECT count(*) FROM merchant_review WHERE merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}'))  as total,
             
             1 * (SELECT count(*) FROM product_review WHERE product_review.status = 'pending' AND product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) +  1 * (SELECT count(*) FROM merchant_review WHERE merchant_review.status = 'pending' AND merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}'))as total_pending,
         
          1 * (SELECT count(*) FROM product_review WHERE product_review.status = 'published' AND product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) +  1 * (SELECT count(*) FROM merchant_review WHERE merchant_review.status = 'published' AND merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.id = '${id}')) as total_published,
         
             CAST(
             merchant_review.experience_date AS DATE
         ) AS experienceDate,
         (
             SELECT transaction.hash_transaction
         FROM transaction
     WHERE transaction
         .id = merchant_review.job_id
         ) AS hash_transaction,
         (
         SELECT
             SUM(reward.reward_value)
         FROM
             reward
         WHERE
             reward.User_id =(
             SELECT
                 u.id
             FROM
                 userprofile AS u
             WHERE
                 u.id = '${id}'
         )
     ) AS total_reward,
     
      (
             SELECT userprofile.first_name
         FROM userprofile
     WHERE userprofile.id = '${id}'
         ) AS first_name,
             
                     (
             SELECT userprofile.last_name
         FROM userprofile
     WHERE userprofile.id = '${id}'
         ) AS last_name,
             
                     (
             SELECT userprofile.level_account
         FROM userprofile
     WHERE userprofile.id = '${id}'
         ) AS level_account
     
 FROM
     merchant_review
 INNER JOIN userprofile ON merchant_review.user_id = userprofile.id
 
 WHERE
     userprofile.id =(
     SELECT
         u.id
     FROM
         userprofile AS u
     WHERE
         u.id = '${id}'
 ) 
 GROUP BY
     merchant_review.id
 ORDER BY
     merchant_review.createdAt
 )
     ) results
 ORDER BY
     Created
 DESC
 
     `

                db.sequelize.query(sqli, { type: QueryTypes.SELECT }).then(results => {
                    console.log(results);
                    callback(null,results);
                });
                
} 

module.exports = router;
