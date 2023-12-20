'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Brands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Category_id: {
        type: Sequelize.STRING
      },
      Brand_name: {
        type: Sequelize.STRING
      },
      Category: {
        type: Sequelize.STRING
      },
      
       BrandLogo: Sequelize.STRING,
    status: {
        type: Sequelize.ENUM('0','1'),
        defaultValue: '0',
        allowNull: true,
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
    await queryInterface.dropTable('Brands');
  }
};