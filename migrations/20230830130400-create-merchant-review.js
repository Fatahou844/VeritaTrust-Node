"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("merchant_review", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        defaultValue: "pending",
      },
      isAnswered: {
        type: Sequelize.ENUM("0", "1"),
        defaultValue: "0",
      },
      addShowCase: {
        type: Sequelize.ENUM("0", "1"),
        defaultValue: "0",
      },
      favorite: {
        type: Sequelize.ENUM("0", "1"),
        defaultValue: "0",
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
        type: Sequelize.STRING(2048),
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
    await queryInterface.dropTable("merchant_review");
  },
};
