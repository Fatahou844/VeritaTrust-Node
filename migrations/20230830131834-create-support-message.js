"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("supportMessage", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      issueType: {
        type: Sequelize.ENUM("account", "review", "reward", "payment", "other"),
      },
      subject: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING(2048),
      },
      image: {
        type: Sequelize.STRING(1024),
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
    await queryInterface.dropTable("supportMessage");
  },
};
