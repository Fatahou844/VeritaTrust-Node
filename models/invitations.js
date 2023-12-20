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
    Delivery_status: DataTypes.STRING,
    invitation_type: DataTypes.STRING,
    Sent_at: DataTypes.DATE,
    Recipient: DataTypes.STRING,
    profile_id: DataTypes.STRING,
    invitation_url: DataTypes.STRING,
    invitation_url_complete: DataTypes.STRING,
    domaine_name: DataTypes.STRING,
    message_id: DataTypes.STRING,
    has_sent: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'invitations',
  });
  return invitations;
};