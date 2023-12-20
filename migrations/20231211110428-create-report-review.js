'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReportReviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reportUserId: {
        type: Sequelize.INTEGER
      },
      reportSource: {
        type: Sequelize.ENUM('merchant','user')
      },
      motif: {
        type: Sequelize.ENUM('duplicate','spam','profanity','other')
      },
      reviewType: {
        type: Sequelize.ENUM('merchant_review','product_review')
      },
      reviewId: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING(2048)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReportReviews');
  }
};