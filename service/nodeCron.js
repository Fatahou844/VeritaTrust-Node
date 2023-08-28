const { deployEscrowContract } = require('./deployEscrow');
const nodeCron = require("node-cron");
const sequelize = require('sequelize');
const db = require('../models/index');


const job = nodeCron.schedule("*/15 * * * * *", function cronJob() {
    console.log('job run', new Date().toLocaleString());
    const deployContent = [];
    try {
        const sql_select =  `SELECT * FROM product_review where status = 'pending'`;

        db.sequelize.query(sql_select, { type: sequelize.QueryTypes.SELECT }).then(results => {
            console.log(results);

            results.forEach(element => {
                deployContent.push(
                    {
                        content: element.content,
                        job_id: element.job_id
                    }
                )
                 deployEscrowContract(deployContent, element.job_id);
            
            });
            console.log('deployContent.length',deployContent.length);
        // res.json(results);
        });

    } catch (err) {
        console.log(err)
    }
    
});

module.exports.job = job;
