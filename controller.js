router.post("/order/confirmed", async function (req, res) {
  const { email, firstname, lastname, orderId, website, products, source } =
    req.body;
  var jobId = uuid.v4();
  var userID;
  const currentDate = new Date();
  const formattedCreatedAt = currentDate.toISOString(); // Format ISO pour DATETIME
  const formattedUpdatedAt = currentDate.toISOString();

  const authHeader = req.headers["authorization"];
  let authorizationKey = authHeader && authHeader.split(" ")[1];

  const slqinsert = ` INSERT IGNORE INTO userprofile 
    (first_name, last_name, email,verified, createdAt, updatedAt) 
       VALUES 
    ('${firstname}', "${lastname}", "${email}",'1', '${formattedCreatedAt}', '${formattedUpdatedAt}')`;

  const subscriptionQuery = `SELECT * FROM Subscriptions WHERE merchantId = ( select id from merchant_profile where website = '${website}')`;
  db.sequelize
    .query(subscriptionQuery, { type: QueryTypes.SELECT })
    .then(async (subscriptionData) => {
      if (subscriptionData.length > 0) {
        const subscription = subscriptionData[0];

        if (
          subscription.apiToken ==
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        ) {
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
                  prodIDs =
                    prodIDs + "," + products[item]["productId"].toString();
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
                const url_invi_prod =
                  BaseUrlInvitation + "/preview/" + endpoint_id;

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
        }
      }
    });

  res.send(authorizationKey);
});
