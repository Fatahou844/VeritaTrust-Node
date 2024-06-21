'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invitations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Reference_number: {
        type: Sequelize.STRING
      },
      customer_firstname: {
        type: Sequelize.STRING
      },
      customer_lastname: {
        type: Sequelize.STRING
      },
      Delivery_status: {
        type: Sequelize.ENUM('Delivered', 'Not delivered', 'First_open', 'Cliqued', 'In progress'),
        defaultValue: 'In progress',
      },
      invitation_type: {
        type: Sequelize.ENUM('merchant_review', 'product_review', 'hybrid','reminder'),
      },
      Sent_at: {
        type: Sequelize.DATE
      },
      Recipient: {
        type: Sequelize.STRING
      },
      profile_id: {
        type: Sequelize.STRING
      },
      invitation_url: {
        type: Sequelize.STRING
      },
      invitation_url_complete: {
        type: Sequelize.STRING(2047)
      },
      domaine_name: {
        type: Sequelize.STRING
      },
      message_id: {
        type: Sequelize.STRING
      },
      has_sent: {
        type: Sequelize.INTEGER
      },
      
      source: {
        type: Sequelize.ENUM('Woocommerce', 'Prestashop', 'Shopify','Magento','Others'),
        defaultValue: 'Others',
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
    await queryInterface.dropTable('invitations');
  }
};