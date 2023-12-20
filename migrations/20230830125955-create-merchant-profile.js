"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("merchant_profile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      logo: {
        type: Sequelize.STRING,
      },
      corporate_name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      website: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      merchant_user_id: {
        type: Sequelize.INTEGER,
      },
      country_id: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      zip_code: {
        type: Sequelize.INTEGER,
      },
      category_1: {
        type: Sequelize.STRING,
      },
      category_2: {
        type: Sequelize.STRING,
      },
      category_3: {
        type: Sequelize.STRING,
      },
      last_session: {
        type: Sequelize.DATE,
      },
      invitation_delay: {
        type: Sequelize.INTEGER,
      },
      invitation_delay_product_review: {
        type: Sequelize.INTEGER,
      },
      ReviewsNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      ReviewMean: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
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
    await queryInterface.dropTable("merchant_profile");
  },
};
