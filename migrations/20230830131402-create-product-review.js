"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("product_review", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.STRING,
      },
      product_name: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      experience_date: {
        type: Sequelize.DATE,
      },
      order_id: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("published", "pending", "moderation", "deleted"),
      },
      job_id: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      merchant_id: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
      },
      image_video: {
        type: Sequelize.STRING,
      },

      lang_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("product_review");
  },
};
