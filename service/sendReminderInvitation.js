const sequelize = require("sequelize");
const db = require("../models/index");
const nodeCron = require("node-cron");
const translationTemplateEmaling = require("./translationTemplateEmaling.json");
const axios = require("axios");

const sendTransactionalEmail = async (userMap, element, language) => {
  try {
    const SibApiV3Sdk = require("sib-api-v3-sdk");
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Utilisez une variable d'environnement pour l'API key

    const templateId = 2;
    const smtpTemplate = new SibApiV3Sdk.UpdateSmtpTemplate();

    smtpTemplate.sender = {
      name: userMap.domaine_name,
      email: "no_reply@veritatrust.com",
    };

    smtpTemplate.templateName = "Reminder: Concerning your order";
    smtpTemplate.htmlContent = `<!DOCTYPE html>
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
						<a href="https://${userMap.invitation_url}">
							<img src="${userMap.logo}" alt="${userMap.domaine_name}">
						</a>
			          </td>
          			<td class="logo veritatrust" style="text-align: right;">
						<a href="https://${userMap.invitation_url}">
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
							<p>${translationTemplateEmaling[language]["messages"]["Dear"]} ${userMap.firstname}  ${userMap.lastname}<br>
							${translationTemplateEmaling[language]["messages"]["msgRappel1"]} <a href="https://${userMap.invitation_url}">${userMap.domaine_name}</a></p>
							<h1 style="text-align: center;"><strong>${translationTemplateEmaling[language]["messages"]["howWouldRate"]}<br> <a href="https://${userMap.invitation_url}">${userMap.domaine_name}</a>?</strong></h1>
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
						<a href="https://${userMap.invitation_url}">
							<img src="https://dev.veritatrust.com/assets/img/star-mail.gif" alt="Share your experience" style="width: 400px; max-width: 100%; height: auto; display: block; margin: 0 auto 20px;">
						</a>
						<span><a href="https://${userMap.invitation_url}" class="btn btn-primary">${translationTemplateEmaling[language]["messages"]["shareExperience"]}</a></span>
						</td>
					</tr>
					<tr>
						<td style="padding: 2.5em; text-align: left;">
							<div class="">
								<p>${translationTemplateEmaling[language]["messages"]["msg2"]}</p>
								<p>${translationTemplateEmaling[language]["messages"]["msgRappel2"]}</p>
								<p>${translationTemplateEmaling[language]["messages"]["msg4"]}<br><a href="https://${userMap.invitation_url}">${userMap.domaine_name}</a> team</p>
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
                      	<p>${translationTemplateEmaling[language]["messages"]["msg5"]}</p>
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
          	<p>${translationTemplateEmaling[language]["messages"]["msg6"]} <a href="http://dev.veritatrust.com/unsuscribe?user=${element.Recipient}&sender=${userMap.customer_merchant_id}">${translationTemplateEmaling[language]["messages"]["msg7"]}</a></p>
          </td>
        </tr>
      </table>

    </div>
  </center>
</body>
</html>`;

    smtpTemplate.subject = `Reminder: Concerning your order ${userMap.domaine_name}`;
    smtpTemplate.replyTo = userMap.customer_merchant_email;
    smtpTemplate.toField = element.Recipient;
    smtpTemplate.isActive = true;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.updateSmtpTemplate(templateId, smtpTemplate);

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Ajoute un délai de 3 secondes

    // Préparer l'email à envoyer
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      to: [{ email: element.Recipient, name: element.customer_firstname }],
      templateId: 2, // Id du template
      params: {
        name: element.customer_firstname,
        surname: element.customer_lastname,
      },
      replyTo: { email: userMap.customer_merchant_email },
      headers: {
        "X-Mailin-custom": `${process.env.BREVO_API_KEY}| content-type:application/json|accept:application/json`,
      },
    });

    const data = {
      sender: {
        name: userMap.domaine_name,
        email: "no_reply@veritatrust.com",
      },
      to: [{ email: element.Recipient, name: element.customer_firstname }],
      templateId: 2, // Id du template
      params: {
        name: element.customer_firstname,
        surname: element.customer_lastname,
      },
      replyTo: { email: userMap.customer_merchant_email },
      headers: {
        "X-Mailin-custom": `${process.env.BREVO_API_KEY}| content-type:application/json|accept:application/json`,
      },
    };

    //  const data = await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(sendSmtpEmail);

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        data,
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY, // Remplacez 'YOUR_API_KEY_HERE' par votre clé API réelle
          },
        }
      );
      console.log("Email sent successfully:", response.data);
      console.log("Email sent successfully. Returned data: ", data);

      const sqlInsert = `
      INSERT INTO invitations (Reference_number, customer_firstname, customer_lastname, invitation_type, Sent_at, Recipient, profile_id, invitation_url, invitation_url_complete, message_id, has_sent, source)
      VALUES ('R${element.Reference_number}', '${element.customer_firstname}', '${element.customer_lastname}', 'reminder', CURRENT_TIMESTAMP, '${element.Recipient}', '${element.profile_id}', '${element.invitation_url}', '${element.invitation_url_complete}', '${response.data.messageId}', 1, '${element.source}')
    `;
      await db.sequelize.query(sqlInsert, {
        type: sequelize.QueryTypes.INSERT,
      });
      console.log("Database updated successfully.");
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
    }
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

const fetchMerchantProfile = async (profileId) => {
  const sql = `SELECT * FROM merchant_profile WHERE id = '${profileId}'`;
  const [result] = await db.sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });
  return result;
};

const fetchPendingTransactions = async () => {
  const sql = "SELECT * FROM transaction WHERE transaction_state = 'pending'";
  const transactions = await db.sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });
  return transactions;
};

const fetchInvitations = async (transactionId) => {
  const sql = `SELECT * FROM invitations WHERE has_sent = 1 AND invitation_url_complete LIKE '%${transactionId}%' AND Sent_at <= DATE_SUB(NOW(), INTERVAL 7 DAY) LIMIT 1`;
  const invitations = await db.sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });

  const sql_very = `SELECT * FROM invitations WHERE has_sent = 1 AND invitation_url_complete LIKE '%${transactionId}%' AND invitation_type = 'reminder' AND Sent_at > DATE_SUB(NOW(), INTERVAL 7 DAY) LIMIT 1`;

  const invitationsReminder = await db.sequelize.query(sql_very, {
    type: sequelize.QueryTypes.SELECT,
  });

  if (invitationsReminder.length > 0) return null;
  else return invitations;
};

const emailInvitationReminder = nodeCron.schedule(
  "*/2 * * * *",
  async function cronJob() {
    console.log("Reminder email run", new Date().toLocaleString());

    try {
      const transactions = await fetchPendingTransactions();

      for (const trans of transactions) {
        const invitations = await fetchInvitations(trans.transaction_id);

        if (invitations) {
          const userPromises = invitations.map(async (element) => {
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Ajoute un délai de 2 secondes
            const merchantProfile = await fetchMerchantProfile(
              element.profile_id
            );

            if (!merchantProfile) {
              console.log(
                `No merchant profile found for profile_id: ${element.profile_id}`
              );
              return;
            }

            const userMap = {
              customer_merchant_email: merchantProfile.email,
              customer_merchant_id: merchantProfile.id,
              domaine_name: element.domaine_name,
              firstname: element.customer_firstname,
              lastname: element.customer_lastname,
              invitation_url: element.invitation_url,
              logo: merchantProfile.logo,
            };

            await sendTransactionalEmail(
              userMap,
              element,
              merchantProfile.Language_review_collecting
            );
          });

          await Promise.all(userPromises);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports.emailInvitationReminder = emailInvitationReminder;
