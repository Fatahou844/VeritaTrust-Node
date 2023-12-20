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
        allowNull: true,
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
     Brand_id: {
      type: Sequelize.INTEGER,
      allowNull: true
      },
      merchant_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false
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
      status: {
        type: Sequelize.ENUM('0','1'),
        defaultValue: '0',
        allowNull: true,
      },
       PageViewsNb: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable('products');
  },
};
