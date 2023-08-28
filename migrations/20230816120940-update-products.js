'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      aw_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aw_thumb_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      merchant_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ean: {
        type: Sequelize.STRING,
      },
      model_number: {
        type: Sequelize.STRING,
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      merchant_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ReviewsNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      ReviewMean: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
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
    await queryInterface.dropTable('products');
  },
};
