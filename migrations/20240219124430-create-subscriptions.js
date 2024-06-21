'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscriptionPlan: {
        type: Sequelize.ENUM('0','1','2','3')
      },
      expirationDate: {
        type: Sequelize.DATE
      },
      apiToken: {
        type: Sequelize.STRING
      },
      merchantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
          references: {
          model: "merchant_profile", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM('0','1','2','3')
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
    await queryInterface.dropTable('Subscriptions');
  }
};