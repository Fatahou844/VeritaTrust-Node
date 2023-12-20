"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaction", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      merchant_id: {
        type: Sequelize.STRING,
      },
      order_id: {
        type: Sequelize.STRING,
      },
      transaction_id: {
        type: Sequelize.STRING,
      },
      hash_transaction: {
        type: Sequelize.STRING,
      },
      transaction_state: {
        type: Sequelize.ENUM("pending", "completed"),
      },
      transaction_state_2: {
        type: Sequelize.ENUM("pending", "completed"),
      },
      transaction_state_3: {
        type: Sequelize.ENUM("pending", "completed"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      proofOfPurchase: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM("0", "1") },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaction");
  },
};
