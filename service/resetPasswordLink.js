

const { initializeApp } = require('firebase-admin/app');
const admin = require("firebase-admin");

// INITIATLISATION FIREBASE ADMIN

var serviceAccount = require("../mvp-veritatrust-authen-firebase-adminsdk.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mvp-veritatrust-authen-default-rtdb.europe-west1.firebasedatabase.app"
});

const sendEmail = async (customer_merchant_email, link) => {
    
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
            email: "no_reply@veritatrust.com",
        };
        smtpTemplate.templateName = "Récupération de votre compte";
        smtpTemplate.htmlContent = "<html><body><h1>"+link+"</h1></body></html>";
        smtpTemplate.subject = "Récupération de votre compte";
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

module.exports.sendEmail =  sendEmail;
    