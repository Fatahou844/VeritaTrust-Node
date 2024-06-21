'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invitations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  invitations.init({
    Reference_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Delivery_status: {
      type: DataTypes.ENUM('Delivered', 'Not delivered', 'First_open', 'Cliqued','In progress'),
      allowNull: true,
      defaultValue: 'In progress',
    },
    invitation_type: {
      type: DataTypes.ENUM('merchant_review', 'product_review', 'hybrid','reminder'),
      allowNull: true
    },
    Sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Recipient: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invitation_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invitation_url_complete: {
      type: DataTypes.STRING(2047),
      allowNull: true
    },
    domaine_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    has_sent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    source: {type: DataTypes.ENUM('Woocommerce', 'Prestashop', 'Shopify','Magento','Others'),
              defaultValue: 'Others',
    }
  }, {
    sequelize,
    modelName: 'invitations',
    tableName: 'invitations'
  });
  return invitations;
};