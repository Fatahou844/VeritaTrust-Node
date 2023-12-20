'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userprofile', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateNaissance: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      localAdress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zip: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userWalletAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_rewards: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      level_account: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      facebookId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verification_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      currency: {
        type: Sequelize.ENUM('€', '$'),
        defaultValue: '€',
        allowNull: true,
      },
      profile_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twoFactorAuthEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      twoFactorAuthSecret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twoFactorAuthSecretTemp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      CodeLangSession: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('userprofile');
  },
};
