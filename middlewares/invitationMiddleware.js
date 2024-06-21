
const uuid = require("uuid");
const Op = require("sequelize").Op;
const config = require("../appConfig");
const db = require('../models/index');
const userprofile = db.userprofile;
const express = require('express');
const passport = require('passport');
const bcrypt = require("bcrypt");
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

const baseUrl = 'http://api.veritatrust.com/api';
const BaseUrlInvitation = 'api.veritatrust.com';

const router = express.Router();

const getSubscriptions = async (website) => {
  try {
    const subscriptionQuery = `
      SELECT * FROM Subscriptions 
      WHERE merchantId = (SELECT id FROM merchant_profile WHERE website = '${website}')
    `;
    
    const subscriptionData = await db.sequelize.query(subscriptionQuery, { type: QueryTypes.SELECT });

    if (subscriptionData.length > 0) {
      return subscriptionData; // Retourne les données de l'abonnement
    } else {
      return []; // Retourne un tableau vide si aucun abonnement n'est trouvé
    }
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
    throw error; // Propage l'erreur vers l'appelant
  }
};



router.post("/order/confirmed", async function (req, res) {
  const { email, firstname, lastname, orderId, website, products, source } = req.body;
  var jobId = uuid.v4();
  var userID; 
  const currentDate = new Date();
  const formattedCreatedAt = currentDate.toISOString(); // Format ISO pour DATETIME
  const formattedUpdatedAt = currentDate.toISOString();
  
  const authHeader = req.headers['authorization'];
  let authorizationKey = authHeader && authHeader.split(' ')[1]; 
  const apiAccessKey = authorizationKey;
  const subscriptions = await getSubscriptions(website);
  
  const slqinsert = ` INSERT IGNORE INTO userprofile 
    (first_name, last_name, email,verified, createdAt, updatedAt) 
       VALUES 
    ('${firstname}', "${lastname}", "${email}",'1', '${formattedCreatedAt}', '${formattedUpdatedAt}')`;
    
  if (subscriptions[0].apiToken === authorizationKey) 
  {
            // La clé d'autorisation correspond à l'accessToken.
            // Vous pouvez continuer avec le reste de votre logique ici.
              db.sequelize
                .query(slqinsert, { type: QueryTypes.INSERT })
                .then(async (results) => {
                  const data = await db.sequelize.query(
                    `SELECT * FROM userprofile WHERE email = '${email}'`,
                    { type: QueryTypes.SELECT }
                  );
            
                  if (data.length > 0) {
                    userID = data[0]["id"];
                    console.log(userID);
            
                    var prodIDs = products[0]["productId"];
                    //  console.log(prodIDs);
                    for (var item = 1; item < products.length; item++) {
                      prodIDs = prodIDs + "," + products[item]["productId"].toString();
                    }
                    let text =
                      "jobId=" +
                      jobId +
                      "&userid=" +
                      userID +
                      "&website=" +
                      website +
                      "&orderid=" +
                      orderId +
                      "&productid=" +
                      prodIDs;
            
                    //var invitations_url = baseUrl+"/merchant_review_form?jobId="+jobId+"&userid="+userID+"&website="+website+"&orderid="+orderId+"&productid="+ prodIDs;
                    var invitations_url =
                      BaseUrlInvitation + "/merchant_review_form?" + text;
                    /****
                     * creation de url pour les products reviews
                     * ajouté le 10 10 2022
                     * */
            
                    var images = products[0]["image"];
                    var names = products[0]["name"];
                    for (var ele = 1; ele < products.length; ele++) {
                      images = images + "," + products[ele]["image"].toString();
                      names = names + "," + products[ele]["name"].toString();
                    }
            
                    let text2 =
                      "jobId=" +
                      jobId +
                      "&userid=" +
                      userID +
                      "&website=" +
                      website +
                      "&orderid=" +
                      orderId +
                      "&productid=" +
                      prodIDs +
                      "&image=" +
                      images +
                      "&name=" +
                      names;
            
                    //var invitations_url_for_products = baseUrl+"/page-product_reviews?"+ encrypt_params2;
                    var invitations_url_for_products =
                      BaseUrlInvitation + "/page-product_reviews?" + text2;
            
                    const merchantprofile = await getUserByWebsite(req);
            
                    var merchantID = merchantprofile.dataValues["id"];
                    var domaine_Name = website.replace("www.", ""); // Eliminer le www. pour avoir le nom de domaine
                    // Send invitations
                    const endpoint_id = uuid.v4();
                    const url_invi = BaseUrlInvitation + "/mreview/" + endpoint_id;
                    const url_invi_prod = BaseUrlInvitation + "/preview/" + endpoint_id;
            
                    const sql = `INSERT INTO endpoint_url (endpoint, hash_urls, hash_url_product) VALUES ('${endpoint_id}','${url_invi}','${url_invi_prod}') `;
            
                    db.sequelize
                      .query(sql, { type: QueryTypes.INSERT })
                      .then((results) => {});
            
                    var ref_number = "VTM-" + orderId;
                    var ref_number_2 = "VTP-" + orderId;
            
                    [
                      ref_number_2,
                      firstname,
                      lastname,
                      "Not delivered",
                      "product_review",
                      email,
                      merchantID,
                      url_invi_prod,
                      invitations_url_for_products,
                      domaine_Name,
                      0,
                      ref_number,
                      firstname,
                      lastname,
                      "Not delivered",
                      "merchant_review",
                      email,
                      merchantID,
                      url_invi,
                      invitations_url,
                      domaine_Name,
                      0,
                    ];
            
                    const sqlInvi = `INSERT INTO invitations (Reference_number, customer_firstname, customer_lastname, Delivery_status,invitation_type ,Recipient, profile_id, invitation_url,invitation_url_complete, domaine_name, has_sent, createdAt, updatedAt, source) VALUES 
                  ('${ref_number}','${firstname}','${lastname}','Not delivered','merchant_review','${email}','${merchantID}','${url_invi}','${invitations_url}','${domaine_Name}',0,'${formattedCreatedAt}', '${formattedUpdatedAt}','${source}'), 
                  ('${ref_number_2}','${firstname}','${lastname}','Not delivered','product_review','${email}','${merchantID}','${url_invi_prod}','${invitations_url_for_products}','${domaine_Name}',0,'${formattedCreatedAt}', '${formattedUpdatedAt}','${source}')`;
            
                    db.sequelize
                      .query(sqlInvi, { type: QueryTypes.INSERT })
                      .then((results) => {});
            
                    const sqlTran = `INSERT INTO transaction (user_id, merchant_id, order_id, transaction_id, createdAt, updatedAt) VALUES ('${userID}','${merchantID}','${orderId}', '${jobId}','${formattedCreatedAt}', '${formattedUpdatedAt}')`;
                    db.sequelize
                      .query(sqlTran, { type: QueryTypes.INSERT })
                      .then((results) => {});
                      
                  }
                  
                  
                });
                res.json({"apiToken":authorizationKey});
                
  } else {
    // La clé d'autorisation ne correspond pas à l'accessToken.
    // Gérer cette condition selon vos besoins.
    res.json({"Error Code":"API KEY invalid"});
  }
    

  res.send("okay");
});

router.post("/email/first_open", async function (req, res) {
  const resp = req.body;
  
     const sqlTran = `UPDATE invitations SET Delivery_status = 'First_open' WHERE message_id = '${resp["message-id"]}'`;
        db.sequelize
          .query(sqlTran, { type: QueryTypes.UPDATE })
          .then((results) => {});
       
  res.send(req.body);
});

router.post("/email/cliqued", async function (req, res) {
  const resp = req.body;

    const sqlTran = `UPDATE invitations SET Delivery_status = 'Cliqued' WHERE message_id = '${resp["message-id"]}'`;
        db.sequelize
          .query(sqlTran, { type: QueryTypes.UPDATE })
          .then((results) => {});
       
  res.send(req.body);
});

router.post("/email/email_notdelivered", async function (req, res) {
  const resp = req.body;


  const sqlTran = `UPDATE invitations SET Delivery_status = 'Not delivered' WHERE message_id = '${resp["message-id"]}'`;
        db.sequelize
          .query(sqlTran, { type: QueryTypes.UPDATE })
          .then((results) => {});
       
  res.send(req.body);
});

router.post("/email/delivered", async function (req, res) {
  const resp = req.body;

  const sqlTran = `UPDATE invitations SET Delivery_status = 'Delivered' WHERE message_id = '${resp["message-id"]}'`;
        db.sequelize
          .query(sqlTran, { type: QueryTypes.UPDATE })
          .then((results) => {});
       
  res.send(req.body);
});



module.exports = router;

