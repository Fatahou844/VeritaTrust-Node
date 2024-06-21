"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      notification_type: {
        type: DataTypes.ENUM('following', 'emailing','support'),
        allowNull: false,
      },
      
      status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
      },
      
      isViewed: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
        defaultValue: '0'
      },
      
    message: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    },
    {
      sequelize,
      modelName: "notification",
      tableName: "notification",
    }
  );
  return notification;
};
