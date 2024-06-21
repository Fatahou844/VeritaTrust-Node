'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brandBadges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      brandId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Brand", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM('0','1')
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
    await queryInterface.dropTable('brandBadges');
  }
};