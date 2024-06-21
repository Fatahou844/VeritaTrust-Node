"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubscriberAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.SubscriberAddress.belongsTo(models.merchant_profile, {
        foreignKey: "merchant_id",
      });
    }
  }
  SubscriberAddress.init(
    {
      business_name: DataTypes.STRING,
      country: DataTypes.STRING,
      local_address: DataTypes.STRING,
      city: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      siren_company: DataTypes.STRING,
      vat_number: DataTypes.STRING,
      contact_first_name: DataTypes.STRING,
      contact_last_name: DataTypes.STRING,
      contact_email: DataTypes.STRING,
      contact_phone_number: DataTypes.STRING,
      some_address_billing: DataTypes.BOOLEAN,
      merchant_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SubscriberAddress",
    }
  );
  return SubscriberAddress;
};
