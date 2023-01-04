const { deployEscrowContract } = require('./deployEscrow');
var mysql = require("mysql2");
const nodeCron = require("node-cron");
var mysql = require("mysql2");

var dbConn = mysql.createConnection({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_NAME
});

const job = nodeCron.schedule("*/15 * * * * *", function cronJob() {
    console.log('job run', new Date().toLocaleString());
    const deployContent = [];
    try {
        dbConn.query("SELECT * FROM product_review where status = 'pending'", function (err, result) {
            if (err) {
                err;
            }
            console.log("seelct qr", result);
            result.forEach(element => {
                deployContent.push(
                    {
                        content: element.content,
                        job_id: element.job_id
                    }
                )
                 deployEscrowContract(deployContent, dbConn, element.job_id);
            
            });
            console.log('deployContent.length',deployContent.length);
        });

    } catch (err) {
        console.log(err)
    }
    
});

module.exports.job = job;
