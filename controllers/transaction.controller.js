const db = require("../models/index");
const transaction = db.transaction;
const { body, validationResult, param } = require("express-validator");

exports.findAll = function (req, res) {
  transaction.findAll(function (err, transaction) {
    console.log("controller");
    if (err) res.send(err);
    console.log("res", transaction);
    res.send(transaction);
  });
};
exports.create = function (req, res) {
  const new_transaction = new transaction(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    transaction.create(new_transaction, function (err, transaction) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: "transaction added successfully!",
        data: transaction,
      });
    });
  }
};
exports.findById = function (req, res) {
  transaction.findById(req.params.id, function (err, transaction) {
    if (err) res.send(err);
    res.json(transaction);
  });
};
exports.delete = function (req, res) {
  transaction.delete(req.params.id, function (err, transaction) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "transaction successfully deleted",
    });
  });
};
/*exports.createTransaction = async function (req, res) {
  //create user
  var data = transaction.create({
    user_id: req.body.user_id,
    merchant_id: req.body.merchant_id,
    order_id: req.body.order_id
  });
  return data;
};  */

const validateTransaction = [
  body("user_id").isInt().withMessage("User ID must be integer"),
  body("merchant_id").isInt().withMessage("User ID must be integer"),
  body("order_id").isString().escape().withMessage("Order ID must be a string"),
  body("transaction_id")
    .isString()
    .trim()
    .escape()
    .withMessage("Transaction ID be a string"),
  body("proofOfPurchase")
    .isString()
    .withMessage("Proof of Purchase must be a string"),
];

// exports.createTransaction = validateTransaction, function (req, res) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     //create user
//     transaction
//       .create({
//         user_id: req.body.user_id,
//         merchant_id: req.body.merchant_id,
//         order_id: req.body.order_id,
//         transaction_id: req.body.transaction_id,
//         proofOfPurchase: req.body.proofOfPurchase,
//       })
//       .then((user) => {
//         //if user created, send success
//         if (user) {
//           res.status(200).send("Transaction created successfully");
//         }
//         //if user not created, send error
//         else {
//           res.status(400).send("Transaction not created");
//         }
//       });
//   };

exports.createTransaction = [
  // Inclure les middlewares de validation
  ...validateTransaction,

  // La fonction de gestion de la requête
  async (req, res) => {
    // Gérer les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Créer la transaction
      const transaction = await transaction.create({
        user_id: req.body.user_id,
        merchant_id: req.body.merchant_id,
        order_id: req.body.order_id,
        transaction_id: req.body.transaction_id,
        proofOfPurchase: req.body.proofOfPurchase,
      });

      if (transaction) {
        res.status(200).send("Transaction created successfully");
      } else {
        res.status(400).send("Transaction not created");
      }
    } catch (err) {
      res.status(500).send("Internal server error");
    }
  },
];

exports.getAllTransaction = function (req, res) {
  // Find all transactions
  transaction
    .findAll({
      order: [["createdAt", "DESC"]], // Tri par createdAt en mode DESC
    })
    .then((transactions) => {
      // Send the transactions as a response
      res.status(200).json(transactions);
    })
    .catch((error) => {
      // Handle any potential errors
      console.error("Error retrieving transactions:", error);
      res.status(500).send("Internal server error transaction");
    });
};

exports.updateTransaction = function (req, res) {
  //create user
  var data = transaction
    .update(
      {
        transaction_state: "completed",
      },
      {
        where: {
          transaction_id: req.params["job_id"],
        },
      }
    )
    .then((merchant) => {
      if (merchant) {
        res.status(200).send("Transaction have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};
exports.updateTransaction2 = function (req, res) {
  //create user
  var data = transaction
    .update(
      {
        transaction_state_2: "completed",
      },
      {
        where: {
          transaction_id: req.params["job_id"],
        },
      }
    )
    .then((merchant) => {
      if (merchant) {
        res.status(200).send("Transaction have been updated successfully");
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.updateTransactionStatus = function (req, res) {
  //create user
  var data = transaction
    .update(req.body, {
      where: {
        transaction_id: req.params["job_id"],
      },
    })
    .then((transaction) => {
      if (transaction) {
        res.status(200).send(transaction);
      } else {
        res.status(400).send("error updated");
      }
    });
};

exports.getTransactionByJob_id = function (req, res) {
  transaction
    .findOne({ where: { transaction_id: req.params["job_id"] } })
    .then((transac) => {
      if (transac) {
        res.status(200).json(transac);
      }
      //if productreview not created, send error
      else {
        res.status(400).send("error to select");
      }
    });
};
