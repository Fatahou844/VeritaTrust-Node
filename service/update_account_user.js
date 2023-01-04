
var mysql = require("mysql2");
const nodeCron = require("node-cron");


var dbConn = mysql.createConnection({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_NAME
});

const job = nodeCron.schedule("*/15 * * * * *", function cronJob() {
    
    try {
        dbConn.query("SELECT * FROM user_profile ", function (err, result) {
            if (err) {
                err;
            }
          
            result.forEach(element => {
                
                
                dbConn.query("SELECT count(*) as nombre FROM reward  where User_id = ?",element.id, function (err, result) {
                            if (err) {
                                err;
                            }
                          
                            result.forEach(ele => {
                                
                                // Newbie
                                
                                 if(ele.nombre < 6)
                                  
                                 dbConn.query("UPDATE user_profile SET level_account = ?  where id = ?",[parseInt(0), element.id], function (err, result) {
                                            if (err) {
                                                err;
                                            }
                                            console.log(result.affectedRows + " record(s)  and  updated");
                                        });
                                        
                                    // Bronzer
                                        
                                  else if (ele.nombre < 21)
                                  
                                     dbConn.query("UPDATE user_profile SET level_account = ?  where id = ?",[parseInt(1), element.id], function (err, result) {
                                            if (err) {
                                                err;
                                            }
                                            console.log(result.affectedRows + " record(s)  and  updated");
                                        });
                                        
                                        // Silver
                                  
                                  else if (ele.nombre < 51)
                                  
                                      dbConn.query("UPDATE user_profile SET level_account = ?  where id = ?",[parseInt(2), element.id], function (err, result) {
                                            if (err) {
                                                err;
                                            }
                                            console.log(result.affectedRows + " record(s)  and  updated");
                                        });
                                  
                                  else if (ele.nombre < 100)
                                  
                                  // Gold
                                  
                                     dbConn.query("UPDATE user_profile SET level_account = ?  where id = ?",[parseInt(3), element.id], function (err, result) {
                                            if (err) {
                                                err;
                                            }
                                            console.log(result.affectedRows + " record(s)  and  updated");
                                        });
                                        
                                  // Planntium
                                  
                                  else
                                  
                                     dbConn.query("UPDATE user_profile SET level_account = ?  where id = ?",[parseInt(4), element.id], function (err, result) {
                                            if (err) {
                                                err;
                                            }
                                            console.log(result.affectedRows + " record(s)  and  updated");
                                        });
                            
                            });
                            
                        });

                  
                  /********************************/  
            
            });
            
        });

    } catch (err) {
        console.log(err)
    }
    
});

module.exports.job = job;
