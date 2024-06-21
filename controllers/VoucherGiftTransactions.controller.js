'use strict';

const {
  response
} = require('express');

const db = require('../models/index');
const { Op } = require("sequelize");
const {
  QueryTypes
} = require('sequelize');
const {sendCodeTransaction} = require('../service/sendCodeTransaction');


const VoucherGiftTransactions = db.VoucherGiftTransaction;
const userprofile = db.userprofile;
const VoucherGift = db.VoucherGift;
const countries = db.countries;


exports.getVoucherGiftTransactionss = function (req, res) {


 VoucherGiftTransactions.findAll({ include: [
        {
          model: userprofile,
          attributes: ["id", "first_name", "last_name","gender","nickname","localAdress","city","country","userWalletAddress","level_account","currency","profile_url"],
        },
         {
          model: VoucherGift,
          attributes: ["id", "VoucherName","CountryId","VoucherCurrency","VoucherType","VoucherImage"],
          include: [
                {
                  model: countries,
                  attributes: ["id", "name"],
                },
                
       
          ],
        },
       
      ],})
.then((VoucherGiftTransactions) => {
  console.log(VoucherGiftTransactions);
  if (VoucherGiftTransactions) {
    res.status(200).json(VoucherGiftTransactions);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "VoucherGiftTransactionss Internal server error" });
});

  
};  

exports.getVoucherGiftTransactionsByUserId = function (req, res) {


 VoucherGiftTransactions.findAll({ 
     include: [
        {
          model: userprofile,
          attributes: ["id", "first_name", "last_name","gender","nickname","localAdress","city","country","userWalletAddress","level_account","currency","profile_url"],
        },
       {
          model: VoucherGift,
          attributes: ["id", "VoucherName","CountryId","VoucherCurrency","VoucherType","VoucherImage"],
           include: [
                {
                  model: countries,
                  attributes: ["id", "name"],
                },
                
       
          ],
        },
      ],
      where: {
        userId: req.params.userId,
      },
 })
.then((VoucherGiftTransactions) => {
  console.log(VoucherGiftTransactions);
  if (VoucherGiftTransactions) {
    res.status(200).json(VoucherGiftTransactions);
  } else {
    res.status(400).json(-1);
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).json({ error: "VoucherGiftTransactionss Internal server error" });
});

  
};  

exports.createVoucherGiftTransactions = function (req, res) {

    VoucherGiftTransactions.create(req.body)
    .then((VoucherGiftTransactions) => {
      console.log(VoucherGiftTransactions);
      if (VoucherGiftTransactions) {
        res.status(200).json(VoucherGiftTransactions);
      } else {
        res.status(400).json(-1);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "VoucherGiftTransactionss Internal server error" });
    });

};  

// Fonction pour mettre à jour les informations d'une transaction de bon cadeau existante
exports.updateVoucherGiftTransactions = function (req, res) {
    const transactionId = req.params.id; // Récupération de l'identifiant de la transaction depuis les paramètres de la requête
    const updateData = req.body; // Données de mise à jour fournies dans le corps de la requête

    // Mise à jour de la transaction en fonction de son identifiant
    VoucherGiftTransactions.update(updateData, { where: { id: transactionId } })
        .then((result) => { // Une fois la transaction mise à jour avec succès
            console.log(result); // Affichage du résultat de la mise à jour dans la console
            if (result[0] === 1) { // Si une ligne a été affectée (la transaction a été mise à jour avec succès)
                // Recherche de la transaction mise à jour pour la renvoyer dans la réponse
                VoucherGiftTransactions.findByPk(transactionId)
                    .then((updatedTransaction) => {
                             sendCodeTransaction(updatedTransaction.userId, updatedTransaction.VoucherCode)

                        res.status(200).json(updatedTransaction); // Réponse avec le statut 200 et la transaction mise à jour au format JSON
                    });
            } else {
                res.status(404).json({ error: "Transaction not found" }); // Si la transaction n'a pas été trouvée, réponse avec le statut 404 et un message d'erreur
            }
        })
        .catch((error) => { // En cas d'erreur lors de la mise à jour de la transaction
            console.error(error); // Affichage de l'erreur dans la console
            res.status(500).json({ error: "Internal server error" }); // Réponse avec le statut 500 et un message d'erreur générique
        });
};



exports.getVoucherGiftTransactionsById = function (req, res) {


 const sql = `SELECT * FROM VoucherGiftTransactions WHERE id=${req.params.id}`;
  db.sequelize.query(sql, {
    type: QueryTypes.SELECT
  }).then(results => {
    console.log(results);
    res.json(results);
  });
    
  
};  