/***

 * Task a excecuter à chaque temps defini

 * created: fatahou Ahamadi

 *

 * ce file.js possède un programme qui doit etre exécuter à l'infini, il consite à vérifier dans la base de données et vérifier les invitations enocre non envoyés

 *

 * et envoyés en récupérant l email et le lien d'invitation

 *

 * */
const mysql = require('mysql2');
const cors = require('cors');
const sequelize = require('sequelize');
const db = require('../models/index');
const nodeCron = require("node-cron");
const translationTemplateEmaling = require('./translationTemplateEmaling.json')

/***

 * lancer ce task every 3 min

 *

 *

 * */



const emailInvitation = nodeCron.schedule("*/30 * * * * *", function cronJob() {

    console.log("emailInvitation run", new Date().toLocaleString());
    
    
    try {

        const sql = "SELECT * FROM invitations where Delivery_status = 'Not delivered' and invitation_type = 'merchant_review' and has_sent != 1  LIMIT 1";
        db.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT }).then(result => {
            console.log(result);
            
             // Créez un objet pour faire correspondre les invitations aux informations de l'utilisateur
             const userMap = {};
  
            result.forEach((element)=> {
                
                //setTimeout(() => console.log("Code exécuté après 500 ms"), 10000);

                const sql2 = `SELECT * FROM merchant_profile WHERE id = '${element.profile_id}'`;

                db.sequelize.query(sql2, { type: sequelize.QueryTypes.SELECT }).then(res => {
                    console.log(res);
                    res.forEach((ele) => {

                        var customer_merchant_email = ele.email;
                        var customer_merchant_id = ele.id;
                        var customer_merchant_language = ele.Language_review_collecting;

                        /*** Pour chaque element on va envoyer des invitations

                         * APPEL A API SENDIN BLUE pour envoyer les invitations

                         *

                         *

                         * */

                        var domaine_name = element.domaine_name;

                        var firstname = element.customer_firstname;

                        var lastname = element.customer_lastname;
                        
                        var invitation_url = element.invitation_url;
                        
                           // Associez l'invitation aux informations de l'utilisateur
                        userMap[element.id] = {
                          customer_merchant_email,
                          customer_merchant_id,
                          domaine_name,
                          firstname,
                          lastname,
                          invitation_url,
                        };


                        const SibApiV3Sdk = require("sib-api-v3-sdk");

                        let defaultClient = SibApiV3Sdk.ApiClient.instance;



                        let apiKey = defaultClient.authentications["api-key"];

                        apiKey.apiKey = "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";       // "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";


                        // ADD CONTACT IN LIST



                        let apiInstance_2 = new SibApiV3Sdk.ContactsApi();



                        let createContact = new SibApiV3Sdk.CreateContact();



                        createContact.email = element.Recipient;

                        createContact.listIds = [2];


                        let templateId = 2;

                        // Update email body

                        let smtpTemplate = new SibApiV3Sdk.UpdateSmtpTemplate();

                        smtpTemplate.sender = {

                            name: domaine_name,

                            email: "no_reply@veritatrust.com",

                        };

                        smtpTemplate.templateName = "Concerning your order";

                        smtpTemplate.htmlContent =

                            `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->

    <link href="https://fonts.googleapis.com/css?family=Work+Sans:200,300,400,500,600,700" rel="stylesheet">

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
    background: #f1f1f1;
}

/* What it does: Stops email clients resizing small text. */
* {
	box-sizing: border-box;
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
    -ms-interpolation-mode:bicubic;
}

/* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
a {
    text-decoration: none;
}

/* What it does: A work-around for email clients meddling in triggered links. */
*[x-apple-data-detectors],  /* iOS */
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
img.g-img + div {
    display: none !important;
}

/* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
/* Create one of these media queries for each additional viewport size you'd like to fix */

/* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}
/* iPhone 6, 6S, 7, 8, and X */
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}
/* iPhone 6+, 7+, and 8+ */
@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

    </style>

    <!-- CSS Reset : END -->

    <!-- Progressive Enhancements : BEGIN -->
    <style>

	    .primary{
	background: #02a68a;
}
.bg_white{
	background: #ffffff;
}
.bg_light{
	background: #f7fafa;
}
.bg_black{
	background: #000000;
}
.bg_dark{
	background: rgba(0,0,0,.8);
}
.email-section{
	padding:.5em 2.5em;
}

/*BUTTON*/
.btn{
	padding: 3px 15px;
	display: inline-block;
}
.btn.btn-primary{
	border-radius: 50px;
	background: #02a68a;
	color: #ffffff !important;
}
.btn.btn-white{
	border-radius: 5px;
	background: #ffffff;
	color: #000000;
}
.btn.btn-white-outline{
	border-radius: 5px;
	background: transparent;
	border: 1px solid #fff;
	color: #fff;
}
.btn.btn-black-outline{
	border-radius: 0px;
	background: transparent;
	border: 2px solid #000;
	color: #000;
	font-weight: 700;
}
.btn-custom{
	color: rgba(0,0,0,.3);
	text-decoration: underline;
}

h1,h2,h3,h4,h5,h6{
	font-family: 'Work Sans', sans-serif;
	color: #000000;
	margin-top: 0;
	font-weight: 400;
}

body{
	font-family: 'Work Sans', sans-serif;
	font-weight: 400;
	font-size: 16px;
	line-height: 1.8;
	color: #000;
}

a{
	color: #02a68a !important;
}

table{
}
/*LOGO*/

.logo img{
	max-height: 100px; width: auto;	
}
.logo.veritatrust img{
	height: auto; width: 150px;	
}

/*HERO*/
.hero{
	position: relative;
	z-index: 0;
}

.hero .text{
	color: #000;
}
.hero .text h1{
	color: #002d6b;
	font-size: 25px;
	margin-bottom: 15px;
	font-weight: bold !important; 
	line-height: 1.2;
}


/*PRODUCT*/
.product-entry{
	display: block;
	position: relative;
	float: left;
	padding-top: 20px;
}
.product-entry .text{
	width: calc(100% - 125px);
	padding-left: 20px;
}
.product-entry .text h3{
	margin-bottom: 0;
	padding-bottom: 0;
}
.product-entry .text p{
	margin-top: 0;
}
.product-entry .text span{
	color: #000;
	font-size: 14px;
	font-weight: 600;
	display: inline-block;
	margin-bottom: 10px;
}
.product-entry img, .product-entry .text{
	float: left;
}

ul.social{
	padding: 0;
}
ul.social li{
	display: inline-block;
	margin-right: 10px;
}

/*FOOTER*/

.footer{
	color: #002d6b;
}
.unsubscribe{font-size: .8em;}


@media screen and (max-width: 500px) {


}


    </style>


</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
	<center style="width: 100%; background-color: #f1f1f1;">
    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
    	<!-- BEGIN BODY -->
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
      	<tr>
          <td valign="top" class="bg_white" style="padding: 1em 2.5em 0 2.5em;">
          	<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          		<tr>
          			<td class="logo client" style="text-align: left;">
						<a href="https://${userMap[element.id].invitation_url}">
							<img src="${ele.logo}" alt="${userMap[element.id].domaine_name}">
						</a>
			          </td>
          			<td class="logo veritatrust" style="text-align: right;">
						<a href="https://${userMap[element.id].invitation_url}">
							<img src="http://dev.veritatrust.com/assets/img/logo-veritatrust-w.png" alt="VeritaTrust">
						</a>
			          </td>
          		</tr>
          	</table>
          </td>
	      </tr><!-- end tr -->
		  <tr>
          <td valign="middle" class="hero bg_white" style="padding: 1em 0 1em 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            	<tr>
            		<td style="padding: 0 2.5em; text-align: left;">
            			<div class="text">
							<p>${translationTemplateEmaling[customer_merchant_language]["messages"]["Dear"]} ${userMap[element.id].firstname}  ${userMap[element.id].lastname}<br>
							${translationTemplateEmaling[customer_merchant_language]["messages"]["msg1"]} <a href="https://${userMap[element.id].invitation_url}">${userMap[element.id].domaine_name}</a></p>
							<h1 style="text-align: center;"><strong>${translationTemplateEmaling[customer_merchant_language]["messages"]["howWouldRate"]}<br> <a href="https://${userMap[element.id].invitation_url}">${userMap[element.id].domaine_name}</a>?</strong></h1>
            			</div>
            		</td>
            	</tr>
            </table>
          </td>
	      </tr><!-- end tr -->
	      <tr>
	      	<td class="bg_white" style="padding: 0 0 1em 0;">
		      	<table class="bg_white" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
					<tr>
					<td valign="middle" style="text-align:center; padding: 0 2.5em;">
						<a href="https://${userMap[element.id].invitation_url}">
							<img src="https://dev.veritatrust.com/assets/img/star-mail.gif" alt="Share your experience" style="width: 400px; max-width: 100%; height: auto; display: block; margin: 0 auto 20px;">
						</a>
						<span><a href="https://${userMap[element.id].invitation_url}" class="btn btn-primary">${translationTemplateEmaling[customer_merchant_language]["messages"]["shareExperience"]}</a></span>
						</td>
					</tr>
					<tr>
						<td style="padding: 2.5em; text-align: left;">
							<div class="">
								<p>${translationTemplateEmaling[customer_merchant_language]["messages"]["msg2"]}</p>
								<p>${translationTemplateEmaling[customer_merchant_language]["messages"]["msg3"]}</p>
								<p>${translationTemplateEmaling[customer_merchant_language]["messages"]["msg4"]}<br><a href="https://${userMap[element.id].invitation_url}">${userMap[element.id].domaine_name}</a> team</p>
							</div>
						</td>
					</tr>
		      	</table>
		      </td>
	      </tr><!-- end tr -->
      <!-- 1 Column Text + Button : END -->
      </table>
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
      	<tr>
          <td valign="middle" class="bg_light footer email-section">
            <table>
            	<tr>
                <td valign="top" width="100%">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="text-align: center;">
                      	<p>${translationTemplateEmaling[customer_merchant_language]["messages"]["msg5"]}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr><!-- end: tr -->
        <tr>
          <td class="bg_white unsubscribe" style="text-align: center;">
          	<p>${translationTemplateEmaling[customer_merchant_language]["messages"]["msg6"]} <a href="http://dev.veritatrust.com/unsuscribe?user=${element.Recipient}&sender=${customer_merchant_id}">${translationTemplateEmaling[customer_merchant_language]["messages"]["msg7"]}</a></p>
          </td>
        </tr>
      </table>

    </div>
  </center>
</body>
</html>`;

                        //"<html><body><h1>This is my updated transactional email</h1></body></html>";



                        smtpTemplate.subject = "Concerning your order " + userMap[element.id].domaine_name;

                        smtpTemplate.replyTo = userMap[element.id].customer_merchant_email;

                        smtpTemplate.toField = element.Recipient;

                        smtpTemplate.isActive = true;

                        //smtpTemplate.attachmentUrl = "https://example.net/upload-file";

                        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

                        apiInstance.updateSmtpTemplate(templateId, smtpTemplate).then(

                            function() {

                                console.log("API called successfully.");
                                          
                                var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
                                
                                sendSmtpEmail = {
                                to: [{
                                    email: element.Recipient,
                                    name: element.customer_firstname
                                }],
                                templateId: 2,
                                params: {
                                    name: element.customer_firstname,
                                    surname: element.customer_lastname
                                },
                                
                                headers: {
                                    'X-Mailin-custom': 'api-key:'+"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"+'|content-type:application/json|accept:application/json'
                                }
                            };

                            const sqlupdate3 =  `SELECT subscription.merchant_profile_id, subscription.userprofile_id, subscription.subscribed FROM subscription WHERE subscription.merchant_profile_id = '${customer_merchant_id}' AND subscription.userprofile_id = ((SELECT userprofile.id FROM userprofile WHERE userprofile.email = '${element.Recipient}')) AND subscription.subscribed = 1 `;
                    
                            // db.sequelize.query(sqlupdate3, { type: sequelize.QueryTypes.SELECT }).then(r => {
                             //    console.log(r);
                            //     r.forEach((e)=> {
         
                             apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
                         
                                 console.log('API called successfully. Returned data: ' + data);
                                 const sqlupdate4 = `UPDATE invitations SET message_id = '${data['messageId']}' WHERE invitation_url = '${element.invitation_url}' and invitation_type = 'merchant_review'`;
                                 
                                 db.sequelize.query(sqlupdate4, { type: sequelize.QueryTypes.UPDATE }).then(results => {
                                     console.log(results);
                                     
                                 });    
                                 
                                 }, function(error) {
                                 console.error(error);
                                 });

                                /*** Update table invitation in sent_at

                                *

                                *

                                *

                                * */
                                const sql_update1 =  `UPDATE invitations SET Sent_at = CURRENT_TIMESTAMP  WHERE Reference_number = '${element.Reference_number}' and invitation_type = 'merchant_review'`;
                                const sql_update2 =   `UPDATE invitations SET has_sent = 1 WHERE Reference_number = '${element.Reference_number}' and invitation_type = 'merchant_review'`;

                                db.sequelize.query(sql_update1, { type: sequelize.QueryTypes.UPDATE }).then(results => {
                                    console.log(results);
                                // res.json(results);
                                });

                                
                                db.sequelize.query(sql_update2, { type: sequelize.QueryTypes.UPDATE }).then(results => {
                                    console.log(results);
                                // res.json(results);
                                });



                            },

                            function(error) {

                                console.error(error);

                            }

                        );

                    }); // Fin de for each ele.
                });

            });
           

        });


    } catch (err) {

        console.log(err);

    }

});



module.exports.emailInvitation = emailInvitation;