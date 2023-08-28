"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  like.init(
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
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      like_type: {
        type: DataTypes.ENUM('merchant_review', 'product_review'),
        allowNull: false,
      },
      
      status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
      },

    },
    {
      sequelize,
      modelName: "like",
      tableName: "like",
    }
  );
  return like;
};
