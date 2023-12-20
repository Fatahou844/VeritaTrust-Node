"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userprofile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      nickname: {
        type: Sequelize.STRING,
      },
      dateNaissance: {
        type: Sequelize.DATE,
      },
      localAdress: {
        type: Sequelize.STRING,
      },
      zip: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      userWalletAddress: {
        type: Sequelize.STRING,
      },
      total_rewards: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      level_account: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      facebookId: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      googleId: {
        type: Sequelize.STRING,
      },
      verification_token: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      currency: {
        type: Sequelize.ENUM("$", "€"),
        defaultValue: "$",
      },
      profile_url: {
        type: Sequelize.STRING,
      },
      twoFactorAuthEnabled: {
        type: Sequelize.BOOLEAN,
      },
      twoFactorAuthSecret: {
        type: Sequelize.STRING,
      },
      twoFactorAuthSecretTemp: {
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
    await queryInterface.dropTable("userprofile");
  },
};
