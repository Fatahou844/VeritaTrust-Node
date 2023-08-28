"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class twoFactorAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  twoFactorAuth.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      secret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActivated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      twoFactorySecretTemp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "twoFactorAuth",
      tableName: "twoFactorAuth",
    }
  );
  return twoFactorAuth;
};
