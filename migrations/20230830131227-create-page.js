"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("page", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pageName: {
        type: Sequelize.STRING,
      },
      pageType: {
        type: Sequelize.ENUM(
          "home",
          "authentication",
          "merchant profile",
          "product profile",
          "category",
          "account",
          "user profile",
          "review",
          "other"
        ),
      },
      pageUrl: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("page");
  },
};
