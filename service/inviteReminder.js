const sequelize = require("sequelize");
const db = require("../models/index");
const translationTemplateEmaling = require("./translationTemplateEmaling.json");
const dotenv = require("dotenv");
dotenv.config();
const inviteReminder = async (Transaction_id) => {
  try {
    const sql =
      "SELECT * FROM invitations where Delivery_status != 'Not delivered' and invitation_type = 'merchant_review'  LIMIT 1";
    db.sequelize
      .query(sql, { type: sequelize.QueryTypes.SELECT })
      .then((result) => {
        console.log(result);
        const userMap = {};

        result.forEach((element) => {
          const sql2 = `SELECT * FROM merchant_profile WHERE id = '${element.profile_id}'`;

          var regex = /jobId=([^&]+)/;
          var jobId = "";
          var match = element.invitation_url_complete.match(regex);
          if (match) jobId = match[1];

          if (jobId == Transaction_id) {
            db.sequelize
              .query(sql2, { type: sequelize.QueryTypes.SELECT })
              .then((res) => {
                console.log(res);
                res.forEach((ele) => {
                  var customer_merchant_email = ele.email;
                  var customer_merchant_id = ele.id;
                  var customer_merchant_language =
                    ele.Language_review_collecting;

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

                  apiKey.apiKey = process.env.BREVO_API_KEY;

                  // ADD CONTACT IN LIST

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

                  smtpTemplate.templateName =
                    "Concerning your order: Reminders";

                  smtpTemplate.htmlContent = `
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
							<p>${
                translationTemplateEmaling[customer_merchant_language][
                  "messages"
                ]["Dear"]
              } ${userMap[element.id].firstname}  ${
                    userMap[element.id].lastname
                  }<br>
							${
                translationTemplateEmaling[customer_merchant_language][
                  "messages"
                ]["msg1"]
              } <a href="https://${userMap[element.id].invitation_url}">${
                    userMap[element.id].domaine_name
                  }</a></p>
							<h1 style="text-align: center;"><strong>${
                translationTemplateEmaling[customer_merchant_language][
                  "messages"
                ]["howWouldRate"]
              }<br> <a href="https://${userMap[element.id].invitation_url}">${
                    userMap[element.id].domaine_name
                  }</a>?</strong></h1>
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
						<span><a href="https://${
              userMap[element.id].invitation_url
            }" class="btn btn-primary">${
                    translationTemplateEmaling[customer_merchant_language][
                      "messages"
                    ]["shareExperience"]
                  }</a></span>
						</td>
					</tr>
					<tr>
						<td style="padding: 2.5em; text-align: left;">
							<div class="">
								<p>${
                  translationTemplateEmaling[customer_merchant_language][
                    "messages"
                  ]["msg2"]
                }</p>
								<p>${
                  translationTemplateEmaling[customer_merchant_language][
                    "messages"
                  ]["msg3"]
                }</p>
								<p>${
                  translationTemplateEmaling[customer_merchant_language][
                    "messages"
                  ]["msg4"]
                }<br><a href="https://${userMap[element.id].invitation_url}">${
                    userMap[element.id].domaine_name
                  }</a> team</p>
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
                      	<p>${
                          translationTemplateEmaling[
                            customer_merchant_language
                          ]["messages"]["msg5"]
                        }</p>
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
          	<p>${
              translationTemplateEmaling[customer_merchant_language][
                "messages"
              ]["msg6"]
            } <a href="http://dev.veritatrust.com/unsuscribe?user=${
                    element.Recipient
                  }&sender=${customer_merchant_id}">${
                    translationTemplateEmaling[customer_merchant_language][
                      "messages"
                    ]["msg7"]
                  }</a></p>
          </td>
        </tr>
      </table>

    </div>
  </center>
</body>
</html>`;

                  //"<html><body><h1>This is my updated transactional email</h1></body></html>";

                  smtpTemplate.subject =
                    "Reminders: Concerning your order " +
                    userMap[element.id].domaine_name;

                  smtpTemplate.replyTo =
                    userMap[element.id].customer_merchant_email;

                  smtpTemplate.toField = element.Recipient;

                  smtpTemplate.isActive = true;

                  //smtpTemplate.attachmentUrl = "https://example.net/upload-file";

                  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

                  apiInstance.updateSmtpTemplate(templateId, smtpTemplate).then(
                    function () {
                      console.log("API called successfully.");

                      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

                      sendSmtpEmail = {
                        to: [
                          {
                            email: element.Recipient,
                            name: element.customer_firstname,
                          },
                        ],
                        templateId: 2,
                        params: {
                          name: element.customer_firstname,
                          surname: element.customer_lastname,
                        },

                        headers: {
                          "X-Mailin-custom":
                            "api-key:" +
                            process.env.BREVO_API_KEY +
                            "|content-type:application/json|accept:application/json",
                        },
                      };

                      apiInstance.sendTransacEmail(sendSmtpEmail).then(
                        function (data) {
                          console.log(
                            "API called successfully. Returned data: " + data
                          );
                          const currentDate = new Date();
                          const formattedCreatedAt = currentDate.toISOString(); // Format ISO pour DATETIME
                          const formattedUpdatedAt = currentDate.toISOString();
                          const sqlInvi = `INSERT INTO invitations (Reference_number, customer_firstname, customer_lastname, Delivery_status,invitation_type,Sent_at ,Recipient, profile_id, invitation_url,invitation_url_complete, domaine_name,message_id, has_sent, createdAt, updatedAt, source) VALUES 
                                ('${element.Reference_number}','${element.customer_firstname}','${element.customer_lastname}','Not delivered','reminder','${formattedCreatedAt}','${element.Recipient}','${element.profile_id}','${element.invitation_url}','${element.invitation_url_complete}','${element.domaine_name}','${data["messageId"]}',1,'${formattedCreatedAt}', '${formattedUpdatedAt}','${element.source}')`;

                          db.sequelize
                            .query(sqlInvi, {
                              type: sequelize.QueryTypes.INSERT,
                            })
                            .then((results) => {
                              console.log(results);
                            });
                        },
                        function (error) {
                          console.error(error);
                        }
                      );
                    },

                    function (error) {
                      console.error(error);
                    }
                  );
                }); // Fin de for each ele.
              });
          }
        });
      });
  } catch (err) {
    console.error(err);
  }
};

module.exports.inviteReminder = inviteReminder;
