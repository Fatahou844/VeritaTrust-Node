'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VoucherGiftTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      VoucherGiftId: {
        type: Sequelize.INTEGER,
          references: {
          model: "VoucherGifts", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      VoucherCode: {
        type: Sequelize.STRING
      },
      Amount: {
        type: Sequelize.FLOAT
      },
      userId: {
        type: Sequelize.INTEGER,
          references: {
          model: "userprofile", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM('0','1','2')
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
    await queryInterface.dropTable('VoucherGiftTransactions');
  }
};