const { deployEscrowContract } = require('./deployEscrowMerchant');
const nodeCron = require("node-cron");
const sequelize = require('sequelize');
const db = require('../models/index');


 async function cronJob() {
  console.log('job run', new Date().toLocaleString());
  const deployContent = [];
  try {
    const sql_select =  `SELECT * FROM merchant_review where status = 'pending'`;

    const results = await db.sequelize.query(sql_select, { type: sequelize.QueryTypes.SELECT });
    console.log(results);

    results.forEach(element => {
      deployContent.push({
        content: element.content,
        job_id: element.job_id
      });
      
      const sql_ =  `SELECT COUNT(*) FROM merchant_review where merchant_id = '${element.merchant_id}' and status = 'published'`;
      
      db.sequelize.query(sql_, { type: sequelize.QueryTypes.SELECT }).then(res => {
            
            res.forEach(ele => {
                
                deployEscrowContract(deployContent, element.job_id, element.user_id, element.merchant_id, element.rating, ele.ReviewsNumber);
            
            });
            
            console.log('deployContent.length',deployContent.length);
        // res.json(results);
        });
    });

    console.log('deployContent.length', deployContent.length);
    // res.json(results);
  } catch (err) {
    console.log(err);
  }
}

cronJob();



