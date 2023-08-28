'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vt_categories', {
      google_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      vt_category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category_parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'vt_categories',
          key: 'google_category_id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vt_categories');
  }
};
