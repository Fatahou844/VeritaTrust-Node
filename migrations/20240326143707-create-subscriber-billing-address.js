"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubscriberBillingAddresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      business_name: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      local_address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      zip_code: {
        type: Sequelize.STRING,
      },
      siren_company: {
        type: Sequelize.STRING,
      },
      vat_number: {
        type: Sequelize.STRING,
      },
      contact_first_name: {
        type: Sequelize.STRING,
      },
      contact_last_name: {
        type: Sequelize.STRING,
      },
      contact_email: {
        type: Sequelize.STRING,
      },
      contact_phone_number: {
        type: Sequelize.STRING,
      },
      merchant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "merchant_profile", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("SubscriberBillingAddresses");
  },
};
