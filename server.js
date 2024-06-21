const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const speakeasy = require("speakeasy");
const Op = require("sequelize").Op;
const dotenv = require("dotenv");
const db = require("./models/index");
const userprofile = db.userprofile;
const store = require("./public/store");
const { sendConfirmation } = require("./service/sendConfirmation");
const { resetPasswordNotif } = require("./service/resetPasswordNotif");
const { newUserConfirmation } = require("./service/newUserConfirmation");
const { passwordNotifUpdate } = require("./service/passwordNotifUpdate");
const categoriesRoutes = require("./routes/categories.routes");
const followRoutes = require("./routes/follow.routes");
const merchantReview = require("./routes/merchant_review.routes");
const productReview = require("./routes/product_review.routes");
const countriesRoutes = require("./routes/countries.routes");
const twoFactorRoutes = require("./routes/twoFactorAuth.routes");
const merchantUsersRoutes = require("./routes/merchant_user.routes");
const reportreviewRoutes = require("./routes/reportreview.routes");
const notifactionRoutes = require("./routes/notification.routes");
const transactionCodeRoutes = require("./routes/transactionCode.routes");
const LastReviewRoutes = require("./routes/LastReview.routes");
const pageRoutes = require("./routes/page.routes");
const trackPageRoutes = require("./routes/trackPage.routes");
const ReviewResponsesRoutes = require("./routes/ReviewResponse.routes");
const BrandRoutes = require("./routes/brand.routes");
const LikesRoutes = require("./routes/like.routes");
const LangRoutes = require("./routes/lang.routes");
const VeritatrustUsersRoutes = require("./routes/VeritatrustUsers.routes");
const cookieParser = require("cookie-parser");
const merchantReviewRoutes = require("./routes/merchant_review.routes");
const transactionsRoutes = require("./routes/transaction.routes");
const productreviewRoutes = require("./routes/product_review.routes");
const CashFlowRewardsRoutes = require("./routes/CashFlowReward.routes");
const VoucherGiftTransactionsRoutes = require("./routes/VoucherGiftTransactions.routes");
const VoucherGiftsRoutes = require("./routes/VoucherGift.routes");
const SubscriptionsRoutes = require("./routes/subscription.routes");
const userTransactionRoutes = require("./routes/userTransaction.routes");
const supportMessagesRoutes = require("./routes/supportMessage.routes");
const ReportResponsesRoutes = require("./routes/ReportResponse.routes");
const http = require("http");
const socketIo = require("socket.io");

const VeritatrustUsers = db.VeritatrustUsers;
dotenv.config();

/***
 * ajout du code pour la gestion des sessions
 *
 * */
const session = require("express-session");
const passport = require("passport");

const config = require("./appConfig");
const { create, findAll } = require("./controllers/merchant_review.controller");
const { create2 } = require("./controllers/product_review.controller");
const {
  getProducts,

  getProductByContainedWith,
  getProductById,
} = require("./controllers/products.controller");

const {
  createuser,
  getUserByEmail,
  finduserOrCreate,
  getUserByUsername,
  updateUserprofile,
} = require("./controllers/userprofile.controller");

const {
  getuserTransaction,
} = require("./controllers/userTransaction.controller");

const {
  getInvitations,
  getInvitations2,
} = require("./controllers/invitations.controller");
const axios = require("axios");

const {
  createTransaction,
  updateTransaction,
  updateTransaction2,
  getTransactionByJob_id,
} = require("./controllers/transaction.controller");

const merchantProfileRoutes = require("./routes/merchant_profile.routes");
const productsRoutes = require("./routes/products.routes");
const userprofileRoutes = require("./routes/userprofile.routes");

const configKey = require("./config");

const privateKey = configKey.encryptionKey;

require("./service/sendInvitation").emailInvitation;
require("./service/nodeCcdCronProduct").job.start();
require("./service/nodeCronLevelAccount").job.start();
require("./service/nodeCronStateMerchantProduct").merchantProfileJob.start();
require("./service/nodeCronStateMerchantProduct").productStatsJob.start();

//Declaration des Middlewares
const googleMiddlewareAuth = require("./middlewares/googleMiddleware");
const facebookMiddlewareAuth = require("./middlewares/facebookMiddleware");
const localMiddlewareAuth = require("./middlewares/localMiddleware");
const reviewMiddleware = require("./middlewares/reviewMiddleware");
const productMiddleware = require("./middlewares/productMiddleware");
const userprofileMiddleware = require("./middlewares/userprofileMiddleware");
const invitationMiddleware = require("./middlewares/invitationMiddleware");

var FileStore = require("session-file-store")(session);
const NodeCache = require("node-cache");
const myCache = new NodeCache();

var fileStoreOptions = {};

//require('./service/sendProductInvitations').emailProductInvitation;  //nodeCronStateMerchantProduct.js
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const port = 4000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serialize and deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = null;

    // Utilisez l'ID pour récupérer l'utilisateur de la table userprofile
    const userDataUserProfile = await userprofile.findByPk(id);

    if (userDataUserProfile) {
      // L'utilisateur est un utilisateur de l'application
      user = {
        ...userDataUserProfile.toJSON(),
        userRole: "user",
      };
      done(null, user);
    } else {
      // Essayez de récupérer l'utilisateur depuis la table VeritatrustUsers
      const userDataVeritatrustUsers = await VeritatrustUsers.findByPk(id);

      if (userDataVeritatrustUsers) {
        // L'utilisateur est un membre de l'équipe de support
        user = {
          ...userDataVeritatrustUsers.toJSON(),
          userRole: "admin",
        };
        done(null, user);
      } else {
        console.log(`Aucun utilisateur trouvé avec l'ID ${id}`);
        done(null, false); // Signale que l'utilisateur n'a pas été trouvé
      }
    }
  } catch (err) {
    console.error(err);
    done(err);
  }
});

//Utilises helmet
var helmet = require("helmet");
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // Autres directives...
      "img-src": ["'self'", "data:", "*"],
      "script-src": [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://js.hcaptcha.com",
        "https://unpkg.com",
        "https://code.jquery.com",
        "https://api.veritatrust.com",
        "*",
      ],
      "connect-src": [
        "'self'",
        "https://newassets.hcaptcha.com",
        "https://accounts.google.com",
        "https://api.cloudinary.com/v1_1/dnbpmsofq/image/upload",
        "https://api.cloudinary.com/v1_1/drbhco8al/image/upload",
        "http://dev.veritatrust.com",
      ],
      "frame-src": [
        "'self'",
        "https://newassets.hcaptcha.com",
        "https://accounts.google.com/o/oauth2/auth",
      ],
    },
  })
);

const enforceHttps = (req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
};
app.use(enforceHttps);

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Le reste de votre configuration et de vos routes...
app.use(cookieParser());
app.db = db;
app.use(express.json());

// Set up sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Configurer le middleware pour Redux
app.use((req, res, next) => {
  // Utilisez la propriété req.url pour obtenir le chemin de l'URL.
  const url = req.url;

  // Divisez le chemin de l'URL en segments en utilisant '/' comme séparateur.
  const segments = url.split("/");

  // Le segment 'en' ou 'fr' dans le chemin de l'URL est la langue.
  // Assurez-vous de vérifier s'il existe un segment valide avant de l'utiliser.
  if (segments.includes("it")) {
    req.CustomLang = "it";
  } else if (segments.includes("fr")) {
    req.CustomLang = "fr";
  } else {
    req.CustomLang = "en";
  }

  req.store = store;
  next();
});

app.db.sequelize
  .authenticate({
    logging: false,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

//! Use of Multer
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/images/"); // './public/images/' directory name where save the file
  },

  filename: (req, file, callBack) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({
  storage: storage,
});

// Fonction de génération de secret 2FA
const generateSecret = () => {
  // Générer un nouveau secret
  const secret = speakeasy.generateSecret();

  // Retourner le secret généré
  return secret;
};
/******************************************** facebook authentification ******************************************   */

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use("/api/auth/google", googleMiddlewareAuth);
app.use("/api/auth/facebook", facebookMiddlewareAuth);
app.use("/api", localMiddlewareAuth);

//Review middlewares

/***************************** Facebook & Google Associations Account  *********************************************  */

app.get(
  "/api/associate/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/associate/google/callback",
  passport.authenticate("google", {
    successRedirect: config["urlClients"].urlSuccessAssociated,
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

// Login and submit review

app.get("/api/loginandsubmit/facebook", passport.authenticate("facebook"));

app.get(
  "/api/loginandsubmit/facebook/callback",
  passport.authenticate("facebook")
);

app.get(
  "/api/loginandsubmit/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/loginandsubmit/google/callback",
  passport.authenticate("google", {
    successRedirect: config["urlClients"].urlSuccessAssociated,
    failureRedirect: config["urlClients"].urlRedirect,
  })
);

// Fin de l'associate

app.get("/api/historical/transaction/:id", getuserTransaction);
app.post("/api/data/merchant-review", create);
app.post("/api/data/findorcreate-user", finduserOrCreate);
app.post("/api/data/product-review", create2);
app.post("/api/data/user-data", createuser);
//app.post('/api/data/organic-product-review', create_product_org);
app.get("/api/data/merchant-review", findAll);
app.get("/api/data/products", getProducts);
app.get("/api/data/one-product/:product_name", getProductById);
app.get("/api/data/search-result", getProductByContainedWith);
app.get("/api/data/invitationdata/", getInvitations);
app.get("/api/data/invitationdata-completed/", getInvitations2);
app.get("/api/data/userdata", getUserByEmail); //getUserByUsername
app.get("/api/data/userinfos", getUserByUsername);
app.post("/api/data/merchantreview-invitation", create);
app.put("/api/data/transaction-update/:job_id", updateTransaction);
app.put("/api/data/transaction-update2/:job_id", updateTransaction2);
app.post("/api/data/transaction-create", createTransaction);
app.put("/api/data/update-personaldata", updateUserprofile);
app.get("/api/data/transaction-get/:job_id", getTransactionByJob_id);

// Callback
app.use("/api/merchant_profiles", merchantProfileRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/automatic-flow/resetpassword", userprofileRoutes);
app.use("/api/data/categories", categoriesRoutes);
app.use("/api/data/follow", followRoutes);
app.use("/api", ReviewResponsesRoutes);
app.use("/api", reviewMiddleware);
app.use("/api", productMiddleware);
app.use("/api", userprofileMiddleware);
app.use("/api", invitationMiddleware);
app.use("/api/reportreview", ReportResponsesRoutes);
app.use("/api/data", countriesRoutes);
app.use("/api/notification", notifactionRoutes);
app.use("/api/twofactor", twoFactorRoutes);
app.use("/api/brands", BrandRoutes);
app.use("/api/likes", LikesRoutes);
app.use("/api/langs", LangRoutes);
app.use("/api/veritatrustusers", VeritatrustUsersRoutes);
app.use("/api/merchantUsers", merchantUsersRoutes);
app.use("/api/support/merchantreviews", merchantReviewRoutes);
app.use("/api/support/productreviews", productreviewRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/transactionCode", transactionCodeRoutes);
app.use("/api/LastReviewRoutes", LastReviewRoutes);
app.use("/api/page", pageRoutes);
app.use("/api/track-page", trackPageRoutes);
app.use("/api/reportreview", reportreviewRoutes);

app.use("/api/supportmessages", supportMessagesRoutes);
app.use("/api/CashFlowRewardsRoutes", CashFlowRewardsRoutes);
app.use("/api/VoucherGiftTransactions", VoucherGiftTransactionsRoutes);
app.use("/api/VoucherGifts", VoucherGiftsRoutes);
app.use("/api/Subscriptions", SubscriptionsRoutes);
app.use("/api/userTransactions", userTransactionRoutes);

// Définissez une route pour récupérer les données depuis la base de données

app.get("/api/coinmarketcap", async (req, res) => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=HMT&convert=USD",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "38e1c295-a5ef-489a-8581-37bb6d9e13ce",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

app.get("/api/store-lang", (req, res) => {
  // Vous pouvez accéder à la valeur de 'lang' ici via req.lang
  const lang = req.query.lang;

  req.session.DetectedLang = lang;
  req.session.save();

  res.send(lang);
});

app.get("/api/get-stored-lang", (req, res) => {
  // Vous pouvez accéder à la valeur de 'lang' ici via req.lang

  res.send(req.session.DetectedLang);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  req.lang = req.params.lang;
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(port, () => {
  console.log("Serveur backend lancé sur le port " + port);
});
