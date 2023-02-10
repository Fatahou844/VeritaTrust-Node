const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const sequelize = require('sequelize');
const multer = require('multer')
const db = require('./models/index');
const {create,findAll }= require('./controllers/merchant_review.controller');
const {create2} = require('./controllers/product_review.controller');
const {getProducts, getProductByProduct_name, getProductByContainedWith} = require('./controllers/products.controller');   
const {create_org} = require('./controllers/organic_merchant_review.controller');
const {create_product_org} = require('./controllers/organic_product_review.controller');
const {createuser, getUserByEmail, finduserOrCreate, getUserByUsername} = require('./controllers/userprofile.controller');
const {createmerchantprofile, getMerchants, getUserByWebsite} = require('./controllers/merchant_profile.controller');
const {createendpointurl} = require('./controllers/endpointurl.controller');
const {createInvitation, getInvitations} = require('./controllers/invitations.controller');

const { QueryTypes } = require('sequelize');
const axios = require('axios');
const uuid = require('uuid');
const CryptoJS = require('crypto-js');
const { createTransaction } = require('./controllers/transaction.controller');
require('./service/sendInvitation').emailInvitation;
//require('./service/sendProductInvitations').emailProductInvitation;


const app = express();
const port = 4000;
const baseUrl ='http://localhost:4000';
const BaseUrlInvitation = 'http://localhost:3000';
app.db = db;


app.use(express.json());


const allowedDomains = ["ws://localhost:4000/","http://localhost:3000","https://bamboo.bodyguard.ai/api/analyze","https://bamboo.bodyguard.ai/",baseUrl+"","http://store.fatasoft-consulting.com/",
"http://dev.veritatrust.com","http://localhost:4000/","https://www.google.com","https://hcaptcha.com/siteverify", "https://store.fatasoft-consulting.com/"];

app.use(cors({
  origin: allowedDomains,
  credentials: true
}));

app.db.sequelize.authenticate({logging: false}).then(() => {
    console.log('Connected to the database');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
})

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});


app.post('/data/merchant-review', create_org); 
app.post('/data/findorcreate-user', finduserOrCreate);
app.post('/data/product-review', create2);
app.post('/data/user-data', createuser);
app.post('/data/organic-product-review', create_product_org);
app.get('/data/merchant-review', findAll);
//app.get('/data/product-review', getProductReview);   
app.get('/data/products', getProducts);
app.get('/data/one-product/:product_name', getProductByProduct_name);
app.get('/data/search-result', getProductByContainedWith);
app.get('/data/invitationdata/', getInvitations);
app.get('/data/userdata', getUserByEmail); //getUserByUsername
app.get('/data/userinfos', getUserByUsername);
app.post('/data/merchantreview-invitation', create);

app.get('/api/products/:product_name', (req, res) => {

   var sql = "SELECT * FROM products where product_name = ?"; 

  connection.query(sql,req.params['product_name'] ,function (err, rows) {
    if(err) {
      console.log("error: ", err);
      res.status(500).json({error: 'Error retrieving data'});
      return;
    }
    
    res.json(rows);
    });


});

// Définissez une route pour récupérer les données depuis la base de données
app.get('/data/:product_name', (req, res) => {

  connection.query(`SELECT organic_product_review.id, organic_product_review.image_video ,organic_product_review.product_name, (select products.aw_image_url from products where products.product_name = ?) as product_image ,organic_product_review.rating, organic_product_review.title, organic_product_review.content, organic_product_review.hash_transaction, CAST(organic_product_review.experience_date AS DATE) as experienceDate ,userprofile.first_name, userprofile.last_name, userprofile.level_account ,(SELECT COUNT(*) FROM organic_product_review WHERE organic_product_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(organic_product_review.rating) / COUNT(*), 1)  FROM organic_product_review WHERE organic_product_review.product_name = ?) as RM FROM organic_product_review INNER JOIN userprofile ON organic_product_review.user_id = userprofile.id WHERE organic_product_review.product_name = ? ORDER BY organic_product_review.createdAt DESC`, [req.params['product_name'], req.params['product_name'],  req.params['product_name']] ,function (err, rows) {
    if(err) {
      console.log("error: ", err);
      res.status(500).json({error: 'Error retrieving data'});
      return;
    }
    
    res.json(rows);
    });

});

app.get('/search', (req, res) => {

    const query = req.query.q;

    let sql = `(
        SELECT
            products.product_name,
            "product" as "type"
        FROM
            products
        WHERE
            products.product_name LIKE '%${query}%'
    )
    UNION ALL
        (
        SELECT
            merchant_profile.website,
            "merchant" as "type"
        FROM
            merchant_profile
        WHERE
            merchant_profile.name LIKE '%${query}%'
    )` ;

    db.sequelize.query(sql, { type: QueryTypes.SELECT }).then(results => {
        console.log(results);
        res.json(results);
    });

    /*connection.query(sql ,function (err, result) {
        if(err) {
          console.log("error: ", err);
          
        }
        
        else{
                result.forEach(element => {
                    productlist.push(
                    {
                        product_name: element.product_name,
                        type: element.type    
                    }
                );
                
                });
                
               console.log(productlist);
               res.json(productlist);
              //  ws.send(JSON.stringify(reviewsData ));            
            }
        });  */

      

});

app.get('/lreview-dashboard', function(req, res) {

    var reviewsData = [];

    mysqlquery("fatahouahamadi88@gmail.com", function(err, data) {

        console.log(data);
                            
        res.json(data);
   
    })  

  //  res.json(reviewsData);

});

app.get('/organic-merchant-review/:website', function(req, res) {
    
    var reviewsData = [];

    let sql = "";
    
    let params = [];
    if(req.query.stars)
    {
        sql = `SELECT organic_merchant_review.id, organic_merchant_review.rating, organic_merchant_review.title, organic_merchant_review.content, CAST(organic_merchant_review.experience_date AS DATE) as experienceDate, organic_merchant_review.hash_transaction,
        userprofile.first_name, userprofile.last_name, userprofile.level_account ,(SELECT COUNT(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(organic_merchant_review.rating) / COUNT(*), 1)  FROM organic_merchant_review ) as RM FROM organic_merchant_review INNER JOIN userprofile ON organic_merchant_review.user_id = userprofile.id

        WHERE organic_merchant_review.merchant_id = (SELECT u.id FROM merchant_profile as u WHERE u.website = '${req.params["website"]}') AND organic_merchant_review.status = 'published'`;
        var a = req.query.stars.split(",");
        sql += ' AND ( rating = '+ a[0].toString();
        for(var item=1; item<a.length; item++)
        {
            sql += ' OR rating = '+ a[item].toString();
        }

        sql += ' ) ORDER BY organic_merchant_review.createdAt DESC LIMIT 10';
        params.push(a);
        console.log(a);

    } 

    else
    {
        sql = `SELECT organic_merchant_review.id, organic_merchant_review.rating, organic_merchant_review.title, organic_merchant_review.content, CAST(organic_merchant_review.experience_date AS DATE) as experienceDate, organic_merchant_review.hash_transaction,
        userprofile.first_name, userprofile.last_name, userprofile.level_account ,(SELECT COUNT(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(organic_merchant_review.rating) / COUNT(*), 1)  FROM organic_merchant_review ) as RM FROM organic_merchant_review INNER JOIN userprofile ON organic_merchant_review.user_id = userprofile.id
        WHERE organic_merchant_review.merchant_id = (SELECT u.id FROM merchant_profile as u WHERE u.website = '${req.params["website"]}' ) AND organic_merchant_review.status = 'published' ORDER BY organic_merchant_review.createdAt DESC`;

        console.log("params");
    }

    var sqli = "SELECT * FROM userprofile WHERE 1";

    db.sequelize.query(sql, { type: QueryTypes.SELECT }).then(results => {
        console.log(results);
        res.json(results);
    });

   /*  connection.query(sql, req.params["website"] ,function (err, result) {
     if(err) {
       console.log("error: ", err);
       
     }
     
     else{
             result.forEach(element => {
             reviewsData.push(
                 {
                     rating: element.rating,
                     title: element.title,
                     experienceDate: element.experienceDate,
                     hash_transaction: element.hash_transaction,
                     first_name: element.first_name,
                    last_name: element.last_name,
                    Nbre: element.Nbre,
                    RM: element.RM
                 }
             );
             
             });
             
             res.json(reviewsData);
                 
             
      
          
         }
     }); */

// res.render("pages-review.ejs");

});

app.get('/api/merchant-review/:id', (req, res) => {

    var reviewsData = [];
    let sql = "";
    
    let params = [];
    if(req.query.stars)
    {
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
    WHERE transaction
        .id = merchant_review.job_id
    ) AS hash_transaction
    FROM
        merchant_review
    INNER JOIN userprofile ON merchant_review.user_id = userprofile.id
    INNER JOIN product_review ON merchant_review.order_id = product_review.order_id
    WHERE
        merchant_review.merchant_id = '${req.params['id']}' AND product_review.status = 'published'
    `;
        
        var a = req.query.stars.split(",");
        sql += ' AND ( merchant_review.rating = '+ a[0].toString();
        for(var item=1; item<a.length; item++)
        {
            sql += ' OR merchant_review.rating = '+ a[item].toString();
        }

        sql += ' ) GROUP BY merchant_review.id ORDER BY  merchant_review.createdAt DESC  LIMIT 20 OFFSET 0';
        params.push(a);
        console.log(a);

    } 

    else
    {
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
    WHERE transaction
        .id = merchant_review.job_id
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

    db.sequelize.query(sql, { type: QueryTypes.SELECT }).then(results => {
        console.log(results);
        res.json(results);
       });
  
       
    /*   
    connection.query(sql, [req.params['id'], req.params['id'] ] ,function (err, result) {
         if(err) {
           console.log("error: ", err);
           
         }
         
         else{
                 result.forEach(element => {
                 reviewsData.push(
                     {
                         rating: element.rating,
                         title: element.title,
                         content: element.content,
                         titreprodreview: element.titreprodreview,
                         contentpr: element.contentpr,
                         ratingp: element.ratingp,
                         product_id: element.product_id,
                         experienceDate: element.experienceDate,
                         first_name: element.first_name,
                         last_name: element.last_name,
                         Nbre: element.Nbre,
                         RatingMoy: element.RatingMoy,
                         hash_transaction: element.hash_transaction
                         
                     }
                 );
                 
                 });

                console.log(reviewsData);
                 
                res.json(reviewsData);
                     
                 
             }
         }); */
   


});


app.get('/organic-product-review/:product_name', (req, res) => {

    var reviewsData = [];
    let sql = "";
    
    let params = [];
    if(req.query.stars)
    {
        sql = `SELECT organic_product_review.id, organic_product_review.image_video ,organic_product_review.product_name, (select products.aw_image_url from products where products.product_name = '${req.params['product_name']}') as product_image ,organic_product_review.rating, organic_product_review.title, organic_product_review.content, organic_product_review.hash_transaction, CAST(organic_product_review.experience_date AS DATE) as experienceDate ,userprofile.first_name, userprofile.last_name, userprofile.level_account ,(SELECT COUNT(*) FROM organic_product_review WHERE organic_product_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(organic_product_review.rating) / COUNT(*), 1)  FROM organic_product_review WHERE organic_product_review.product_name = '${req.params['product_name']}') as RM FROM organic_product_review INNER JOIN userprofile ON organic_product_review.user_id = userprofile.id WHERE organic_product_review.product_name = '${req.params['product_name']}'`;
        
        var a = req.query.stars.split(",");
        sql += ' AND ( rating = '+ a[0].toString();
        for(var item=1; item<a.length; item++)
        {
            sql += ' OR rating = '+ a[item].toString();
        }

        sql += ' ) ORDER BY organic_product_review.createdAt DESC';
        params.push(a);
        console.log(a);

    } 

    else
    {
        sql = `SELECT organic_product_review.id, organic_product_review.image_video ,organic_product_review.product_name,
         (select products.aw_image_url from products where products.product_name = '${req.params['product_name']}') as product_image ,organic_product_review.rating,
          organic_product_review.title, organic_product_review.content, organic_product_review.hash_transaction, CAST(organic_product_review.experience_date AS DATE) as experienceDate ,
          userprofile.first_name, userprofile.last_name, userprofile.level_account ,(SELECT COUNT(*) FROM organic_product_review WHERE organic_product_review.user_id = userprofile.id) as Nbre, (SELECT FORMAT(SUM(organic_product_review.rating) / COUNT(*), 1)  FROM organic_product_review WHERE organic_product_review.product_name = '${req.params['product_name']}') as RM FROM organic_product_review INNER JOIN userprofile ON organic_product_review.user_id = userprofile.id WHERE organic_product_review.product_name = '${req.params['product_name']}' ORDER BY organic_product_review.createdAt DESC`;
        console.log("params");
    }

    
 

   db.sequelize.query(sql, { type: QueryTypes.SELECT }).then(results => {
    console.log(results);
    res.json(results);
   });
  
  }); 

async function fetchData(url) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

app.post('/api/order/confirmed', async function (req, res){

    const {email, firstname, lastname, orderId, website, products} =  req.body;
    var jobId = uuid.v4();
    var userID;
    const slqinsert =  ` INSERT IGNORE INTO userprofile 
    (first_name, last_name, email, createdAt, updatedAt) 
       VALUES 
    ('${firstname}', "${lastname}", "${email}", '${new Date()}', '${new Date()}')`; 
    db.sequelize.query(slqinsert, { type: QueryTypes.INSERT }).then(results => {
       // console.log(results);
    });

   // const data = await getUserByEmail();
  //  const data = await axios.get('http//localhost:4000/data/userinfos/?username='+email);
    const data = await db.sequelize.query(`SELECT * FROM userprofile WHERE email = '${email}'`, { type: QueryTypes.SELECT });

    console.log("data***************************************************************************");
    console.log(data[0]["id"]);

    res.send("it's okay");

});



app.post('/order/confirmed', async function (req, res) {
       
    const {email, firstname, lastname, orderId, website, products} =  req.body;
   // console.log(req.body);
    var jobId = uuid.v4();
    var userID;
    const slqinsert =  ` INSERT IGNORE INTO userprofile 
    (first_name, last_name, email, createdAt, updatedAt) 
       VALUES 
    ('${firstname}', "${lastname}", "${email}", '${new Date()}', '${new Date()}')`; 
    db.sequelize.query(slqinsert, { type: QueryTypes.INSERT }).then(async (results) => {
       // console.log(results);
          //  const data = await getUserByEmail();
    const data = await db.sequelize.query(`SELECT * FROM userprofile WHERE email = '${email}'`, { type: QueryTypes.SELECT });
    //  const data = await axios.get('http//localhost:4000/data/userinfos/?username='+email);
  
     // const data = await fetchData('http//localhost:4000/data/userinfos/?username='+email);
      console.log("data***************************************************************************");
      console.log(data);
      
      if(data.length > 0)
     {
  
      userID = data[0]["id"];
      console.log(userID);
  
      var prodIDs = products[0]["productId"];
    //  console.log(prodIDs);
      for(var item = 1; item<products.length; item++)
      {
         prodIDs = prodIDs + "," + products[item]["productId"].toString();
      }
      let text = "jobId="+jobId+"&userid="+userID+"&website="+website+"&orderid="+orderId+"&productid="+ prodIDs;    
  
      //const encrypt_params = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  
      //var invitations_url = baseUrl+"/merchant_review_form?jobId="+jobId+"&userid="+userID+"&website="+website+"&orderid="+orderId+"&productid="+ prodIDs;    
      var invitations_url = BaseUrlInvitation+"/merchant_review_form?" + text;
      /****
       * creation de url pour les products reviews
       * ajouté le 10 10 2022
       * */
       
       var images = products[0]["image"];
       var names = products[0]["name"];
      for(var ele = 1; ele<products.length; ele++)
      {
         images = images + "," + products[ele]["image"].toString();
         names = names + "," + products[ele]["name"].toString();
      }
  
      let text2 = "jobId="+jobId+"&userid="+userID+"&website="+website+"&orderid="+orderId+"&productid="+ prodIDs+"&image="+images+"&name="+names;    
      
      //var invitations_url_for_products = baseUrl+"/page-product_reviews?"+ encrypt_params2;
      var invitations_url_for_products = BaseUrlInvitation+"/page-product_reviews?"+ text2;
    
  
      const merchantprofile = await getUserByWebsite();
    
      var merchantID = merchantprofile.dataValues["id"];                  
      var domaine_Name = website.replace('www.',''); // Eliminer le www. pour avoir le nom de domaine
      // Send invitations
      const endpoint_id = uuid.v4(); 
      const url_invi = BaseUrlInvitation+"/mreview/"+endpoint_id;
      const url_invi_prod = BaseUrlInvitation+"/preview/"+endpoint_id;
  
  
      const sql =  `INSERT INTO endpoint_url (endpoint, hash_urls, hash_url_product) VALUES ('${endpoint_id}','${url_invi}','${url_invi_prod}') `;
  
      db.sequelize.query(sql, { type: QueryTypes.INSERT }).then(results => {
      });
  
      var ref_number = "VTM-" + orderId;
      var ref_number_2 = "VTP-" + orderId;
  
      [ref_number_2, firstname, lastname, "Not delivered", "product_review", email, merchantID, url_invi_prod, invitations_url_for_products,domaine_Name, 0, ref_number, firstname, lastname, "Not delivered", "merchant_review", email, merchantID, url_invi,invitations_url, domaine_Name, 0]
  
      const sqlInvi =  `INSERT INTO invitations (Reference_number, customer_firstname, customer_lastname, Delivery_status,invitation_type ,Recipient, profile_id, invitation_url,invitation_url_complete, domaine_name, has_sent) VALUES 
      ('${ref_number}','${firstname}','${lastname}','Not delivered','merchant_review','${email}','${merchantID}','${url_invi}','${invitations_url}','${domaine_Name}',0), 
      ('${ref_number_2}','${firstname}','${lastname}','Not delivered','product_review','${email}','${merchantID}','${url_invi_prod}','${invitations_url_for_products}','${domaine_Name}',0)`;
  
      db.sequelize.query(sqlInvi, { type: QueryTypes.INSERT }).then(results => {
  
      })
  
      const sqlTran = `INSERT INTO transaction (user_id, merchant_id, order_id, transaction_id) VALUES ('${userID}','${merchantID}','${orderId}', '${jobId}')`;
      db.sequelize.query(sqlTran, { type: QueryTypes.INSERT }).then(results => {
          
      })
  
    }
    });

    

    res.send(req.body);

});
  
  


// Démarrez le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 



/*

server.listen(port, () => {
  console.log(`websocket Server running at http://localhost:${port}`);
}); */


function mysqlquery(email, callback)
{
     var reviewsData = [];
     var sqli = `SELECT
     *
 FROM
     (
         (
         SELECT
             organic_product_review.id,
             organic_product_review.rating,
             organic_product_review.title,
             organic_product_review.createdAt AS Created,
             organic_product_review.product_name,
             organic_product_review.image_video,
             organic_product_review.content,
             "product_review" as review_type,
             "0,15" as review_reward,
             
              0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}'))  as total,
             
             0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'pending' AND organic_product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'pending' AND organic_merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}'))as total_pending,
         
             0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'published' AND organic_product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'published' AND organic_merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) as total_published,
             CAST(
                 organic_product_review.experience_date AS DATE
             ) AS experienceDate,
             (
                 SELECT transaction.hash_transaction
             FROM transaction
         WHERE transaction
             .id = organic_product_review.job_id
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
                     u.email = '${email}'
             )
         ) AS total_reward, 
         
          (
             SELECT userprofile.first_name
         FROM userprofile
     WHERE userprofile.email = '${email}'
         ) AS first_name,
             
                     (
             SELECT userprofile.last_name
         FROM userprofile
     WHERE userprofile.email = '${email}'
         ) AS last_name,
             
                     (
             SELECT userprofile.level_account
         FROM userprofile
     WHERE userprofile.email = '${email}'
         ) AS level_account
     FROM
         organic_product_review
     INNER JOIN userprofile ON organic_product_review.user_id = userprofile.id
 
     WHERE
         userprofile.id =(
         SELECT
             u.id
         FROM
             userprofile AS u
         WHERE
             u.email = '${email}'
     ) 
 GROUP BY
     organic_product_review.id
     )
 UNION ALL
     (
     SELECT
         organic_merchant_review.id,
         organic_merchant_review.rating,
         organic_merchant_review.title,
         CAST(
             organic_merchant_review.createdAt AS DATE
         ) AS Created,
         "fatasoft-store" AS product_name,
         'logo fatastore' AS image,
         organic_merchant_review.content,
         "merchant_review" as review_type,
         "0,15" as review_reward,
         
           0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}'))  as total,
             
             0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'pending' AND organic_product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'pending' AND organic_merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}'))as total_pending,
         
          0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'published' AND organic_product_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'published' AND organic_merchant_review.user_id = (SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${email}')) as total_published,
         
             CAST(
             organic_merchant_review.experience_date AS DATE
         ) AS experienceDate,
         (
             SELECT transaction.hash_transaction
         FROM transaction
     WHERE transaction
         .id = organic_merchant_review.job_id
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
                 u.email = '${email}'
         )
     ) AS total_reward,
     
      (
             SELECT userprofile.first_name
         FROM userprofile
     WHERE userprofile.email = '${email}'
         ) AS first_name,
             
                     (
             SELECT userprofile.last_name
         FROM userprofile
     WHERE userprofile.email = '${email}'
         ) AS last_name,
             
                     (
             SELECT userprofile.level_account
         FROM userprofile
     WHERE userprofile.email = '${email}'
         ) AS level_account
     
 FROM
     organic_merchant_review
 INNER JOIN userprofile ON organic_merchant_review.user_id = userprofile.id
 
 WHERE
     userprofile.id =(
     SELECT
         u.id
     FROM
         userprofile AS u
     WHERE
         u.email = '${email}'
 ) 
 GROUP BY
     organic_merchant_review.id
 ORDER BY
     organic_merchant_review.createdAt
 )
     ) results
 ORDER BY
     Created
 DESC
 
 LIMIT 10
     `

  /*   connection.query, Array(22).fill(email) ,function (err, result) {
                if(err) {
                  callback(err, null)
                  
                }
                
                else{
                        result.forEach(element => {
                        reviewsData.push(
                            {
                                rating: element.rating,
                                title: element.title,
                                product_name: element.product_name,
                                image: element.image,
                                experienceDate: element.experienceDate,
                                hash_transaction: element.hash_transaction,
                                total_reward: element.total_reward,
                                review_type: element.review_type,
                                statu: (element.state=="published") ? "complete":"pending",
                                status_classe: element.state == 'published' ? 'flaticon-cube-3d flaticon-complete': 'flaticon-time-left flaticon-pending',
                                content: element.content,
                                first_name: element.first_name,
                                last_name: element.last_name,
                                level_account: element.level_account,
                                review_reward: element.review_reward,
                                total: element.total,
                                total_pending: element.total_pending,
                                total_published: element.total_published,
                                created: element.Created
                            }
                        );
                        
                        });
                          
                        }
                     callback(null,reviewsData);
                }); */


                db.sequelize.query(sqli, { type: QueryTypes.SELECT }).then(results => {
                    console.log(results);
                    callback(null,results);
                });
                
} 