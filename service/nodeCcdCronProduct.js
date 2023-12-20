//const { deployEscrowContract } = require('./deployEscrowProduct');
//const { deployEscrowContract } = require('./deployCcdEscrowProduct');
const nodeCron = require("node-cron");
const sequelize = require('sequelize');
const db = require('../models/index');


const job = nodeCron.schedule("*/1 * * * *", async function cronJob() {
  console.log('job run', new Date().toLocaleString());
 
  const deployContent = [];
  
  try {
      
        
  db.sequelize.query(`UPDATE product_review SET proof_purchase = 'deneme' where status = 'deleted'`, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        });
        

    // res.json(results);
  } catch (err) {
    console.log(err);
  }
});


module.exports.job = job;
