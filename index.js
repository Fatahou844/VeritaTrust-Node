'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const csrf = require("csurf");
const formidable = require('formidable');
var cookieSession = require('cookie-session');
var session=require('express-session');

require('./service/sendInvitation').emailInvitation;
require('./service/sendProductInvitations').emailProductInvitation;
require('./service/nodeCron').job.start();
require('./service/nodeCronMerchant').job.start();
require('./service/nodeCronMerchantOrg').job.start();

require('./service/update_account_user').job.start();


var dbConn = require('./db.config');

const uuid = require('uuid');

const axios = require('axios');
const cors = require('cors');
const path = require('path');

const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

// Acces aux fonctionnalités firebase 
const { initializeApp } = require('firebase-admin/app');
const admin = require("firebase-admin");

// INITIATLISATION FIREBASE ADMIN
var serviceAccount = require("../mvp-veritatrust-authen-firebase-adminsdk.json");
// Taxonomies 
const matcher = require('./service/matcher');
const taxonomyMatcher = require('google-taxonomy-matcher');
//let taxonomy  =  new taxonomyMatcher('en-GB', 100)
const mtch = new matcher();
var value = mtch.match("Draper Expert HSS Drill Bits 1mm Pack of 10 Power Tool Accessories > Drilling Accessories > HSS Drill Bits");


// Using Suggestions terms to search categories

/****************************************************************    ****************************/


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mvp-veritatrust-authen-default-rtdb.europe-west1.firebasedatabase.app"
});


const ethers = require ( 'ethers');
const api = require( './api');

const { randomHex } = require("web3-utils");
const CryptoJS = require('crypto-js');

//var i18n = require('./i18n');

const {coreAddress, delegateKey, hcaptchaToken } = require('./api.config'); 
const  morgan = require( 'morgan');

const wallet = new ethers.Wallet(delegateKey);
const delegateAddress = wallet.address;

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

//app.use(i18n);
const csrfMiddleware = csrf({ cookie: true });


i18next.use(Backend).use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: './locales/{{lng}}/translation.json'
        }
    })


app.use(middleware.handle(i18next)); 


app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', cors(), api); 

app.use(cookieParser());



const allowedDomains = ["https://webhook.site/09a2badc-48aa-4ed0-8e9e-2adb959f702a","https://bamboo.bodyguard.ai/api/analyze","https://bamboo.bodyguard.ai/","https://dev.veritatrust.com","http://store.fatasoft-consulting.com/",
"http://dev.veritatrust.com","http://www.veritatrust.com","https://www.google.com","https://hcaptcha.com/siteverify", "https://store.fatasoft-consulting.com/"];

app.use(cors({
  origin: allowedDomains,
  credentials: true
}));


        
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/email-verified-message',(req, res) => {
    
    res.render('page-confirmation.ejs');
})

app.post('/login-password-reset', (req, res) => {
    
    const email = req.body.email;
    
    const actionCodeSettings = {
              // URL you want to redirect back to. The domain (www.example.com) for
              // this URL must be whitelisted in the Firebase Console.
              url: 'https://dev.veritatrust.com',
              // This must be true for email link sign-in.
              handleCodeInApp: true,
          
             
            };
            
    admin.auth()
      .generatePasswordResetLink(email, actionCodeSettings)
      .then((link) => {
        
        
       sendEmail("john","lenon",email,link);
       
        /***          CODE DE REMPLACEMENT               ****/
        
        const axios = require("axios");
        
        
           
          // End 
       
      })
      .catch((error) => {
        // Some error occurred.
        console.log(error)
      });
      
    
    res.send(email);
    
    
})

app.get('/resetpassword', (req, res) => {
    
    
    res.render('resetpassword.ejs');
});


app.get('/account_login', (req, res) => {
    
    
    res.render('login_account.ejs',{Emailconfirmation:""});
});


// Profil product page

app.get('/review-product/:product_name', (req, res) => {
    
   /* dbConn.query("SELECT * FROM products WHERE product_name = ?", req.params['product_name'], function (err, result) {
           
        var products_data = [];
        if(err) {
          console.log("error: ", err);
          
        }else{
            
            
            
            result.forEach(element => {
                
                        products_data.push(
                            {
                                product_image: element.aw_image_url,
                                product_name: element.product_name
                            }
                        );
                        
                        });
            
            
        }
       
       res.render('profil-product.ejs', {data: products_data})
    
   });  */
   
   // ************************************************************************************************
   
       
           var reviewsData = [];
          
           dbConn.query(`SELECT organic_product_review.id, organic_product_review.image_video ,organic_product_review.product_name, (select products.aw_image_url from products where products.product_name = ?) as product_image ,organic_product_review.rating, organic_product_review.title, organic_product_review.content, organic_product_review.hash_transaction, CAST(organic_product_review.experience_date AS DATE) as experienceDate ,user_profile.first_name, user_profile.last_name, user_profile.level_account ,(SELECT COUNT(*) FROM organic_product_review WHERE organic_product_review.user_id = user_profile.id) as Nbre, (SELECT FORMAT(SUM(organic_product_review.rating) / COUNT(*), 1)  FROM organic_product_review WHERE organic_product_review.product_name = ?) as RM FROM organic_product_review INNER JOIN user_profile ON organic_product_review.user_id = user_profile.id WHERE organic_product_review.product_name = ? ORDER BY organic_product_review.created_at DESC`, [req.params['product_name'], req.params['product_name'],  req.params['product_name']] ,function (err, result) {
                if(err) {
                  console.log("error: ", err);
                  
                }
                
                else{
                        result.forEach(element => {
                        reviewsData.push(
                            {
                                product_name: element.product_name,
                                product_image: element.product_image,
                                rating: element.rating,
                                title: element.title,
                                experienceDate: element.experienceDate,
                                hash_transaction: element.hash_transaction,
                                content: element.content,
                                first_name: element.first_name,
                                last_name: element.last_name,
                                Nbre: element.Nbre,
                                RM: element.RM,
                                image_video: element.image_video.split(',')
                                
                            }
                        );
                        
                        });
                        
                    res.render("profil-product.ejs", { productReviews: reviewsData, product_name: req.params['product_name'] } );
                            
                        
                    }
                });

});

/***
 * Page product review
 * 
 * 
 * */
 
app.get('/listings/write-review/:product_name', (req, res) => {
    
       dbConn.query("SELECT * FROM products WHERE product_name = ?", req.params['product_name'], function (err, result) {
           
        var products_data = [];
        if(err) {
          console.log("error: ", err);
          
        }else{
            
            
            
            result.forEach(element => {
                
                        products_data.push(
                            {
                                product_image: element.aw_image_url,
                                product_name: element.product_name
                            }
                        );
                        
                        });
            
            
        }
       
       res.render('product_review_add.ejs', {data: products_data})
    
   });

});



// Email verification in firebase

app.get('/user-management-account', (req, res) => {
    
    
    const apiKey = process.env.FIREBASE_API_KEY;
    axios.post('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAo-8Xsea3mrUrLdRQl8jF0kWjurVR75BM', {
                
               oobCode:req.query["oobCode"]
              
           })
           .then(res => {
                                      
                 res.send("ok");
           
           });
           
    if(req.query["mode"] === "resetPassword")
    {
        res.render("password-update.ejs");
    }
    
    else
           
        //res.json("Your account have been verified");
        res.render("login_account.ejs",{Emailconfirmation: "Congratulations! Your email have been verified"})
           

});

// Password reset page


// Verify token id for firebase authentification


app.post('/tokenverify', (req, res) => {
    
    const {idtoken} = req.body;
    // idToken comes from the client app

    admin.auth()
      .verifyIdToken(idtoken)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        
             axios.post('https://webhook.site/f6eaffd7-fcd1-4c35-87f0-c0ef005b7d30', {
                
                                   decodedToken:uid
                                   
                
                               })
                               .then(res => {
                                  console.log(res)
                               
                               });
        
        
        var redirURL = 'https://dev.veritatrust.com/';
          res.status(201).json({
                   message: "welcome to home",
                   redirectUrl: redirURL
                  });  
      })
      .catch((error) => {
        // Handle error
      });
    
});

app.post('/verifycaptcha/token', (req, res) => {
    
    const {name, token} = req.body;
    var SECRET_KEY = "0x2B5863110cfbAA9f0db6189417aD7b50f324fBA2";   // replace with your secret key
    
    const {verify} = require('hcaptcha');

    verify(SECRET_KEY, token)
    .then((data) => {
        if (data.success === true) {
            
             res.header('Accept-Language','en');
             var response = "<span style='color: red';>"+ "hcaptcha verified successfully" + "</span>";
             res.send(response);
            
        }
        
        else
        {
             console.log('verification failed');
             res.header('Accept-Language','en');
             var resp = "<span style='color: red';>"+ "hcaptcha verification failed" + "</span>";
             res.send(resp);
        } 
        
    })
    .catch(console.error); 
    
});

app.post('/merchant_review/registred', (req, res) => {

const {rating, title, experience_date, order_id, job_id, user_id, merchant_id, content, token, product_id, website, redirectUrl} = req.body;


      
  //PSEUDO CODE

    var SECRET_KEY = "0x2B5863110cfbAA9f0db6189417aD7b50f324fBA2";   // replace with your secret key
    
    // Retrieve token from post data with key 'h-captcha-response'.
    
   // console.log("token");

    const {verify} = require('hcaptcha');

    verify(SECRET_KEY, token)
    .then((data) => {
        if (data.success === true) {
    
    // CONTENT MODERATION
  /*  var value;
    const options = {
      method: 'POST',
      url: 'https://bamboo.bodyguard.ai/api/analyze',
      headers: {
        'X-Api-Key': process.env.BODYGUARD_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channelId: "a3cb905a-9ab9-4e75-8e4e-e193566f0c6a",
        contents: [
          {
            text : content_moderate
          }
        ]
      })
    }
    
    request(options, (error, response) => {
      if (error) {
        throw new Error(error)
      }
      console.log(JSON.parse(response.body).data[0].type);
      value = JSON.parse(response.body).data[0].type;
     
   /*   var merchantID;
      axios.get("http://dev.veritatrust.com/merchant_profile/"+req.query.website).then(function (response) { // update 15-08-2022 
              merchantID = response.data[0].id; 
    
      });    // update 15-08-2022          */  
               
     
        // if (value != "HATEFUL") {
                 
                 
  
                 axios.post('https://dev.veritatrust.com/merchant_review', {
                        
                                           rating:rating,
                                           title:title,
                                           experience_date:experience_date,
                                           order_id: order_id,
                                           status:"pending",
                                           job_id: job_id,
                                           user_id: user_id,
                                           merchant_id: merchant_id,
                                           content:content
                        
                                       })
                                       .then(res => {
                                          console.log(res)
                                       
                                       });
                          
                                                      
                          
                                          /* *****************************Send emailing************************************* */
                                            const SibApiV3Sdk = require('sib-api-v3-sdk');
                                            let defaultClient = SibApiV3Sdk.ApiClient.instance;
                                            
                                            let apiKey = defaultClient.authentications['api-key'];
                                            apiKey.apiKey = process.env.API_KEY;
                                            
                                            let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
                                            
                                            let templateId = 4; 
                                            
                                            let sendTestEmail = new SibApiV3Sdk.SendTestEmail(); 
                                            
                                            sendTestEmail.emailTo = ["fatahouahamadi88@gmail.com","louisfatah23@gmail.com"];
                                            
                                            apiInstance.sendTestTemplate(templateId, sendTestEmail).then(function() {
                                              console.log('API called successfully.');
                                            }, function(error) {
                                              console.error(error);
                                            });
                        
                                                    
                                                    
                                        /*** Update table transaction 

                                         *
                                    
                                         *
                                    
                                         *
                                    
                                         * */
                                    
                                        dbConn.query(
                                    
                                            "UPDATE transaction SET transaction_state = 'completed' WHERE id = ?",job_id,  function(err) {
                                    
                                                if (err) {
                                    
                                                    err;
                                    
                                                }
                                    
                                            }
                                    
                                        );
                                        
                                    var current_url = req.protocol + '://' + req.get('host') + req.originalUrl;
                                    var params_ulrs = current_url.split('?')[1]; 
                                 

                                    var redirURL = redirectUrl;
                                    res.status(201).json({
                                               message: "merchant review registered",
                                               redirectUrl: redirURL
                                              });  
                                     
             //      }
              /*     else
                    { 
                           var markup2 = "<span style='color: red';>"+ "Your opinion has not been considered!"+"</span>";
                       
                           var resp =  markup2;
                           res.header('Accept-Language','en');
                           res.send(resp);
                     } */
              
  //  });
    

  
        
        }
        else
        {
             console.log('verification failed');
             res.header('Accept-Language','en');
             var resp = "<span style='color: red';>"+ "captcha verification failed" + "</span>";
                           res.send(resp);
        } 
     })
     .catch(console.error); 

});



app.post('/product_review/registred', (req, res) => {

   var rating, title, experience_date, order_id, product_id ,statu, job_id, user_id, merchant_id, content, product_name, image; //= req.body;
   const form = new formidable.IncomingForm({ uploadDir: __dirname + '/uploaded',  multiples: true  });

  // Parse `req` and upload all associated files
    form.parse(req, function(err, fields, files) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    rating = fields["rating"];
    title = fields["title"];
    experience_date = fields["experience_date"];
    order_id = fields["order_id"];
    product_id = fields["product_id"];
    statu = fields["statu"];
    job_id = fields["job_id"];
    user_id = fields["user_id"];
    merchant_id = fields["merchant_id"];
    content = fields["content"];
    product_name = fields["product_name"];
    
    image = "";
   
    if(files !== null)
    {
    
    
        for (var key in files) {
        
             image = image + "," + files[key]["filepath"]; // files["image0"]["filepath"] +","+ files.length.toString();
                
        }
        
        image = image.substring(1); // Suppression du premier virgule
    }
        
        
    else
        image = null; 
          
   // image = fields["image"][0];
    // CONTENT MODERATION
   /* const options = {
      method: 'POST',
      url: 'https://bamboo.bodyguard.ai/api/analyze',
      headers: {
        'X-Api-Key': process.env.BODYGUARD_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channelId: "a3cb905a-9ab9-4e75-8e4e-e193566f0c6a",
        contents: [
          {
            text :  content_moderate
          }
        ]
      })
    }
    
    request(options, (error, response) => {
      if (error) {
        throw new Error(error)
      }
      console.log(JSON.parse(response.body).data[0].type);
      value = JSON.parse(response.body).data[0].type;  */
      
        // if (value != "HATEFUL") {
  
                axios.post('https://dev.veritatrust.com/product_review', {
                        
                                           rating:rating,
                                           title:title,
                                           experience_date:experience_date,
                                           order_id: order_id,
                                           product_id: product_id,
                                           product_name: product_name,
                                           status:"pending",
                                           job_id: job_id,
                                           user_id: user_id,
                                           merchant_id: merchant_id,
                                           content:content,
                                           image: image
                        
                                       })
                                       .then(res => {
                                          console.log(res)
                                       
                                       }); 
                                       // Product review registred successfully
                                      
                          
                                                      
                          
                                          /* *****************************Send emailing************************************* */
                                           const SibApiV3Sdk = require('sib-api-v3-sdk');
                                            let defaultClient = SibApiV3Sdk.ApiClient.instance;
                                            
                                            let apiKey = defaultClient.authentications['api-key'];
                                            apiKey.apiKey = process.env.API_KEY;
                                            
                                            let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
                                            
                                            let templateId = 4; 
                                            
                                            let sendTestEmail = new SibApiV3Sdk.SendTestEmail(); 
                                            
                                            sendTestEmail.emailTo = ["fatahouahamadi88@gmail.com","louisfatah23@gmail.com"];
                                            
                                            apiInstance.sendTestTemplate(templateId, sendTestEmail).then(function() {
                                              console.log('API called successfully.');
                                            }, function(error) {
                                              console.error(error);
                                            }); 
                                            
                                                       
                                        /*** Update table transaction 

                                         *
                                    
                                         *
                                    
                                         *
                                    
                                         * */
                                    
                                        dbConn.query(
                                    
                                            "UPDATE transaction SET transaction_state_2 = 'completed' WHERE id = ?",job_id,  function(err) {
                                    
                                                if (err) {
                                    
                                                    err;
                                    
                                                }
                                    
                                            }
                                    
                                        );
                                        
                                         dbConn.query(
                                    
                                            "UPDATE transaction SET transaction_state_3 = 'completed' WHERE id = ?",job_id,  function(err) {
                                    
                                                if (err) {
                                    
                                                    err;
                                    
                                                }
                                    
                                            }
                                    
                                        );
                                 
                        
            
                                    
                                      //res.send(`<span class="row d-flex align-items-center" style='color: green';>"+ req.t('success-message-review-stockage') </span>`);
                                      var redirURL = "https://dev.veritatrust.com/pages-valid_review";
                                      res.status(201).json({
                                               message: "reviews validated",
                                               redirectUrl: redirURL
                                      }); 
                                                                               
                                      
                 /*   }
                   else
                      { 
                           var markup2 = "<span style='color: red';>"+ "Your opinion has not been considered!"+"</span>";
                       
                           var resp =  markup2;
                           res.header('Accept-Language','en');
                           res.send(resp);
                         
                      } 
                        */
                      
              
              
      
      
    });
    


});



app.post('/order/confirmed', async function (req, res) {
       
      const {email, firstname, lastname, orderId, website, products} =  req.body;
      
      var jobId = uuid.v4();
    
      axios.get("https://dev.veritatrust.com/user_profile/"+email).then(function (response) { 
          var userID;
            
          if(response.data.length === 0)
                userID = uuid.v4();
          else
                userID = response.data[0].id;
        
      var prodIDs = products[0]["productId"];
      for(var item = 1; item<products.length; item++)
      {
         prodIDs = prodIDs + "," + products[item]["productId"].toString();
      }
      let text = "jobId="+jobId+"&userid="+userID+"&website="+website+"&orderid="+orderId+"&productid="+ prodIDs;    

      const encrypt_params = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));

      //var invitations_url = "https://dev.veritatrust.com/merchant_review_form?jobId="+jobId+"&userid="+userID+"&website="+website+"&orderid="+orderId+"&productid="+ prodIDs;    
      var invitations_url = "https://dev.veritatrust.com/merchant_review_form?" + encrypt_params;
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
      
      const encrypt_params2 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text2));
      
      //var invitations_url_for_products = "https://dev.veritatrust.com/page-product_reviews?"+ encrypt_params2;
      var invitations_url_for_products = "https://dev.veritatrust.com/page-product_reviews?"+ text2;
        
  try {
      axios.get("https://dev.veritatrust.com/user_profile/"+email).then(function (response) { 
                  
          if(response.data.length === 0)
          
          {
      
              axios.post('https://dev.veritatrust.com/user_profile', {
                           id: userID,
                           first_name:firstname,
                           last_name:lastname,
                           email:email
            
                       })
                        .then(res => {
                          console.log(res)
                       
                       }); 
                       
             
          }
                   
      }); 
      
        // create invitation
        /***
         * Update pour la création des invitations 
         * on récupére le website et on cherche une correspondante dans la base de données pour récupérer le profile_id
         * on crée l invitation 
         *  */
           
        axios.get("https://dev.veritatrust.com/merchant_profile/"+website).then(function (response) { 
                       var merchantID = response.data[0].id; 
                       
                       var domaine_Name = website.replace('www.',''); // Eliminer le www. pour avoir le nom de domaine
                 
                  /*     axios.post('https://dev.veritatrust.com/invitations', {
        
                               Reference_number: "VT-" + orderId,
                               customer_firstname: firstname,
                               customer_lastname: lastname,
                               Delivery_status:"Not delivered",
                               Recipient:email,
                               profile_id : merchantID,
                               invitation_url: 	invitations_url,
                               domaine_name: domaine_Name,
                               has_sent: 0
                        
                   })
                   .then(res => {
                      console.log(res);
                      
                         // Creation des endpoints urls
            
                
                   }); 
                    */
                   
                   // Send invitations
                   
                   
                       const endpoint_id = uuid.v4(); 
                       const url_invi = "https://dev.veritatrust.com/mreview?id="+endpoint_id;
                       const url_invi_prod = "https://dev.veritatrust.com/preview?id="+endpoint_id;
                                
                       dbConn.query("INSERT INTO endpoint_url (id, hash_urls, hash_url_product) VALUES (?,?,?)", [endpoint_id, invitations_url, invitations_url_for_products], function (err, res) {
                                    if(err) {
                                      console.log("error: ", err);
                                      res(null, err);
                                    }else{
                                      res(null, res);
                                    }
                                }); 
            
                      
                      /*** CREATION DES INVITATIONS PRODUCTS ET MERCHANTS
                       * 
                       * 
                       *  */
                            var ref_number = "VTM-" + orderId;
                            var ref_number_2 = "VTP-" + orderId;
                            
                        dbConn.query("INSERT INTO invitations (Reference_number, customer_firstname, customer_lastname, Delivery_status,invitation_type ,Recipient, profile_id, invitation_url,invitation_url_complete, domaine_name, has_sent) VALUES (?,?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?,?)", [ref_number_2, firstname, lastname, "Not delivered", "product_review", email, merchantID, url_invi_prod, invitations_url_for_products,domaine_Name, 0, ref_number, firstname, lastname, "Not delivered", "merchant_review", email, merchantID, url_invi,invitations_url, domaine_Name, 0], function (err, res) {
                            if(err) {
                              console.log("error: ", err);
                              result(null, err);
                            }else{
                              result(null, res);
                            }
                        }); 
                            
                            dbConn.query("INSERT INTO invitations (Reference_number, customer_firstname, customer_lastname, Delivery_status,invitation_type ,Recipient, profile_id, invitation_url,invitation_url_complete,domaine_name, has_sent) VALUES (?,?,?,?,?,?,?,?,?,?)", [ref_number, firstname, lastname, "Not delivered", "merchant_review", email, merchantID, url_invi, domaine_Name, 0], function (err, res) {
                            if(err) {
                              console.log("error: ", err);
                              result(null, err);
                            }else{
                              result(null, res);
                            }
                        });  
                            
                   
                 
            }); 
            
            
    

  } 
  catch(e)
  {
      // catch errors and send error status
            console.log(e);
          
  } 
           
    axios.get("https://dev.veritatrust.com/merchant_profile/"+website).then(function (response) { 
               var merchantID = response.data[0].id; 
         
               axios.post('https://dev.veritatrust.com/transaction', {

               id:jobId,
               user_id:userID,
               merchant_id:merchantID,
               order_id: orderId,

           })
           .then(res => {
              console.log(res)
           
           }); 
         
     });   
     
     
     
      }); // End Get Axios
           
    
    var response = "it works";
    res.end(response);
    
    /*  }
      catch(e) {
      // catch errors and send error status
      console.log(e);
      res.sendStatus(500);
  } */

   

});


// Require merchant_review routes
const merchant_reviewRoutes = require('./routes/merchant_review.routes');
// Require merchant_review routes
const product_reviewRoutes = require('./routes/product_review.routes');
const user_profileRoutes = require('./routes/user_profile.routes');

const transactionRoutes = require('./routes/transaction.routes');

const user_merchantRoutes = require('./routes/merchant_profile.routes');

const merchantReviewsRouter = require('./routes/merchant_review');

const invitationsRoutes = require('./routes/invitations.routes');

// using as middleware
app.use('/review', merchant_reviewRoutes)
app.use('/merchant_review', merchant_reviewRoutes)
app.use('/product_review', product_reviewRoutes)
app.use('/user_profile.json', user_profileRoutes)
/
app.use('/merchant_profile', user_merchantRoutes)
app.use('/transaction', transactionRoutes)
app.use('/merchantReview', merchantReviewsRouter)

app.use('/invitations',invitationsRoutes)





// Require static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploaded')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// page formulaire d evaluation merchant

app.get('/evaluate', function(req, res) {
    var site = req.query['site'];
    
    res.render("merchant_review_add.ejs", {
        merchant: site
    });
    
})

app.get('/evaluatetest/:website', function(req, res) {
    var site = req.params['website'];
    
    res.render("merchant_review_add.ejs", {
        merchant: site
    });
    
})

// Categories results page

app.get('/categories', function(req, res) {
    
    res.render("categories.ejs");
    
});

// search results page

app.get('/search', function(req,res) {
    
   // const value = mtch.autosuggest(req.query["query"]);
    
    // Using Suggestions terms to search categories
    var data = [];
    
   /* if(value['length'] > 0)
    {
        let terms = value[0]["suggestion"];
        let result = mtch.match(terms);
        console.log("**********result**********")
        
        for(var item = 0; item < result['length']; item++)
        {
            data.push(result[item]['category'])
        }
        console.log(data);
        
    } */
    
    var str = '%' + req.query.query + '%';
    
    dbConn.query(`SELECT
    products.product_name,
    
    (SELECT count(*) FROM organic_product_review WHERE organic_product_review.product_name = products.product_name) as nbre
    
FROM
    products
WHERE
    products.product_name LIKE ?`, str ,function (err, result) {
                                                if (err) {
                                                    err;
                                                }
                                                
                                                 result.forEach(element => {
                                                    data.push(
                                                        {
                                                            product_name: element.product_name,
                                                            nbre_review: element.nbre
                                                          
                                                        }
                                                    );
                                                    
                                                    });
               res.render('search_result.ejs', {
                prd_reviews: data,
                query: req.query["query"]
            });
                                                
    });
    
   
    
});

// page profile user

app.get('/users/:id', function(req, res) {
    
      var reviewsData = [];
      var userData = [];
      
      dbConn.query(`SELECT
            organic_merchant_review.id,
            organic_merchant_review.rating,
            organic_merchant_review.title,
            organic_merchant_review.content,
            CAST(
                organic_merchant_review.experience_date AS DATE
            ) AS experienceDate,
            organic_merchant_review.hash_transaction,
            user_profile.first_name,
            user_profile.last_name,
            user_profile.email,
            user_profile.level_account,
            user_profile.wallet_id
             
        FROM
            organic_merchant_review
        INNER JOIN user_profile ON organic_merchant_review.user_id = user_profile.id
        WHERE
            user_profile.id = ? AND organic_merchant_review.status = 'published'
        GROUP BY
            organic_merchant_review.id
        ORDER BY
            organic_merchant_review.created_at
        DESC
        LIMIT 5`, req.params['id'], function (err, result) {
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
                                        wallet_id: element.wallet_id,
                                        email: element.email,
                                        level_account: element.level_account
                                    }
                                );
                                
                                });
                                
                                if(result.length === 0)
                                {
                                    dbConn.query("SELECT * FROM user_profile where id = ?", req.params['id'],function (err, result) {
                                                if (err) {
                                                    err;
                                                }
                                                
                                                 result.forEach(element => {
                                                    reviewsData.push(
                                                        {
                                                            first_name: element.first_name,
                                                            last_name: element.last_name,
                                                            wallet_id: element.wallet_id,
                                                            email: element.email,
                                                            level_account: element.level_account
                                                        }
                                                    );
                                                    
                                                    });
                                                
                                    });
                                }
                                
                                mysqlquery_meta(reviewsData[0].wallet_id, function(err, data) {
                                    
                                         res.render("user_profile.ejs", {
                                                  
                                                  reviews: reviewsData,
                                                  prd_reviews: data
                                  });
                                    
                                })
                         
                             
                            }
                        });  
                        
  
                
});


// page profile pour l'utilisateur
app.get('/user-profile', function(req, res) {
    
   const sessionCookie = req.cookies.session || "";
   const sessionCookieMeta = req.cookies.userWalletAddress || "";
   if(sessionCookie !== "")
   {
      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((userData) => {
          console.log("Logged in:", userData.email)
          
          // requete SQL 
           var reviewsData = [];
          
           dbConn.query(`SELECT
    organic_merchant_review.id,
    organic_merchant_review.rating,
    organic_merchant_review.title,
    organic_merchant_review.content,
    CAST(
        organic_merchant_review.experience_date AS DATE
    ) AS experienceDate,
    organic_merchant_review.hash_transaction,
    user_profile.first_name,
    user_profile.last_name,
    user_profile.email,
    user_profile.level_account
    FROM
        organic_merchant_review
    INNER JOIN user_profile ON organic_merchant_review.user_id = user_profile.id
    WHERE
        user_profile.id = ? AND organic_merchant_review.status = 'published'
    GROUP BY
        organic_merchant_review.id
    ORDER BY
        organic_merchant_review.created_at
    DESC
    LIMIT 5`, req.params['id'], function (err, result) {
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
                                hash_transaction: element.hash_transaction
                            }
                        );
                        
                        });
                        
                        mysqlquery(userData.email, function(err, data) {
                            
                                 res.render("user_profile.ejs", {
                                          email: userData.email,
                                          name: getData(),
                                          reviews: reviewsData,
                                          prd_reviews: data
                          });
                            
                        })
                 
                     
                    }
                });
                

    
            })                
            .catch((error) => {
                  res.redirect("/create_account");
        });
        
   }
   
   else if(sessionCookieMeta !== "")
   {
      var reviewsData = [];
      
      dbConn.query(`SELECT organic_merchant_review.id, organic_merchant_review.rating, organic_merchant_review.title, organic_merchant_review.content, CAST(organic_merchant_review.experience_date AS DATE) as experienceDate, organic_merchant_review.hash_transaction FROM organic_merchant_review INNER JOIN user_profile ON organic_merchant_review.user_id = user_profile.id WHERE user_profile.id = (SELECT u.id FROM user_profile as u WHERE u.wallet_id = ?) AND organic_merchant_review.status = 'published' GROUP BY organic_merchant_review.id ORDER BY organic_merchant_review.created_at DESC LIMIT 5`, sessionCookieMeta, function (err, result) {
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
                                hash_transaction: element.hash_transaction
                            }
                        );
                        
                        });
                        
                        mysqlquery_meta(sessionCookieMeta, function(err, data) {
                            
                                 res.render("user_profile.ejs", {
                                          email: "userData.email",
                                          name: "userData.name",
                                          reviews: reviewsData,
                                          prd_reviews: data
                          });
                            
                        })
                 
                     
                    }
                });  
                
          
   }
   else
   {
       res.redirect("/create_account");
   }
                
});


app.get('/profile', function(req, res) {
    
    const sessionCookie = req.cookies.session || "";
    const sessionCookieMeta = req.cookies.userWalletAddress || "";
    
    if(sessionCookie !== "")
    
    {

      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((userData) => {
          console.log("Logged in:", userData.email)
       /*   res.render("dashboard.ejs", {
              email: userData.email,
              name: userData.name
          }); */
          
             mysqlquery(userData.email, function(err, data) {
                
                res.render("dashboard.ejs", {
                  email: userData.email,
                  name: userData.name,
                  prd_reviews: data
              });
                
            })
          
          
        })
        .catch((error) => {
          res.redirect("/create_account");
        });
        
    }
    
    else if(sessionCookieMeta !== "")
    {
          mysqlquery_meta(sessionCookieMeta, function(err, data) {
                            
                                 res.render("dashboard.ejs", {
                                          email: "userData.email",
                                          name: "userData.name",
                                          prd_reviews: data
                          });
                            
                 })
                 
    }
    
    else {
        res.redirect("/create_account");
    }
    
});

// Session et évaluation des produits

app.post("/session-productevaluate", (req, res) => {
    
 var rating, title, experience_date , email, idToken, idWallet, content, image, product_name, displayName; //= req.body;
   const form = new formidable.IncomingForm({ uploadDir: __dirname + '/uploaded',  multiples: true  });

  // Parse `req` and upload all associated files
    form.parse(req, function(err, fields, files) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    rating = fields["rating"];
    title = fields["title"];
    experience_date = fields["experience_date"];
    
    email = fields["email"];
    idToken = fields["idToken"];
    idWallet = fields["idWallet"];
    content = fields["content"];
    product_name = fields["product_name"];
    
    
    image = "";
   
    if(files !== null)
    {
    
    
        for (var key in files) {
        
             image = image + "," + files[key]["filepath"]; // files["image0"]["filepath"] +","+ files.length.toString();
                
        }
        
        image = image.substring(1); // Suppression du premier virgule
    }
        
        
    else
        image = null; 
          
          
  const jobID = uuid.v4();
 
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Stockage du review dans la base des données;
    
  if(idToken !== "")
   {
   
   try 
    {
                dbConn.query("INSERT INTO user_profile (id,email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),email, idWallet===""?"0x"+email:idWallet, new Date(), new Date()], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
    } 
    
    catch(e)
    {
        console.log("error");
    }
    
    
       dbConn.query("INSERT INTO organic_product_review (product_name,rating, title, content, created_at, updated_at ,experience_date,image_video,job_id, user_id, product_id) VALUES (?,?,?,?,?,?,?,?,?,(SELECT user_profile.id FROM `user_profile` where user_profile.email = ?),(SELECT products.id FROM `products` where products.product_name = ?))", [product_name, rating, title, content,new Date(),new Date()  ,experience_date, image ,uuid.v4() ,email,product_name], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });   
                                
  /* admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    ); */
    
    res.send("profile");
                
  }
  
     else if(idWallet !== "")
   {
           try 
                {
                            dbConn.query("INSERT INTO user_profile (id, email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),email, idWallet===""?"0x"+email:idWallet,new Date(), new Date()], function (err, res) {
                                                            if(err) {
                                                              console.log("error: ", err);
                                                              res(null, err);
                                                            }else{
                                                              res(null, res);
                                                            }
                                                        });  
                } 
                
                catch(e)
                {
                    console.log("error");
                }
                
                
                dbConn.query("INSERT INTO organic_product_review (product_name,rating, title, content, created_at, updated_at ,experience_date,image_video,job_id, user_id, product_id) VALUES (?,?,?,?,?,?,?,?,?,(SELECT user_profile.id FROM `user_profile` where user_profile.wallet_id = ?),(SELECT products.id FROM `products` where products.product_name = ?))", [product_name, rating, title, content,new Date(),new Date()  ,experience_date, image ,uuid.v4() ,idWallet,product_name], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
       
       res.send("profile");
   }
     
  })
    
});
    
    
app.post("/sessionandevaluate", (req, res) => {
  const {idToken, idWallet, title, content, rating, experience_date, email} = req.body;
  const jobID = uuid.v4();
 
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Stockage du review dans la base des données;
    
     if(idToken !== "")
     {
   
   try 
    {
                dbConn.query("INSERT INTO user_profile (id, email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),req.body.email, req.body.idWallet===""?"0x"+req.body.email:req.body.idWallet,new Date(), new Date()], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
    } 
    
    catch(e)
    {
        console.log("error");
    }
    
    
       dbConn.query("INSERT INTO organic_merchant_review (rating, title, content, created_at, updated_at ,experience_date,jobId, user_id, merchant_id) VALUES (?,?,?,?,?,?,?,(SELECT id FROM `user_profile` where email = ?),(SELECT id FROM `merchant_profile` where website = ?))", [req.body.rating, req.body.title, req.body.content,new Date(),new Date()  ,req.body.experience_date, uuid.v4() ,req.body.email,"www.store.fatasoft-consulting.com"], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
                                
  /* admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    ); */
    
    res.send("profile");
                
  }
  
     else if(idWallet !== "")
   {
           try 
                {
                            dbConn.query("INSERT INTO user_profile (id, email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),req.body.email, req.body.idWallet===""?"0x"+req.body.email:req.body.idWallet,new Date(), new Date()], function (err, res) {
                                                            if(err) {
                                                              console.log("error: ", err);
                                                              res(null, err);
                                                            }else{
                                                              res(null, res);
                                                            }
                                                        });  
                } 
                
                catch(e)
                {
                    console.log("error");
                }
                
                
                dbConn.query("INSERT INTO organic_merchant_review (rating, title, content, created_at, updated_at ,experience_date,jobId, user_id, merchant_id) VALUES (?,?,?,?,?,?,?,(SELECT id FROM `user_profile` where email = ? or wallet_id = ?),(SELECT id FROM `merchant_profile` where website = ?))", [req.body.rating, req.body.title, req.body.content,new Date(),new Date()  ,req.body.experience_date, uuid.v4() ,req.body.email,req.body.idWallet,"www.store.fatasoft-consulting.com"], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
       
      res.send("profile");
   }
     
  
    
});


// Session update account

app.post("/sessioneupdate",  (req, res) => {
    
    const {firstname, lastname, email, idWallet, nickname, address, phone, birthday} = req.body;
    
    
    dbConn.query("UPDATE user_profile set first_name = ?, last_name = ?, email = ?, nickname = ?,dateNaissance = ?, localAdress = ?, phoneNumber = ?  Where wallet_id = ? or email = ?", [firstname,lastname, email, nickname,birthday,  address, phone, req.body.idWallet, email], function (err, res) {
                                    if(err) {
                                      console.log("error: ", err);
                                      res(null, err);
                                    }else{
                                      res(null, res);
                                    }
                                });  
                                    
   
    
    res.send("ok");
})

// SESSION LOGIN AND EVALUATE

app.post("/sessionandevaluategoogle", (req, res) => {
    
     const jobID = uuid.v4();
 
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
   try 
                {
                            dbConn.query("INSERT INTO user_profile (id, email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),req.body.email, req.body.idWallet,new Date(), new Date()], function (err, res) {
                                                            if(err) {
                                                              console.log("error: ", err);
                                                              res(null, err);
                                                            }else{
                                                              res(null, res);
                                                            }
                                                        });  
                } 
                
                catch(e)
                {
                    console.log("error");
                }
                
                
                dbConn.query("INSERT INTO organic_merchant_review (rating, title, content, created_at, updated_at ,experience_date,jobId, user_id, merchant_id) VALUES (?,?,?,?,?,?,?,(SELECT id FROM `user_profile` where email = ? or wallet_id = ?),(SELECT id FROM `merchant_profile` where website = ?))", [req.body.rating, req.body.title, req.body.content,new Date(),new Date()  ,req.body.experience_date, uuid.v4() ,req.body.email,req.body.idWallet,"www.store.fatasoft-consulting.com"], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
       
                                
                                /*
                                
    admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    ); 
    */
    
    res.send(req.body);
    
    
});

app.post("/sessionandevaluate", (req, res) => {
  const {idToken, idWallet, title, content, rating, experience_date, email} = req.body;
  const jobID = uuid.v4();
 
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    // Stockage du review dans la base des données;
    
     if(idToken !== "")
     {
   
   try 
    {
                dbConn.query("INSERT INTO user_profile (id, email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),req.body.email, req.body.idWallet === ""?"0x"+req.body.email:req.body.idWallet,new Date(), new Date()], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
    } 
    
    catch(e)
    {
        console.log("error");
    }
    
    
       dbConn.query("INSERT INTO organic_merchant_review (rating, title, content, created_at, updated_at ,experience_date,jobId, user_id, merchant_id) VALUES (?,?,?,?,?,?,?,(SELECT id FROM `user_profile` where email = ?),(SELECT id FROM `merchant_profile` where website = ?))", [req.body.rating, req.body.title, req.body.content,new Date(),new Date()  ,req.body.experience_date, uuid.v4() ,req.body.email,"www.store.fatasoft-consulting.com"], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
                                
  /* admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    ); */
    
    res.send("profile");
                
  }
  
     else if(idWallet !== "")
   {
           try 
                {
                            dbConn.query("INSERT INTO user_profile (id, email, wallet_id ,created_at, updated_at) VALUES (?,?,?,?,?)", [uuid.v4(),req.body.email, req.body.idWallet===""?"0x"+req.body.email:req.body.idWallet,new Date(), new Date()], function (err, res) {
                                                            if(err) {
                                                              console.log("error: ", err);
                                                              res(null, err);
                                                            }else{
                                                              res(null, res);
                                                            }
                                                        });  
                } 
                
                catch(e)
                {
                    console.log("error");
                }
                
                
                dbConn.query("INSERT INTO organic_merchant_review (rating, title, content, created_at, updated_at ,experience_date,jobId, user_id, merchant_id) VALUES (?,?,?,?,?,?,?,(SELECT id FROM `user_profile` where email = ? or wallet_id = ?),(SELECT id FROM `merchant_profile` where website = ?))", [req.body.rating, req.body.title, req.body.content,new Date(),new Date()  ,req.body.experience_date, uuid.v4() ,req.body.email,req.body.idWallet,"www.store.fatasoft-consulting.com"], function (err, res) {
                                                if(err) {
                                                  console.log("error: ", err);
                                                  res(null, err);
                                                }else{
                                                  res(null, res);
                                                }
                                            });  
       
      res.send("profile");
   }
     
  
    
});


// SESSION LOGIN
app.post("/sessionLogin", (req, res) => {
 // const idToken = req.body.idToken.toString();
 // const idWallet = req.body.userWalletAddress.toString();
  
  const {idToken, idWallet} = req.body;
  
  if(idToken !== "")
  {
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
      admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
          (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: false };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "success" }));
         
          /*  res.status(201).json({
                                   message: "merchant review registered",
                                   redirectUrl: "https://dev.veritatrust.com/profile"
                                  });   */
          },
          (error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
          }
        );
    
   }
   
   else if(idWallet !== "")
   {
       
       res.end(JSON.stringify({ status: "success" }));
   }
   else
      res.status(401).send("UNAUTHORIZED REQUEST!");
});

// SESSION LOGOUT
app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("userWalletAddress");
  res.redirect("/create_account");
});


// Gestion de la update account
app.get("/update_account", (req, res) => {
    
   
    const sessionCookie = req.cookies.session || "";
    const sessionCookieMeta = req.cookies.userWalletAddress || "";
    
    if(sessionCookie !== "")
    
    {

      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((userData) => {
          console.log("Logged in:", userData.email)
       /*   res.render("dashboard.ejs", {
              email: userData.email,
              name: userData.name
          }); */
          
             mysqlquery(userData.email, function(err, data) {
                
                res.render("useraccount-profile.ejs", {
                  email: userData.email,
                  name: userData.name,
                  prd_reviews: data
              });
                
            })
          
          
        })
        .catch((error) => {
          res.redirect("/create_account");
        });
        
    }
    
    else if(sessionCookieMeta !== "")
    {
          mysqlquery_meta(sessionCookieMeta, function(err, data) {
                            
                                 res.render("update_account.ejs", {
                                          email: "userData.email",
                                          name: "userData.name",
                                          prd_reviews: data
                          });
                            
                 })
                 
    }
    
    else {
        res.redirect("/create_account");
    }
    
});

/***
 *  Page user dashboard
 * 
 * 
 * */
 app.get("/user-dashboard", (req, res) => {
     
     const sessionCookie = req.cookies.session || "";
    const sessionCookieMeta = req.cookies.userWalletAddress || "";
    
    if(sessionCookie !== "")
    
    {

      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((userData) => {
          console.log("Logged in:", userData.email)
 
             mysqlquery(userData.email, function(err, data) {
                
                res.render("user-log_dashboard.ejs", {
                  email: userData.email,
                  name: userData.name,
                  prd_reviews: data
              });
                
            })
          
          
        })
        .catch((error) => {
          res.redirect("/create_account");
        });
        
    }
    
    else if(sessionCookieMeta !== "")
    {
          mysqlquery_meta(sessionCookieMeta, function(err, data) {
                            
                                 res.render("user-log_dashboard.ejs", {
                                          email: "userData.email",
                                          name: "userData.name",
                                          prd_reviews: data
                          });
                            
                 })
                 
    }
    
    else {
        res.redirect("/create_account");
    }
    
   
    
});

 

app.get('/merchant_review_form', function (req, res) {
    
 
 // res.set('Content-Language', 'fr');
  res.set('Accept-Language', 'fr');
  
  var lng = req.query.hl;
  
  if(lng==="fr")
     req.i18n.changeLanguage("fr");
  else 
     req.i18n.changeLanguage("en");

      // Get Current Url

    var current_url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var params_ulrs = current_url.split('?')[1]; // Get url params encrypted

    var params_urls_decrypt = CryptoJS.enc.Base64.parse(params_ulrs).toString(CryptoJS.enc.Utf8);
    var b = params_urls_decrypt.split('&')

    /*b[0].split("=")[1]: jobid
      b[2].split("=")[1]: website

    */
     
  // faire une requete sur la base des données pour vérifier si la transaction est complete ou non
    dbConn.query("SELECT * FROM transaction WHERE id = ?", b[0].split("=")[1], function (err, result) {
        if(err) {
          console.log("error: ", err);
          
        }else{
            
            result.forEach(element => {
                     
                if(element.transaction_state === "completed")
                {
                    res.send("Sorry Transaction has completed")
                }
                else
                {
                    
                      res.render("merchant_review_form.ejs",  { coreAddress, delegateAddress, hcaptchaToken, experience_date: req.t('experience_date'),
                          share_your_opinion_message: req.t('share_your_opinion_message'),
                          message_rate_experience: req.t('message_rate_experience'),
                          Rate_company: req.t('Rate_company'),
                          Rate_products: req.t('Rate_products'),
                          Rate_your_experience: req.t('Rate_your_experience'),
                          excellent_msg: req.t('excellent_msg'),
                          Write_a_title: req.t('Write_a_title'),
                          Write_your_review: req.t('Write_your_review'),
                          Publish: req.t('Publish'),
                          All_rights_reserved: req.t('All_rights_reserved'),
                          merchant_form_message_opinion: req.t('merchant_form_message_opinion'),
                          merchant_form_message_opinion2: req.t('merchant_form_message_opinion2'),
                          company_name:  b[2].split("=")[1],
                          
                      });
  
                }
                
            });
          
        }
    });
  
 

});


app.post('/send-token', function (req, res) {
  sentToken();
  res.json("OK")
});

/***
 * gestion des webhooks pour les emails transactionnels 
 * 
 * 
 *  */
 
app.post('/email_notdelivered', function (req) {

    const resp = req.body;
    
    dbConn.query("UPDATE user SET first_name = ?", resp["id"], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
    
     /*** Update table invitation in envent status

     *

     *

     *

     * */

    dbConn.query(

        "UPDATE invitations SET Delivery_status = ? WHERE message_id = ?", ['Not delivered',resp["message-id"]],  function(err) {

            if (err) {

                err;

            }

        }

    );
    
    
  
});


app.post('/unsuscribed', function (req) {

    const resp = req.body;
    
    dbConn.query("UPDATE user SET first_name = ?", resp["event"], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
  
});

/** création du webhook listener pour traiter les réquetes qui vient du plugin 
 * ce hook va mettre à jour le timing et la fréquence d'envoi des invitations du site webmerchant
 * 
 * 
 * */

app.post('/timing-and-frequency', function (req) {
    
    const {url_domaine, timing} = req.body;
    
    /***
     * Mettre à jour le timing pour le webmerchant avec l url correspondant
     * 
     * */
    dbConn.query("UPDATE merchant_profile SET invitation_delay = ? WHERE website = ?", [timing, url_domaine], function (err, res) {
        if(err) {
          console.log("error: ", err);
          result(null, err);
        }else{
          result(null, res);
        }
    });
     
     
    
});


// Gestion des emails cliqués



app.post('/cliqued', function(req) {
    
    const resp = req.body;
    
    dbConn.query(

        "UPDATE invitations SET Delivery_status = ? WHERE message_id = ?", ['Cliqued',resp["message-id"]],  function(err) {

            if (err) {

                err;

            }

        }

    ); 
    
});



// Gestion des invitations qui sont ouvertes pour la première fois
app.post('/first_open', function(req) {
    
    const resp = req.body;
    
    dbConn.query(

        "UPDATE invitations SET Delivery_status = ? WHERE message_id = ?", ['First_open',resp["message-id"]],  function(err) {

            if (err) {

                err;

            }

        }

    );
    
});



app.post('/order_completed', function (req) {

    const resp = req.body;
    
    dbConn.query(

        "UPDATE invitations SET Delivery_status = ? WHERE message_id = ?", ['Delivered',resp["message-id"]],  function(err) {

            if (err) {

                err;

            }

        }

    );
    
     dbConn.query(

        "UPDATE invitations SET has_sent = ? WHERE message_id = ?", [1, resp["message-id"]],  function(err) {

            if (err) {

                err;

            }

        }

    );
  
});


app.get('/stop', function (req, res) {
  console.log('job stop')
  require('./service/nodeCron').job.stop();
  res.json("OK")
});


app.get('/product_review_form', function (req, res) {
    
    res.set('Accept-Language', 'fr');
  
  var lng = req.query.hl;
  
  if(lng==="fr")
     req.i18n.changeLanguage("fr");
  else 
     req.i18n.changeLanguage("en");

   // Get Current Url

    var current_url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var params_ulrs = current_url.split('?')[1]; // Get url params encrypted

    var params_urls_decrypt = CryptoJS.enc.Base64.parse(params_ulrs).toString(CryptoJS.enc.Utf8);
    var b = params_urls_decrypt.split('&')

    /*b[0].split("=")[1]: jobid
      b[2].split("=")[1]: website
      b[4].split('=')[1]: product id
    */
     
  // faire une requete sur la base des données pour vérifier si la transaction est complete ou non
    dbConn.query("SELECT * FROM transaction WHERE id = ?", b[0].split("=")[1], function (err, result) {
        if(err) {
          console.log("error: ", err);
          
        }else{
            
            result.forEach(element => {
                     
                if(element.transaction_state_2 === "completed")
                {
                    res.send("Sorry Transaction has completed")
                }
                else
                {
                    
                   res.render("product_review_form.ejs",  { coreAddress, delegateAddress, hcaptchaToken,
                              experience_date: req.t('experience_date'),
                                  share_your_opinion_message: req.t('share_your_opinion_message'),
                                  message_rate_experience: req.t('message_rate_experience'),
                                  Rate_company: req.t('Rate_company'),
                                  Rate_products: req.t('Rate_products'),
                                  Rate_your_experience: req.t('Rate_your_experience'),
                                  excellent_msg: req.t('excellent_msg'),
                                  Write_a_title: req.t('Write_a_title'),
                                  Write_your_review: req.t('Write_your_review'),
                                  Publish: req.t('Publish'),
                                  All_rights_reserved: req.t('All_rights_reserved'),
                                  merchant_form_message_opinion: req.t('merchant_form_message_opinion'),
                                  merchant_form_message_opinion2: req.t('merchant_form_message_opinion2'),
                                  company_name: b[2].split('=')[1],
                                  validated_message:req.t('validated_message'), 
                                  product_form_write_your_review: req.t('product_form_write_your_review'), 
                                  add_unless_tree_pictures: req.t('add_unless_tree_pictures'), 
                                  add_photo_video: req.t('add_photo_video'),
                                  product_form_opinion_message:req.t('product_form_opinion_message'),
                                  product_form_opinion_message2: req.t('product_form_opinion_message2'),
                                  product_form_testimonal_msg: req.t('product_form_testimonal_msg'),
                                  product_name: b[4].split('=')[1]
                              })
  
                }
                
            });
          
        }
    });
     
  
});

app.get('/error302', function (req, res) {
  res.render("error302.ejs")
});


app.get('/success', function (req, res) {
  res.render("success.ejs")
});

app.get('/pages-valid_review', function (req, res) {
    
      var lng = req.query.hl;
  
  if(lng==="fr")
     req.i18n.changeLanguage("fr");
  else 
     req.i18n.changeLanguage("en");

  var current_url = req.protocol + '://' + req.get('host') + req.originalUrl; // Get Current Url
    var params_ulrs = current_url.split('?')[1]; // Get url params encrypted

    var params_urls_decrypt = CryptoJS.enc.Base64.parse(params_ulrs).toString(CryptoJS.enc.Utf8);
    var b = params_urls_decrypt.split('&')

    /*b[0].split("=")[1]: jobid
      b[2].split("=")[1]: website
      b[5].split("=")[1].split(','): images_urls
      b[6].split("=")[1].split(','): products_names

    */
    
    res.render("pages-valid_review.ejs", {
      merchant_form_message_opinion: req.t('merchant_form_message_opinion'),
      merchant_form_message_opinion2: req.t('merchant_form_message_opinion2'),
      company_name: b[2].split("=")[1],
      validated_message:req.t('validated_message'), 
      product_form_write_your_review: req.t('product_form_write_your_review'), 
      add_unless_tree_pictures: req.t('add_unless_tree_pictures'), 
      add_photo_video: req.t('add_photo_video'),
      product_form_opinion_message:req.t('product_form_opinion_message'),
      product_form_opinion_message2: req.t('product_form_opinion_message2'),
      product_form_testimonal_msg: req.t('product_form_testimonal_msg'),
      All_rights_reserved: req.t("All_rights_reserved")
    })
});

app.get('/pages-profile', function (req, res) {
  res.render("pages-profile.ejs")
});


app.get('/pages-sign-in', function (req, res) {
  res.render("pages-sign-in.ejs")
});

app.get('/pages-sign-up', function (req, res) {
  res.render("pages-sign-up.ejs")
});

app.get('/merchant-reviews', function (req, res) {
  res.render("merchant-reviews.ejs")
});


app.get('/manifest.json', function (req, res) {
  res.render("manifest.json")
});


app.get('/', function (req, res) {
    
   const sessionCookie = req.cookies.session || "";
   const sessionCookieMeta = req.cookies.userWalletAddress || "";
    var Data = [];
   if(sessionCookie !== "")
   {
      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((userData) => {
            
               
                
                dbConn.query("SELECT * FROM user_profile where email = ?",userData.email, function (err, result) {
                    if (err) {
                        err;
                    }
                    console.log("seelct qr", result);
                    result.forEach(element => {
                        Data.push(
                            {
                                first_name: element.first_name,
                                last_name: element.last_name,
                                level_account: element.level_account
                            }
                        )
                         
                    });
                    
                     res.render("index.ejs", { prd_reviews: Data });
                });
    
               
   
        })
   
    }
    else if(sessionCookieMeta !== "")
    {
          dbConn.query("SELECT * FROM user_profile where wallet_id = ?",sessionCookieMeta, function (err, result) {
                    if (err) {
                        err;
                    }
                    console.log("seelct qr", result);
                    result.forEach(element => {
                        Data.push(
                            {
                                first_name: element.first_name,
                                last_name: element.last_name,
                                level_account: element.level_account
                            }
                        )
                         
                    });
                    
                     res.render("index.ejs", { prd_reviews: Data });
                });
    }
    
    else 
    {
        res.render("index.ejs", {prd_reviews: Data });
    }

});

app.get('/create_account', function (req, res) {
    
    
    
    res.render("create_account.ejs");
});

/***
 * Add 12 Septembre 2022
 * Page profile pour afficher les reviews sur la page public
 * 
 * */
app.get('/org-review', function(req, res) {
    
           var reviewsData = [];
          
           dbConn.query(`SELECT organic_merchant_review.id, organic_merchant_review.rating, organic_merchant_review.title, organic_merchant_review.content, organic_merchant_review.hash_transaction, CAST(organic_merchant_review.experience_date AS DATE) as experienceDate ,user_profile.first_name, user_profile.last_name, (SELECT COUNT(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = user_profile.id) as Nbre, (SELECT FORMAT(SUM(organic_merchant_review.rating) / COUNT(*), 1)  FROM organic_merchant_review WHERE organic_merchant_review.merchant_id = '4f6750685-6ee7-49dd-b9e8-1f204b13db6a') as RM FROM organic_merchant_review INNER JOIN user_profile ON organic_merchant_review.user_id = user_profile.id WHERE organic_merchant_review.merchant_id = '4f6750685-6ee7-49dd-b9e8-1f204b13db6a' AND organic_merchant_review.status = 'published' ORDER BY organic_merchant_review.created_at DESC`, function (err, result) {
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
                                content: element.content,
                                first_name: element.first_name,
                                last_name: element.last_name,
                                Nbre: element.Nbre,
                                RM: element.RM
                                
                            }
                        );
                        
                        });
                        
                                 res.render("pages-org-review.ejs", { merchantReviews: reviewsData, webmerchant: "store.fatasoft-consulting.com"} );
                            
                        
                 
                     
                    }
                });
    
});

app.get('/review', function(req, res) {
    
               var reviewsData = [];
          
           dbConn.query(`SELECT organic_merchant_review.id, organic_merchant_review.rating, organic_merchant_review.title, organic_merchant_review.content, CAST(organic_merchant_review.experience_date AS DATE) as experienceDate, organic_merchant_review.hash_transaction FROM organic_merchant_review WHERE organic_merchant_review.merchant_id = (SELECT u.id FROM merchant_profile as u WHERE u.website = "www.store.fatasoft-consulting.com") AND organic_merchant_review.status = 'published' LIMIT 10`, function (err, result) {
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
                                hash_transaction: element.hash_transaction
                            }
                        );
                        
                        });
                        
                                 res.render("pages-review.ejs", { orgreviews: "reviewsData"} );
                            
                        
                 
                     
                    }
                });
    
   // res.render("pages-review.ejs");
    
});

app.get('/log', (req, res) => {
  res.sendFile(path.join(__dirname + '/logs.log'));
});

app.get('/page-product_reviews', function(req, res) {

    

    var current_url = req.protocol + '://' + req.get('host') + req.originalUrl; // Get Current Url
    var params_ulrs = current_url.split('?')[1]; // Get url params encrypted

   // var params_urls_decrypt = CryptoJS.enc.Base64.parse(params_ulrs).toString(CryptoJS.enc.Utf8);
    var b = params_ulrs.split('&')

    /*b[0].split("=")[1]: jobid
      b[5].split("=")[1].split(','): images_urls
      b[6].split("=")[1].split(','): products_names

    */

    
       // faire une requete sur la base des données pour vérifier si la transaction est complete ou non
    dbConn.query("SELECT * FROM transaction WHERE id = ?", b[0].split("=")[1], function (err, result) {
        if(err) {
          console.log("error: ", err);
          
        }else{
            
            result.forEach(element => {
                     
                if(element.transaction_state_3 === "completed")
                {
                    res.send("Sorry Transaction has completed")
                }
                else
                {
                    
                     res.render("page-product_reviews.ejs", {images_url: b[5].split("=")[1].split(','),products_name: b[6].split("=")[1].split(',') });
                }
                
            });
          
        }
    });
    

})
app.get('/unsuscribe', (req, res) => {
    
 
    
  dbConn.query("SELECT * FROM user_profile WHERE email = ?", req.query["user"], function (err, result) {
        if(err) {
          console.log("error: ", err);
          
        }else{
            
            result.forEach(element => {
                dbConn.query("INSERT INTO subscription (merchant_profile_id, user_profile_id, subscribed) VALUES (?,?,0) ON DUPLICATE KEY UPDATE merchant_profile_id = ?, user_profile_id = ?, subscribed = 0", [req.query["sender"], element.id, req.query["sender"], element.id], function (err, res) {
                if(err) {
                  console.log("error: ", err);
                  result(null, err);
                }else{
                  result(null, res);
                }
            });
                
                
            });
          
        }
    });
    
  
  res.send("User unsuscribed !!")
});

app.get('/preview', function(req, res) { 
    
     dbConn.query(`SELECT * FROM endpoint_url where id = ?`, req.query['id'], function (err, result) {
                if(err) {
                  console.log("error: ", err);
                  
                }
                
                else{
                    
                    result.forEach(element => {
                        
                            var current_url = element.hash_url_product;
                            
                            var params_ulrs = current_url.split('?')[1]; // Get url params encrypted
                        
                           // var params_urls_decrypt = CryptoJS.enc.Base64.parse(params_ulrs).toString(CryptoJS.enc.Utf8);
                            var b = params_ulrs.split('&')
                            
                            dbConn.query("SELECT * FROM transaction WHERE id = ?", b[0].split("=")[1], function (err, result) {
                            if(err) {
                              console.log("error: ", err);
                              
                            }else{
                                
                                result.forEach(element => {
                                         
                                    if(element.transaction_state_3 === "completed")
                                    {
                                        res.send("Sorry Transaction has completed")
                                    }
                                    else
                                    {
                                        
                                         res.render("page-product_reviews.ejs", 
                                          {  
                                              
                                              images_url: b[5].split("=")[1].split(','),
                                              products_name: b[6].split("=")[1].split(','),
                                              url_hash: current_url
                                    
                                          });
                      
                                    }
                                    
                                });
                              
                            }
                        });
                        
                    });
                      
                        
                }
    
        });
    
    
});



app.get('/mreview', function(req, res) {
    
    dbConn.query(`SELECT * FROM endpoint_url where id = ?`, req.query['id'], function (err, result) {
                if(err) {
                  console.log("error: ", err);
                  
                }
                
                else{
                    
                    result.forEach(element => {
                        
                            var current_url = element.hash_urls;
                            
                            var params_ulrs = current_url.split('?')[1]; // Get url params encrypted
                        
                            var params_urls_decrypt = CryptoJS.enc.Base64.parse(params_ulrs).toString(CryptoJS.enc.Utf8);
                            var b = params_urls_decrypt.split('&')
                            
                            dbConn.query("SELECT * FROM transaction WHERE id = ?", b[0].split("=")[1], function (err, result) {
                            if(err) {
                              console.log("error: ", err);
                              
                            }else{
                                
                                result.forEach(element => {
                                         
                                    if(element.transaction_state === "completed")
                                    {
                                        res.send("Sorry Transaction has completed")
                                    }
                                    else
                                    {
                                        
                                          res.render("merchant_review_form.ejs",  { coreAddress, delegateAddress, hcaptchaToken, experience_date: req.t('experience_date'),
                                              share_your_opinion_message: req.t('share_your_opinion_message'),
                                              message_rate_experience: req.t('message_rate_experience'),
                                              Rate_company: req.t('Rate_company'),
                                              Rate_products: req.t('Rate_products'),
                                              Rate_your_experience: req.t('Rate_your_experience'),
                                              excellent_msg: req.t('excellent_msg'),
                                              Write_a_title: req.t('Write_a_title'),
                                              Write_your_review: req.t('Write_your_review'),
                                              Publish: req.t('Publish'),
                                              All_rights_reserved: req.t('All_rights_reserved'),
                                              merchant_form_message_opinion: req.t('merchant_form_message_opinion'),
                                              merchant_form_message_opinion2: req.t('merchant_form_message_opinion2'),
                                              company_name:  b[2].split("=")[1],
                                              url_hash: current_url
                                          });
                      
                                    }
                                    
                                });
                              
                            }
                        });
                        
                    });
                      
                        
                }
    
        });
});


app.use('/merchant_review_form',function (req, res, next) {
  res.set('accept-language', 'en');
  next();
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res) => {
  console.error(err);
  res.sendStatus(500);
});

// error
app.use(function (err, req, res) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

function mysqlquery(email, callback)
{
     var reviewsData = [];
 
     
     dbConn.query(`SELECT
    *
FROM
    (
        (
        SELECT
            organic_product_review.id,
            organic_product_review.rating,
            organic_product_review.title,
            organic_product_review.created_at AS Created,
            organic_product_review.product_name,
            organic_product_review.image_video,
            organic_product_review.content,
            "product_review" as review_type,
            "0,15" as review_reward,
            
             0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?))  as total,
            
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'pending' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'pending' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?))as total_pending,
        
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'published' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'published' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) as total_published,
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
                    user_profile AS u
                WHERE
                    u.email = ?
            )
        ) AS total_reward, 
        
         (
            SELECT user_profile.first_name
        FROM user_profile
    WHERE user_profile.email = ?
        ) AS first_name,
            
                    (
            SELECT user_profile.last_name
        FROM user_profile
    WHERE user_profile.email = ?
        ) AS last_name,
            
                    (
            SELECT user_profile.level_account
        FROM user_profile
    WHERE user_profile.email = ?
        ) AS level_account
    FROM
        organic_product_review
    INNER JOIN user_profile ON organic_product_review.user_id = user_profile.id

    WHERE
        user_profile.id =(
        SELECT
            u.id
        FROM
            user_profile AS u
        WHERE
            u.email = ?
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
            organic_merchant_review.created_at AS DATE
        ) AS Created,
        "fatasoft-store" AS product_name,
        'logo fatastore' AS image,
        organic_merchant_review.content,
        "merchant_review" as review_type,
        "0,15" as review_reward,
        
          0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?))  as total,
            
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'pending' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'pending' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?))as total_pending,
        
         0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'published' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'published' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.email = ?)) as total_published,
        
            CAST(
            organic_merchant_review.experience_date AS DATE
        ) AS experienceDate,
        (
            SELECT transaction.hash_transaction
        FROM transaction
    WHERE transaction
        .id = organic_merchant_review.jobId
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
                user_profile AS u
            WHERE
                u.email = ?
        )
    ) AS total_reward,
    
     (
            SELECT user_profile.first_name
        FROM user_profile
    WHERE user_profile.email = ?
        ) AS first_name,
            
                    (
            SELECT user_profile.last_name
        FROM user_profile
    WHERE user_profile.email = ?
        ) AS last_name,
            
                    (
            SELECT user_profile.level_account
        FROM user_profile
    WHERE user_profile.email = ?
        ) AS level_account
    
FROM
    organic_merchant_review
INNER JOIN user_profile ON organic_merchant_review.user_id = user_profile.id

WHERE
    user_profile.id =(
    SELECT
        u.id
    FROM
        user_profile AS u
    WHERE
        u.email = ?
) 
GROUP BY
    organic_merchant_review.id
ORDER BY
    organic_merchant_review.created_at
)
    ) results
ORDER BY
    Created
DESC

LIMIT 10
    `, Array(22).fill(email) ,function (err, result) {
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
                });
                
}


function mysqlquery_meta(wallet_id, callback)
{
     var reviewsData = [];
 
     
     dbConn.query(`SELECT
    *
FROM
    (
        (
        SELECT
            organic_product_review.id,
            organic_product_review.rating,
            organic_product_review.title,
        CAST(
            organic_product_review.created_at AS DATE
        ) AS Created,
            organic_product_review.product_name,
            organic_product_review.image_video,
            organic_product_review.content,
            organic_product_review.status as state,
            "product_review" as review_type,
            "0,15" as review_reward,
            
             0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) as total,
            
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'pending' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'pending' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) as total_pending,
        
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'published' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'published' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE  user_profile.wallet_id = ?)) as total_published,
            
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
                    user_profile AS u
                WHERE
                    u.wallet_id = ?
            )
        ) AS total_reward,
                    
                  (
            SELECT user_profile.first_name
        FROM user_profile
    WHERE user_profile.wallet_id = ?
        ) AS first_name,
            
                    (
            SELECT user_profile.last_name
        FROM user_profile
    WHERE user_profile.wallet_id = ?
        ) AS last_name,
            
                    (
            SELECT user_profile.level_account
        FROM user_profile
    WHERE user_profile.wallet_id = ?
        ) AS level_account
    FROM
        organic_product_review
    INNER JOIN user_profile ON organic_product_review.user_id = user_profile.id

    WHERE
        user_profile.id =(
        SELECT
            u.id
        FROM
            user_profile AS u
        WHERE
            u.wallet_id = ?
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
        organic_merchant_review.created_at AS Created,
        "fatasoft-store" AS product_name,
        'logo fatastore' AS image,
        organic_merchant_review.content,
        organic_merchant_review.status as state,
        "merchant_review" as review_type,
        "0,15" as review_reward,
         0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) as total,
            
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'pending' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) +  0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'pending' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) as total_pending,
        
            0.15 * (SELECT count(*) FROM organic_product_review WHERE organic_product_review.status = 'published' AND organic_product_review.user_id = (SELECT user_profile.id FROM user_profile WHERE user_profile.wallet_id = ?)) + 0.15 * (SELECT count(*) FROM organic_merchant_review WHERE organic_merchant_review.status = 'published' AND organic_merchant_review.user_id = (SELECT user_profile.id FROM user_profile WHERE  user_profile.wallet_id = ?)) as total_published,
            
            
        CAST(
            organic_merchant_review.experience_date AS DATE
        ) AS experienceDate,
        (
            SELECT transaction.hash_transaction
        FROM transaction
    WHERE transaction
        .id = organic_merchant_review.jobId
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
                user_profile AS u
            WHERE
                u.wallet_id = ?
        )
    ) AS total_reward,
    
                
                  (
            SELECT user_profile.first_name
        FROM user_profile
    WHERE user_profile.wallet_id = ?
        ) AS first_name,
            
                    (
            SELECT user_profile.last_name
        FROM user_profile
    WHERE user_profile.wallet_id = ?
        ) AS last_name,
            
                    (
            SELECT user_profile.level_account
        FROM user_profile
    WHERE user_profile.wallet_id = ?
        ) AS level_account
FROM
    organic_merchant_review
INNER JOIN user_profile ON organic_merchant_review.user_id = user_profile.id
WHERE
    user_profile.id =(
    SELECT
        u.id
    FROM
        user_profile AS u
    WHERE
        u.wallet_id = ?
) 
GROUP BY
    organic_merchant_review.id
ORDER BY
    organic_merchant_review.created_at
)
    ) results
ORDER BY
    Created
DESC

LIMIT 10
    `, Array(22).fill(wallet_id) ,function (err, result) {
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
                                statu: element.state==='published'?'complete':'pending',
                                status_classe: element.state === 'published' ? 'flaticon-cube-3d flaticon-complete': 'flaticon-time-left flaticon-pending',
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
                });
                
}

// fonction qui permet de traiter des requetes SQL et retourner des datas de la base de données
function select_query() {
  return new Promise(
    (resolve, reject) => {
      dbConn.query("SELECT * FROM merchant_review WHERE 1", (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows.map(row => row.invoice));
      })
    }
  );
}

async function getData() {
  const [rows, fields] = await dbConn.execute('SELECT * FROM merchant_review');
  return rows;
}

function sendEmail(firstname, lastname, customer_merchant_email, link) {
    
        const SibApiV3Sdk = require("sib-api-v3-sdk");
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey = process.env.API_KEY;
        
        // ADD CONTACT IN LIST
        let apiInstance_2 = new SibApiV3Sdk.ContactsApi();
        let createContact = new SibApiV3Sdk.CreateContact();
        createContact.email = customer_merchant_email;
        createContact.listIds = [2];
        apiInstance_2.createContact(createContact).then(
            function(data) {
                console.log(
        
                    "API called successfully. Returned data: " +
                    JSON.stringify(data)
        
                );
            },
        
            function(error) {
                console.error(error);
            }
        );
        
        let templateId = 2;
        // Update email body
        let smtpTemplate = new SibApiV3Sdk.UpdateSmtpTemplate();
        smtpTemplate.sender = {
            name: "veritatrust.com",
            email: "af@veritatrust.com",
        };
        smtpTemplate.templateName = "Récupération de votre compte";
        smtpTemplate.htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width">
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">
    <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title>Password Reset from VeritaTrust</title>
    <!-- The title tag shows in email notifications, like Android 4.4. -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

    <!-- CSS Reset : BEGIN -->
    <style>
        /* What it does: Remove spaces around the email design added by some email clients. */
        /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        
        html,
        body {
            margin: 0 auto !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            background: #ffffff;
        }
        /* What it does: Stops email clients resizing small text. */
        
        * {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        /* What it does: Centers email on Android 4.4 */
        
        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }
        /* What it does: Stops Outlook from adding extra spacing to tables. */
        
        table,
        td {
            mso-table-lspace: 0pt !important;
            mso-table-rspace: 0pt !important;
        }
        /* What it does: Fixes webkit padding issue. */
        
        table {
            border-spacing: 0 !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 auto !important;
        }
        /* What it does: Uses a better rendering method when resizing images in IE. */
        
        img {
            -ms-interpolation-mode: bicubic;
        }
        /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
        
        a {
            text-decoration: none;
        }
        /* What it does: A work-around for email clients meddling in triggered links. */
        
        *[x-apple-data-detectors],
        /* iOS */
        
        .unstyle-auto-detected-links *,
        .aBn {
            border-bottom: 0 !important;
            cursor: default !important;
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        
        .a6S {
            display: none !important;
            opacity: 0.01 !important;
        }
        /* What it does: Prevents Gmail from changing the text color in conversation threads. */
        
        .im {
            color: inherit !important;
        }
        /* If the above doesn't work, add a .g-img class to any image in question. */
        
        img.g-img+div {
            display: none !important;
        }
        /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
        /* Create one of these media queries for each additional viewport size you'd like to fix */
        /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        
        @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
            u~div .email-container {
                min-width: 320px !important;
            }
        }
        /* iPhone 6, 6S, 7, 8, and X */
        
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
            u~div .email-container {
                min-width: 375px !important;
            }
        }
        /* iPhone 6+, 7+, and 8+ */
        
        @media only screen and (min-device-width: 414px) {
            u~div .email-container {
                min-width: 414px !important;
            }
        }
    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>
        .primary {
            background: #02a68a;
        }
        
        .bg_white {
            background: #ffffff;
        }
        
        .bg_light {
            background: #fafafa;
        }
        
        .bg_black {
            background: #000000;
        }
        
        .bg_dark {
            background: rgba(0, 0, 0, .8);
        }
        
        .email-section {
            padding: 2.5em;
        }
        /*BUTTON*/
        
        .btn {
            padding: 5px 20px;
            display: inline-block;
        }
        
        .btn.btn-primary {
            border-radius: 20px;
            background: #02a68a;
            color: #ffffff;
        }
        
        .btn.btn-white {
            border-radius: 5px;
            background: #ffffff;
            color: #000000;
        }
        
        .btn.btn-white-outline {
            border-radius: 5px;
            background: transparent;
            border: 1px solid #fff;
            color: #fff;
        }
        
        .btn.btn-black {
            border-radius: 0px;
            background: #000;
            color: #fff;
        }
        
        .btn.btn-black-outline {
            border-radius: 0px;
            background: transparent;
            border: 2px solid #000;
            color: #000;
            font-weight: 700;
        }
        
        .btn.btn-custom {
            text-transform: uppercase;
            font-weight: 600;
            font-size: 12px;
        }
        
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: 'Poppins', sans-serif;
            color: #000000;
            margin-top: 0;
            font-weight: 400;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            font-size: 17px;
            line-height: 1.7;
            color: #212529;
        }
        
        a {
            color: #002d6b;
        }
        
        p {
            margin-top: 0;
        }
        
        table {}
        /*LOGO*/
        
        .logo h1 {
            margin: 0;
        }
        
        .logo h1 a {
            color: #000000;
            font-size: 20px;
            font-weight: 700;
            /*text-transform: uppercase;*/
            font-family: 'Poppins', sans-serif;
        }
        
        .navigation {
            padding: 0;
            padding: 1em 0;
            /*background: rgba(0,0,0,1);*/
            border-top: 1px solid rgba(0, 0, 0, .05);
            border-bottom: 1px solid rgba(0, 0, 0, .05);
            margin-bottom: 0;
        }
        
        .navigation li {
            list-style: none;
            display: inline-block;
            ;
            margin-left: 5px;
            margin-right: 5px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .navigation li a {
            color: rgba(0, 0, 0, 1);
        }
        /*HERO*/
        
        .hero {
            position: relative;
            z-index: 0;
        }
        
        .hero .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            width: 100%;
            background: #000000;
            z-index: -1;
            opacity: .2;
        }
        
        .hero .text {
            color: rgba(255, 255, 255, .9);
            max-width: 50%;
            margin: 0 auto 0;
        }
        
        .hero .text h2 {
            color: #fff;
            font-size: 34px;
            margin-bottom: 0;
            font-weight: 400;
            line-height: 1.4;
        }
        
        .hero .text h2 span {
            font-weight: 600;
            color: #ff8b00;
        }
        /*INTRO*/
        
        .intro {
            position: relative;
            z-index: 0;
        }
        
        .intro .text {
            color: rgba(0, 0, 0, .3);
        }
        
        .intro .text h2 {
            color: #000;
            font-size: 34px;
            margin-bottom: 0;
            font-weight: 300;
        }
        
        .intro .text h2 span {
            font-weight: 600;
            color: #ff8b00;
        }
        /*SERVICES*/
        
        .services {}
        
        .text-services {
            padding: 10px 10px 0;
            text-align: center;
        }
        
        .text-services h3 {
            font-size: 18px;
            font-weight: 400;
        }
        
        .services-list {
            margin: 0 0 20px 0;
            width: 100%;
        }
        
        .services-list img {
            float: left;
        }
        
        .services-list h3 {
            margin-top: 0;
            margin-bottom: 0;
        }
        
        .services-list p {
            margin: 0;
        }
        /*COUNTER*/
        
        .counter {
            width: 100%;
            position: relative;
            z-index: 0;
        }
        
        .counter .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            width: 100%;
            background: #000000;
            z-index: -1;
            opacity: .3;
        }
        
        .counter-text {
            text-align: center;
        }
        
        .counter-text .num {
            display: block;
            color: #ffffff;
            font-size: 34px;
            font-weight: 700;
        }
        
        .counter-text .name {
            display: block;
            color: rgba(255, 255, 255, .9);
            font-size: 13px;
        }
        /*TOPIC*/
        
        .topic {
            width: 100%;
            display: block;
            float: left;
            border-bottom: 1px solid rgba(0, 0, 0, .1);
            padding: 1.5em 0;
        }
        
        .topic .img {
            width: 120px;
            float: left;
        }
        
        .topic .text {
            width: calc(100% - 150px);
            padding-left: 20px;
            float: left;
        }
        
        .topic .text h3 {
            font-size: 20px;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .topic .text .meta {
            margin-bottom: 10px;
        }
        /*HEADING SECTION*/
        
        .heading-section {}
        
        .heading-section h2 {
            color: #000000;
            font-size: 28px;
            margin-top: 0;
            line-height: 1.4;
            font-weight: 400;
        }
        
        .heading-section .subheading {
            margin-bottom: 20px !important;
            display: inline-block;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(0, 0, 0, .4);
            position: relative;
        }
        
        .heading-section .subheading::after {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -10px;
            content: '';
            width: 100%;
            height: 2px;
            background: #ff8b00;
            margin: 0 auto;
        }
        
        .heading-section-white {
            color: rgba(255, 255, 255, .8);
        }
        
        .heading-section-white h2 {
            font-family: line-height: 1;
            padding-bottom: 0;
        }
        
        .heading-section-white h2 {
            color: #ffffff;
        }
        
        .heading-section-white .subheading {
            margin-bottom: 0;
            display: inline-block;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, .4);
        }
        
        ul.social {
            padding: 0;
        }
        
        ul.social li {
            display: inline-block;
            margin-right: 10px;
            /*border: 1px solid #ff8b00;*/
            padding: 10px;
            border-radius: 50%;
            background: rgba(0, 0, 0, .05);
        }
        /*FOOTER*/
        
        .footer {
            border-top: 1px solid rgba(0, 0, 0, .05);
            color: rgba(0, 0, 0, .5);
        }
        
        .footer .heading {
            color: #000;
            font-size: 20px;
        }
        
        .footer ul {
            margin: 0;
            padding: 0;
        }
        
        .footer ul li {
            list-style: none;
            margin-bottom: 10px;
        }
        
        .footer ul li a {
            color: rgba(0, 0, 0, 1);
        }
        
        .form__star {
            padding: 0 20px;
        }
        
        .form__star input {
            display: none;
        }
        
        .form__star label {
            border: 1px solid #f0f0f0;
            background-color: #fdfdfd;
            height: 35px;
            padding: 5px;
            margin-bottom: 10px;
            -webkit-transition: all 200ms ease-in-out;
            transition: all 200ms ease-in-out;
            display: inline-block;
            text-align: start;
        }
        
        .form__star label span {
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 35px;
            height: 35px;
            display: inline-block;
        }
        
        .form__star label span.off {
            background-image: url("http://dev.veritatrust.com/assets/img/star-0.png");
        }
        
        .form__star label span.on {
            background-image: url("http://dev.veritatrust.com/assets/img/star-1.png");
        }
        
        img.logo-boutique {
            width: 150px;
            height: auto;
            text-align: center;
        }
        
        @media screen and (max-width: 500px) {
            .logo img {
                width: 100%;
                height: auto;
            }
        }
    </style>
</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #fafafa;">
    <div style="width: 100%; background-color: #f1f1f1;">

        <div style="max-width: 700px; margin: 0 auto;" class="email-container">
            <!-- BEGIN BODY -->
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto;">
                <tr>
                    <td valign="top" class="bg_white" style="padding: .5em 2.5em 1em 2.5em;">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" collspan="2">
                            <tr>
                                <!-- corretion 27/08/2022 -->
                                <td class="logo" style="text-align: left;">
                                    <img class="veritatrust" src="http://dev.veritatrust.com/assets/img/logo-veritatrust-w.png" alt="veritatrust" width="300" height="58">
                                </td>
                                <td class="logo" style="text-align: right;">
                                </td>
                                <!-- fin corretion 27/08/2022 -->
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto;">
                <tr>
                    <td class="bg_white" style="text-align: left; padding: 20px 20px 0 20px;">
                        <p>Dear ,<br> <strong>Password Reset Notice</strong></p>
                        <p>You are receiving this email because there was recently a request to change the password for your account.
                        </p>
                        <p>Please follow the link below to reset your password:</p>
                    </td>
                </tr>
                <tr>
                    <td class="bg_white" style="text-align: left; padding: 0px 20px 0 20px;">
                        <a class="btn btn-primary" style="margin-bottom: 0;" href=${link}>Reset password</a>
                    </td>
                </tr>
            </table>
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: auto; font-size: 15px;">
                <tr>
                    <td class="bg_white" style="text-align: left; padding:20px;">
                        <p>If you did not request this email, please contact us immediately using any of the methods below.
                        </p>
                        <p>Kind regards,<br> veritatrust.com team</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>

</html>`;
        smtpTemplate.subject = "Resetting your password";
        smtpTemplate.replyTo = customer_merchant_email;
        smtpTemplate.isActive = true;
        
        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        apiInstance.updateSmtpTemplate(templateId, smtpTemplate).then(
            function() {
                console.log("API called successfully.");
            },
            function(error) {
                console.error(error);
            }
        
        );
        
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail = {
        to: [{
            email: customer_merchant_email,
            name: "firstname"
        }],
        templateId: 2,
        params: {
            name: "firstname",
            surname: "lastname"
        },
        
        headers: {
            'X-Mailin-custom': 'api-key:'+process.env.API_KEY+'|content-type:application/json|accept:application/json'
        }
        };
                
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        
                
                }, function(error) {
                  console.error(error);
                });                   
}


app.listen();