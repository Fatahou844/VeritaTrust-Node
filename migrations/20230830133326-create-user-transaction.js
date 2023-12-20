"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userTransaction", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("published", "pending", "rejected"),
      },
      type: {
        type: Sequelize.ENUM("crypto", "voucher"),
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      dateTransaction: {
        type: Sequelize.DATE,
      },
      veritacoins: {
        type: Sequelize.STRING,
      },
      voucherValue: {
        type: Sequelize.STRING,
      },
      voucherWebsite: {
        type: Sequelize.STRING,
      },
      cryptoValue: {
        type: Sequelize.STRING,
      },
      cryptoCode: {
        type: Sequelize.STRING,
      },
      wallet_id: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userTransaction");
  },
};
