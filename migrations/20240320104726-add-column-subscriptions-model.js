"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Subscriptions", "MonthlyReview", {
      type: Sequelize.INTEGER,
      defaultValue: 200,
    });
    await queryInterface.addColumn("Subscriptions", "EmailInviteCustom", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Subscriptions", "CustomerSupport", {
      type: Sequelize.ENUM("0", "1", "2"),
      defaultValue: "0",
    });
    await queryInterface.addColumn("Subscriptions", "InviteFromPastCustomers", {
      type: Sequelize.INTEGER,
      defaultValue: "0",
    });
    await queryInterface.addColumn("Subscriptions", "dashboard", {
      type: Sequelize.ENUM("0", "1", "2"),
      defaultValue: "0",
    });
    await queryInterface.addColumn("Subscriptions", "QandAonProductPage", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Subscriptions", "LocalReviews", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Subscriptions", "MultiUserDomain", {
      type: Sequelize.ENUM("0", "1", "2"),
      defaultValue: "0",
    });
    await queryInterface.addColumn("Subscriptions", "NetPromoterScore", {
      type: Sequelize.BOOLEAN,
      defaultValue: "0",
    });
    await queryInterface.addColumn(
      "Subscriptions",
      "GoogleShoppingSEOReviewWidget",
      {
        type: Sequelize.BOOLEAN,
        defaultValue: "0",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Subscriptions", "MonthlyReview");
    await queryInterface.removeColumn("Subscriptions", "EmailInviteCustom");
    await queryInterface.removeColumn("Subscriptions", "CustomerSupport");
    await queryInterface.removeColumn(
      "Subscriptions",
      "InviteFromPastCustomers"
    );
    await queryInterface.removeColumn("Subscriptions", "dashboard");
    await queryInterface.removeColumn("Subscriptions", "QandAonProductPage");
    await queryInterface.removeColumn("Subscriptions", "LocalReviews");
    await queryInterface.removeColumn("Subscriptions", "MultiUserDomain");
    await queryInterface.removeColumn("Subscriptions", "NetPromoterScore");
    await queryInterface.removeColumn(
      "Subscriptions",
      "GoogleShoppingSEOReviewWidget"
    );
  },
};
