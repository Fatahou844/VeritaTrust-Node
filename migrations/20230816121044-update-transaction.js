'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      merchant_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hash_transaction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transaction_state: {
        type: Sequelize.ENUM('pending', 'completed'),
        defaultValue: 'pending',
        allowNull: true,
      },
      transaction_state_2: {
        type: Sequelize.ENUM('pending', 'completed'),
        defaultValue: 'pending',
        allowNull: true,
      },
      transaction_state_3: {
        type: Sequelize.ENUM('pending', 'completed'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('transaction');
  },
};
