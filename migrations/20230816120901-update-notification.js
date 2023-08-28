'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notification_type: {
        type: Sequelize.ENUM('following', 'emailing'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
      },
      isViewed: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('notification');
  },
};
