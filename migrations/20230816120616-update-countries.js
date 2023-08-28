'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('countries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_fr: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_es: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_it: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name_de: {
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
    await queryInterface.dropTable('countries');
  },
};
