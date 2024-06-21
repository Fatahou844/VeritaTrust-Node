'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VoucherGifts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      VoucherName: {
        type: Sequelize.STRING
      },
        CountryId: {
        type: Sequelize.INTEGER,
          references: {
          model: "countries", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
         VoucherCurrency: {
        type: Sequelize.ENUM("0","1","2","3"),
      },
         VoucherType: {
        type: Sequelize.ENUM("0","1"),
      },
         VoucherImage: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('VoucherGifts');
  }
};