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
    Reference_number: DataTypes.STRING,
    customer_firstname: DataTypes.STRING,
    customer_lastname: DataTypes.STRING,
    Delivery_status: {type: DataTypes.ENUM('Delivered', 'Not delivered', 'First_open', 'Cliqued', 'In progress'),
         defaultValue: 'In progress',
    },
    invitation_type: DataTypes.ENUM('merchant_review', 'product_review', 'hybrid','reminder'),
    Sent_at: DataTypes.DATE,
    Recipient: DataTypes.STRING,
    profile_id: DataTypes.STRING,
    invitation_url: DataTypes.STRING,
    invitation_url_complete: DataTypes.STRING(2047),
    domaine_name: DataTypes.STRING,
    message_id: DataTypes.STRING,
    has_sent: DataTypes.INTEGER,
    source: {type: DataTypes.ENUM('Woocommerce', 'Prestashop', 'Shopify','Magento','Others'),
         defaultValue: 'Others',
    }
  }, {
    sequelize,
    modelName: 'invitations',
  });
  return invitations;
};