"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vt_categories", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      vt_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vt_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      google_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_name_fr: {
        type: Sequelize.STRING,
        allowNull: false,
        collate: "utf8_general_ci",
      },
      category_name_it: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("vt_categories");
  },
};
