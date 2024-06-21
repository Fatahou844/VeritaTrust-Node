'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CashFlowRewards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TotalInflow: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      TotalCashflow: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      TotalAmountPending: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "userprofile", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CashFlowRewards');
  }
};
