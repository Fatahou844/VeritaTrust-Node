'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userTransaction', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.ENUM('published', 'pending', 'rejected'),
        defaultValue: 'pending',
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('crypto', 'voucher'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      dateTransaction: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      veritacoins: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      voucherValue: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      voucherWebsite: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cryptoValue: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cryptoCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wallet_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '03916e0d-2fbe-4ab3-90de-95b2ad24b87d',
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
    await queryInterface.dropTable('userTransaction');
  },
};
