const sequelize = require("sequelize");
const db = require("../models/index");
const nodeCron = require("node-cron");
const {inviteReminder} = require("./inviteReminder");

const emailInvitationReminder = nodeCron.schedule(
  "*/30 * * * * *",
  function cronJob() {
    console.log("emailInvitation run", new Date().toLocaleString());

    const sql_ = `SELECT * FROM transaction where transaction_state = 'pending'`;

    db.sequelize
      .query(sql_, { type: sequelize.QueryTypes.SELECT })
      .then((res) => {
        res.forEach((ele) => {
          inviteReminder(ele.transaction_id);
        });
      });

    try {
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports.emailInvitationReminder = emailInvitationReminder;
