"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      aw_image_url: {
        type: Sequelize.STRING,
      },
      aw_thumb_url: {
        type: Sequelize.STRING,
      },
      category_name: {
        type: Sequelize.STRING,
      },
      merchant_category: {
        type: Sequelize.STRING,
      },
      ean: {
        type: Sequelize.STRING,
      },
      model_number: {
        type: Sequelize.STRING,
      },
      product_name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      merchant_image_url: {
        type: Sequelize.STRING,
      },
      ReviewsNumber: {
        type: Sequelize.INTEGER,
      },
      ReviewMean: {
        type: Sequelize.FLOAT,
      },
      status: Sequelize.ENUM("1", "0"),
      category_id: Sequelize.INTEGER,
      Brand_id: Sequelize.INTEGER,
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
    await queryInterface.dropTable("products");
  },
};
